/**
 * Chrome 프로필 복사본으로 Supabase SQL Editor에서 006 실행 후 검증.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, cpSync, existsSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

const PROJECT = "jaxvruxtdfqyllvharsj";
const SQL_PATH = resolve("supabase/migrations/006_auction_case_detail.sql");
const sql =
  readFileSync(SQL_PATH, "utf8") +
  "\n\nnotify pgrst, 'reload schema';\n";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

const srcProfile = join(
  process.env.LOCALAPPDATA || "",
  "Google",
  "Chrome",
  "User Data",
);
const tmpRoot = join(process.env.TEMP || ".", `chance-chrome-006-${Date.now()}`);
const tmpDefault = join(tmpRoot, "Default");

function copySafe(rel: string) {
  const from = join(srcProfile, rel);
  const to = join(tmpRoot, rel);
  if (!existsSync(from)) return false;
  mkdirSync(resolve(to, ".."), { recursive: true });
  try {
    cpSync(from, to, { recursive: true, force: true });
    return true;
  } catch {
    try {
      execSync(`xcopy "${from}" "${to}" /E /I /H /Y /Q`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
}

async function verifyColumns(): Promise<string[]> {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return [];
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // force schema: try selecting new columns
  const { data, error } = await sb
    .from("auctions")
    .select("id, rights_analysis, case_detail_json, bid_deposit")
    .limit(1);
  if (error) {
    console.log("verify error:", error.message);
    return [];
  }
  const row = (data?.[0] || {}) as Record<string, unknown>;
  return Object.keys(row);
}

async function main() {
  mkdirSync(tmpDefault, { recursive: true });
  [
    "Default/Network/Cookies",
    "Default/Network/Cookies-journal",
    "Default/Cookies",
    "Default/Local Storage",
    "Default/Session Storage",
    "Default/Preferences",
    "Local State",
  ].forEach(copySafe);

  const context = await chromium.launchPersistentContext(tmpRoot, {
    channel: "chrome",
    headless: false,
    args: ["--disable-extensions", "--no-first-run"],
  });

  try {
    const page = context.pages()[0] || (await context.newPage());
    await page.goto(
      `https://supabase.com/dashboard/project/${PROJECT}/sql/new`,
      { waitUntil: "domcontentloaded", timeout: 90_000 },
    );
    await page.waitForTimeout(7000);
    if (/sign-in|login/i.test(page.url())) {
      console.error("NEED_LOGIN");
      process.exit(3);
    }

    // wait monaco
    for (let i = 0; i < 20; i++) {
      const ok = await page.evaluate(() => {
        const w = window as unknown as {
          monaco?: { editor?: { getModels?: () => unknown[] } };
        };
        return (w.monaco?.editor?.getModels?.() || []).length > 0;
      });
      if (ok) break;
      await page.waitForTimeout(500);
    }

    await page.evaluate((text) => {
      const w = window as unknown as {
        monaco?: {
          editor?: {
            getModels?: () => { setValue: (v: string) => void }[];
          };
        };
      };
      const models = w.monaco?.editor?.getModels?.() || [];
      if (models[0]) models[0].setValue(text);
    }, sql);

    // Prefer explicit Run
    const runBtn = page.getByRole("button", { name: /^Run$/i }).first();
    if (await runBtn.count()) {
      await runBtn.click();
    } else {
      await page.keyboard.press("Control+Enter");
    }

    // wait success / error UI
    await page.waitForTimeout(4000);
    const bodyText = await page.locator("body").innerText();
    const snip = bodyText.includes("Success")
      ? "SUCCESS_TEXT"
      : bodyText.includes("Error")
        ? "ERROR_TEXT"
        : "UNKNOWN";
    console.log("ui:", snip);

    // keep open a bit
    await page.waitForTimeout(2000);
  } finally {
    await context.close().catch(() => {});
  }

  await new Promise((r) => setTimeout(r, 2500));
  const keys = await verifyColumns();
  console.log("verify keys:", keys.join(", ") || "(none)");
  if (!keys.includes("case_detail_json")) {
    console.error("FAIL: case_detail_json still missing after SQL run");
    process.exit(2);
  }
  console.log("OK: Supabase auctions columns applied");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
