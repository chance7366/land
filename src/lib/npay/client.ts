/**
 * fin.land.naver.com front-api 클라이언트
 * Python curl_cffi (chrome120) 브리지 우선 — Node fetch는 429 위험
 * 서버 전용 — 클라이언트 컴포넌트에서 import 금지
 */

import { bridgeRequest, isPythonBridgeAvailable } from "./python-bridge";

type Json = Record<string, unknown>;

const BASE_URL = "https://fin.land.naver.com/front-api/v1";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NpayApiError";
  }
}

export class NpayClient {
  private lastAt = 0;
  private bootstrapped = false;
  private useBridge: boolean | null = null;

  constructor(private requestIntervalMs = 1000) {}

  private async preferBridge(): Promise<boolean> {
    if (this.useBridge != null) return this.useBridge;
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      this.useBridge = false;
      return false;
    }
    if (process.env.NPAY_FORCE_FETCH === "1") {
      this.useBridge = false;
      return false;
    }
    this.useBridge = await isPythonBridgeAvailable();
    if (!this.useBridge) {
      console.warn(
        "[npay] Python curl_cffi 브리지 없음 → Node fetch (429 가능). pip install curl_cffi",
      );
    } else {
      console.log("[npay] Python curl_cffi 브리지 사용");
    }
    return this.useBridge;
  }

  async bootstrap() {
    if (this.bootstrapped) return;
    if (await this.preferBridge()) {
      this.bootstrapped = true;
      return;
    }
    for (const url of [
      "https://www.naver.com",
      "https://fin.land.naver.com/map",
    ]) {
      try {
        await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
      } catch {
        /* ignore */
      }
      await sleep(120);
    }
    this.bootstrapped = true;
  }

  private async throttle() {
    const elapsed = Date.now() - this.lastAt;
    if (elapsed < this.requestIntervalMs) {
      await sleep(this.requestIntervalMs - elapsed);
    }
  }

  async get(
    path: string,
    params?: Record<string, string | number | boolean>,
    referer?: string,
  ): Promise<Json> {
    if (await this.preferBridge()) {
      return bridgeRequest("GET", path, {
        params,
        referer,
        requestIntervalSec: this.requestIntervalMs / 1000,
      });
    }
    const qs = params
      ? `?${new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)]),
        ).toString()}`
      : "";
    return this.requestFetch("GET", `${path}${qs}`, undefined, referer);
  }

  async post(path: string, body: unknown, referer?: string): Promise<Json> {
    if (await this.preferBridge()) {
      return bridgeRequest("POST", path, {
        body,
        referer,
        requestIntervalSec: this.requestIntervalMs / 1000,
      });
    }
    return this.requestFetch("POST", path, body, referer);
  }

  private async requestFetch(
    method: "GET" | "POST",
    path: string,
    body?: unknown,
    referer?: string,
    maxRetries = 8,
  ): Promise<Json> {
    await this.bootstrap();
    const url = `${BASE_URL}${path}`;
    let lastFailure = "API 요청 실패";

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await this.throttle();
      try {
        const res = await fetch(url, {
          method,
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Origin: "https://fin.land.naver.com",
            Referer: referer || "https://fin.land.naver.com/map",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        this.lastAt = Date.now();

        let data: Json = {};
        try {
          data = (await res.json()) as Json;
        } catch {
          data = {};
        }

        if (res.status === 429 || data.detailCode === "TOO_MANY_REQUESTS") {
          lastFailure =
            "요청이 너무 많습니다 (Rate Limit). Python curl_cffi 브리지를 사용하세요 (pip install curl_cffi).";
          await sleep(Math.min(2 ** (attempt + 1) * 1000, 32000));
          continue;
        }

        if (res.status >= 400) {
          throw new ApiError(
            String(data.detailCode || data.message || `HTTP ${res.status}`),
          );
        }

        if (data.isSuccess === false) {
          throw new ApiError(
            String(data.detailCode || data.message || "API 오류"),
          );
        }

        return data;
      } catch (e) {
        if (e instanceof ApiError) throw e;
        lastFailure = e instanceof Error ? e.message : String(e);
        if (attempt < maxRetries - 1) {
          await sleep(Math.min(2 ** attempt * 1000, 16000));
          continue;
        }
        throw new Error(lastFailure);
      }
    }
    throw new Error(lastFailure);
  }
}
