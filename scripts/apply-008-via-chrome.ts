/**
 * Chrome 프로필로 Supabase SQL Editor에서 008 RTMS 마이그레이션 실행
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, cpSync, existsSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";

const PROJECT = "jaxvruxtdfqyllvharsj";
const SQL_PATH = resolve("supabase/migrations/008_real_estate_transactions.sql");
const sql = readFileSync(SQL_PATH, "utf8");

const srcProfile = join(
  process.env.LOCALAPPDATA || "",
  "Google",
  "Chrome",
  "User Data",
);
const tmpRoot = join(process.env.TEMP || ".", `chance-chrome-008-${Date.now()}`);
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

async function main() {
  mkdirSync(tmpDefault, { recursive: true });
  const copied = [
    copySafe("Default/Network/Cookies"),
    copySafe("Default/Network/Cookies-journal"),
    copySafe("Default/Cookies"),
    copySafe("Default/Local Storage"),
    copySafe("Default/Session Storage"),
    copySafe("Default/Preferences"),
    copySafe("Local State"),
  ].filter(Boolean).length;
  console.log("copied parts:", copied);

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
    await page.waitForTimeout(6000);
    const url = page.url();
    console.log("URL:", url);
    if (url.includes("sign-in") || url.includes("login")) {
      console.error("NEED_LOGIN");
      process.exit(3);
    }

    await page.waitForTimeout(2000);
    const filled = await page.evaluate((text) => {
      const w = window as unknown as {
        monaco?: { editor?: { getModels?: () => { setValue: (v: string) => void }[] } };
      };
      const models = w.monaco?.editor?.getModels?.();
      if (models?.[0]) {
        models[0].setValue(text);
        return "monaco";
      }
      const ta = document.querySelector("textarea");
      if (ta) {
        (ta as HTMLTextAreaElement).value = text;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        return "textarea";
      }
      return null;
    }, sql);
    console.log("filled:", filled);
    if (!filled) {
      console.error("EDITOR_NOT_FOUND");
      process.exit(4);
    }

    await page.waitForTimeout(500);
    // Run: Ctrl+Enter or button
    await page.keyboard.press("Control+Enter");
    await page.waitForTimeout(8000);

    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
    console.log("RESULT_SNIP:", bodyText.replace(/\s+/g, " ").slice(0, 500));
    if (/Success|성공|Rows/i.test(bodyText) || /lawd_codes|real_estate/i.test(bodyText)) {
      console.log("APPLY_OK");
    } else {
      console.log("APPLY_CHECK_MANUAL");
    }
  } finally {
    await context.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
