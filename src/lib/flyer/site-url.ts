/** 전단지 QR·공개 링크용 사이트 베이스 */
export function getPublicBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function flyerQrSrc(publicPath: string): string {
  const url = `${getPublicBaseUrl()}${publicPath.startsWith("/") ? publicPath : `/${publicPath}`}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=96x96&margin=0&data=${encodeURIComponent(url)}`;
}
