import type { Browser } from "playwright-core";
import path from "path";

/** Vercel x64 — chromium-min이 런타임에 /tmp로 내려받는 pack */
const DEFAULT_CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar";

function isServerlessRuntime(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV,
  );
}

function chromiumPackUrl(): string {
  return (
    process.env.CHROMIUM_PACK_URL?.trim() ||
    process.env.CHROMIUM_REMOTE_EXEC_PATH?.trim() ||
    DEFAULT_CHROMIUM_PACK_URL
  );
}

/**
 * 로컬: Playwright 설치 Chromium
 * Vercel/Lambda: @sparticuz/chromium-min + 원격 pack (바이너리가 배포 번들에 포함되지 않음)
 */
export async function launchAppBrowser(
  extraArgs: string[] = [],
): Promise<Browser> {
  if (isServerlessRuntime()) {
    const [{ chromium: playwright }, chromiumMod] = await Promise.all([
      import("playwright-core"),
      import("@sparticuz/chromium-min"),
    ]);
    const chromium = chromiumMod.default;
    try {
      chromium.setGraphicsMode = false;
    } catch {
      // ignore
    }
    const executablePath = await chromium.executablePath(chromiumPackUrl());
    const execDir = path.dirname(executablePath);
    process.env.LD_LIBRARY_PATH = [execDir, process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(":");

    return playwright.launch({
      args: [...chromium.args, "--disable-dev-shm-usage", ...extraArgs],
      executablePath,
      headless: true,
    });
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox", ...extraArgs],
  });
  // playwright / playwright-core 중첩 버전 타입 차이 흡수
  return browser as unknown as Browser;
}
