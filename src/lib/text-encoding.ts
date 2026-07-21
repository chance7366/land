/**
 * UTF-8 바이트를 Latin-1/ISO-8859-1 문자로 잘못 해석해 저장된 문자열을 복구합니다.
 * 예: "감정요약" → "ê°ì ìì½" 형태, "타경" → "íê²½"
 */
export function looksLikeUtf8Mojibake(input: string | null | undefined): boolean {
  if (!input) return false;
  if (/[가-힣]/.test(input)) return false;
  const latin = (input.match(/[\u00C0-\u00FF]/g) || []).length;
  // 사건번호 "2026íê²½15044"처럼 짧은 필드도 잡도록 낮춤
  if (latin < 2) return false;
  try {
    const fixed = Buffer.from(input, "latin1").toString("utf8");
    if (fixed.includes("\uFFFD")) return false;
    if (!/[가-힣]/.test(fixed)) return false;
    // 복구 후 길이가 과도하게 줄지 않는지(노이즈 방지)
    if (fixed.length < Math.max(1, Math.floor(input.length * 0.3))) return false;
    return true;
  } catch {
    return false;
  }
}

export function repairUtf8Mojibake(input: string): string {
  if (!input || !looksLikeUtf8Mojibake(input)) return input;
  try {
    const fixed = Buffer.from(input, "latin1").toString("utf8");
    if (fixed.includes("\uFFFD")) return input;
    if (/[가-힣]/.test(fixed) && !/[가-힣]/.test(input)) return fixed;
    return input;
  } catch {
    return input;
  }
}

export function repairUtf8MojibakeNullable(
  input: string | null | undefined,
): string | null | undefined {
  if (input == null) return input;
  return repairUtf8Mojibake(input);
}
