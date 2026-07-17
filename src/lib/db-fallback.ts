/** Vercel 등에서 SQLite/DB가 없을 때 SSR이 죽지 않도록 폴백합니다. */
export async function withDbFallback<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[db-fallback:${label}]`, error);
    return fallback;
  }
}
