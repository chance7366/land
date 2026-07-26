import type { Browser } from "playwright-core";
import path from "path";

function isServerlessRuntime(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV,
  );
}

/**
 * 로컬: Playwright 설치 Chromium
 * Vercel/Lambda: @sparticuz/chromium + playwright-core
 */
export async function launchAppBrowser(
  extraArgs: string[] = [],
): Promise<Browser> {
  if (isServerlessRuntime()) {
    const [{ chromium: playwright }, chromiumMod] = await Promise.all([
      import("playwright-core"),
      import("@sparticuz/chromium"),
    ]);
    const chromium = chromiumMod.default;
    try {
      (chromium as unknown as { setGraphicsMode?: (v: boolean) => void }).setGraphicsMode?.(
        false,
      );
    } catch {
      // ignore
    }
    const executablePath = await chromium.executablePath();
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
