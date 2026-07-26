/**
 * APTListings ApiClient와 동일: Python curl_cffi (chrome120 impersonate) 브리지
 * 서버 전용 — 클라이언트 컴포넌트에서 import 금지
 */
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import { resolve } from "path";
import { createInterface } from "readline";

type BridgeRequest = {
  id: number;
  method: "GET" | "POST";
  path: string;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  referer?: string;
};

type BridgeResponse = {
  id?: number | null;
  ok: boolean;
  ready?: boolean;
  data?: Record<string, unknown>;
  error?: string;
  status?: number;
};

let proc: ChildProcessWithoutNullStreams | null = null;
let nextId = 1;
let starting: Promise<void> | null = null;
const pending = new Map<
  number,
  { resolve: (v: BridgeResponse) => void; reject: (e: Error) => void }
>();

function bridgeScriptPath() {
  return resolve(process.cwd(), "scripts/npay-bridge.py");
}

function pythonCmd() {
  return (
    process.env.NPAY_PYTHON?.trim() ||
    process.env.NAVER_LAND_PYTHON?.trim() ||
    "python"
  );
}

function handleLine(line: string) {
  let msg: BridgeResponse;
  try {
    msg = JSON.parse(line) as BridgeResponse;
  } catch {
    return;
  }
  if (msg.ready) return;
  const id = msg.id;
  if (typeof id !== "number") return;
  const wait = pending.get(id);
  if (!wait) return;
  pending.delete(id);
  wait.resolve(msg);
}

async function ensureBridge(requestIntervalSec = 1.0): Promise<void> {
  if (proc && !proc.killed) return;
  if (starting) return starting;

  starting = new Promise<void>((resolveStart, rejectStart) => {
    const child = spawn(
      pythonCmd(),
      [bridgeScriptPath(), String(requestIntervalSec)],
      {
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1",
        },
      },
    );
    proc = child;

    const rl = createInterface({ input: child.stdout });
    let ready = false;

    const failAll = (err: Error) => {
      for (const [, w] of pending) w.reject(err);
      pending.clear();
      proc = null;
      starting = null;
    };

    rl.on("line", (line) => {
      if (!ready) {
        try {
          const msg = JSON.parse(line) as BridgeResponse;
          if (msg.ready || msg.ok) {
            ready = true;
            starting = null;
            resolveStart();
            return;
          }
          if (msg.error) {
            failAll(new Error(msg.error));
            rejectStart(new Error(msg.error));
            return;
          }
        } catch {
          /* continue */
        }
      }
      handleLine(line);
    });

    child.stderr.on("data", (buf: Buffer) => {
      const t = buf.toString("utf8").trim();
      if (t) console.error("[npay-bridge]", t.slice(0, 400));
    });

    child.on("error", (err) => {
      failAll(err);
      if (!ready) rejectStart(err);
    });

    child.on("close", (code) => {
      failAll(new Error(`npay-bridge 종료 (code ${code})`));
      if (!ready) {
        rejectStart(
          new Error(
            `Python curl_cffi 브리지 시작 실패 (code ${code}). pip install curl_cffi`,
          ),
        );
      }
    });

    setTimeout(() => {
      if (!ready) {
        try {
          child.kill();
        } catch {
          /* ignore */
        }
        rejectStart(new Error("npay-bridge 시작 타임아웃"));
      }
    }, 15000);
  });

  return starting;
}

export async function isPythonBridgeAvailable(): Promise<boolean> {
  try {
    await ensureBridge();
    return true;
  } catch {
    return false;
  }
}

export async function bridgeRequest(
  method: "GET" | "POST",
  path: string,
  opts?: {
    params?: Record<string, string | number | boolean>;
    body?: unknown;
    referer?: string;
    requestIntervalSec?: number;
  },
): Promise<Record<string, unknown>> {
  await ensureBridge(opts?.requestIntervalSec ?? 1.0);
  if (!proc?.stdin) throw new Error("npay-bridge 없음");

  const id = nextId++;
  const payload: BridgeRequest = {
    id,
    method,
    path,
    params: opts?.params,
    body: opts?.body,
    referer: opts?.referer,
  };

  const result = await new Promise<BridgeResponse>((resolveP, rejectP) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      rejectP(new Error("npay-bridge 응답 타임아웃"));
    }, 120_000);
    pending.set(id, {
      resolve: (v) => {
        clearTimeout(timer);
        resolveP(v);
      },
      reject: (e) => {
        clearTimeout(timer);
        rejectP(e);
      },
    });
    proc!.stdin.write(`${JSON.stringify(payload)}\n`);
  });

  if (!result.ok || !result.data) {
    throw new Error(result.error || "Npay API 브리지 오류");
  }
  return result.data;
}

export async function stopPythonBridge() {
  if (!proc) return;
  try {
    proc.stdin.write(`${JSON.stringify({ id: 0, cmd: "quit" })}\n`);
  } catch {
    /* ignore */
  }
  try {
    proc.kill();
  } catch {
    /* ignore */
  }
  proc = null;
}
