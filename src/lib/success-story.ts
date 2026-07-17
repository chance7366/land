export const SUCCESS_STORY_CATEGORIES = ["전체", "부동산중개", "경매공매"] as const;

export type SuccessStoryCategoryFilter = (typeof SUCCESS_STORY_CATEGORIES)[number];
export type SuccessStoryCategory = Exclude<SuccessStoryCategoryFilter, "전체">;

export const SUCCESS_STORY_WRITE_CATEGORIES: SuccessStoryCategory[] = [
  "부동산중개",
  "경매공매",
];

export function isSuccessStoryCategory(value: string): value is SuccessStoryCategory {
  return SUCCESS_STORY_WRITE_CATEGORIES.includes(value as SuccessStoryCategory);
}

export function maskStoryAuthor(name: string): string {
  const t = name.trim();
  if (!t) return "**";
  return `${t[0]}**`;
}

export function formatStoryDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
