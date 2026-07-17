/** 부동산소식 페이지네이션 — 숫자 버튼 최대 10개(블록 단위) */
export const NEWS_FEED_PAGE_WINDOW = 10;

export function newsFeedPageWindow(
  page: number,
  totalPages: number,
  windowSize = NEWS_FEED_PAGE_WINDOW,
): { start: number; end: number; pages: number[] } {
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  const start = Math.floor((current - 1) / windowSize) * windowSize + 1;
  const end = Math.min(total, start + windowSize - 1);
  const pages: number[] = [];
  for (let n = start; n <= end; n += 1) pages.push(n);
  return { start, end, pages };
}
