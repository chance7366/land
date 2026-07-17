import type { Metadata } from "next";
import { rootFontVariableClasses, HERO_FONTS_GOOGLE_URL } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHANCE AUCTION | 내포신도시 부동산 & 경매 전문",
  description: "내포신도시 부동산 중개, 경매 추천, 부동산 소식, 법률상담 통합 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block"
        />
        <link rel="stylesheet" href={HERO_FONTS_GOOGLE_URL} />
      </head>
      <body
        className={`${rootFontVariableClasses} bg-landing-bg font-[family-name:var(--font-unifine)] text-landing-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
