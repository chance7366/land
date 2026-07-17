"use client";

import { useCallback, useRef, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";

const SERVICES = [
  {
    key: "properties",
    icon: "home",
    title: "부동산중개",
    description: "아파트·오피스텔·연립·다세대·단독주택·토지·상가 등 매매·전세·월세 추천해드립니다.",
    href: "/properties",
    accent: "#4dabff",
    accentRgb: "77, 171, 255",
  },
  {
    key: "auctions",
    icon: "gavel",
    title: "경매공매",
    description: "법원 경매, 온비드 공매 물건 권리분석과 추천입찰가격 제안해 드립니다.",
    href: "/auctions",
    accent: "#d4af37",
    accentRgb: "212, 175, 55",
  },
  {
    key: "news",
    icon: "newspaper",
    title: "부동산소식",
    description: "내포·충남 시장 이슈와 정책 소식을 빠르게 전달합니다.",
    href: "/news",
    accent: "#d450ff",
    accentRgb: "212, 80, 255",
  },
  {
    key: "legal",
    icon: "balance",
    title: "Q & A",
    description: "임대차·매매·경매 관련 질문에 상담으로 바로 연결합니다.",
    href: "/legal",
    accent: "#34d399",
    accentRgb: "52, 211, 153",
  },
] as const;

type Ripple = { id: number; x: number; y: number; color: string };

function MaterialIcon({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="material-symbols-outlined text-xl transition-colors duration-300"
      style={{ color }}
      aria-hidden
    >
      {name}
    </span>
  );
}

/** Fixed layout: scale/glow only — no document reflow */
function StableNeonCards() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const areaRef = useRef<HTMLDivElement>(null);

  const spawnRipple = useCallback((e: React.MouseEvent, color: string) => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const id = ++idRef.current;
    setRipples((prev) => [
      ...prev.slice(-8),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, color },
    ]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }, []);

  return (
    <div
      ref={areaRef}
      className="relative isolate grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      onMouseLeave={() => setActiveKey(null)}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            left: r.x,
            top: r.y,
            color: r.color,
            borderColor: "currentColor",
            animation: "stable-ripple 0.7s ease-out forwards",
          }}
        />
      ))}

      {SERVICES.map((service) => {
        const active = activeKey === service.key;
        const dimmed = activeKey !== null && activeKey !== service.key;
        return (
          <div key={service.key} className="relative min-h-[118px]">
            <Link
              href={service.href}
              onMouseEnter={() => setActiveKey(service.key)}
              onMouseLeave={() => setActiveKey(null)}
              onMouseMove={(e) => {
                if (Math.random() > 0.72) spawnRipple(e, service.accent);
              }}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color,opacity] duration-300 will-change-transform"
              style={{
                borderColor: active ? service.accent : "rgba(255,255,255,0.1)",
                background: active
                  ? `rgba(${service.accentRgb}, 0.12)`
                  : "rgba(31,31,31,0.95)",
                boxShadow: active
                  ? `0 0 0 1px ${service.accent}, 0 0 28px rgba(${service.accentRgb}, 0.45), 0 12px 36px rgba(0,0,0,0.5)`
                  : "0 8px 32px rgba(0,0,0,0.45)",
                opacity: dimmed ? 0.45 : 1,
                transform: active ? "scale(1.06) translateY(-4px)" : "scale(1)",
                zIndex: active ? 10 : 1,
                transformOrigin: "center center",
              }}
            >
              <div className="flex items-center gap-2.5">
                <MaterialIcon name={service.icon} color={service.accent} />
                <h3
                  className="text-base font-bold transition-colors duration-300"
                  style={{ color: active ? service.accent : "#fff" }}
                >
                  {service.title}
                </h3>
              </div>
              <p
                className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed transition-colors duration-300"
                style={{
                  color: active ? `rgba(${service.accentRgb}, 0.9)` : "#a3a3a3",
                }}
              >
                {service.description}
              </p>
              <p
                className="mt-2 text-[10px] font-semibold tracking-wide transition-opacity duration-300"
                style={{
                  color: service.accent,
                  opacity: active ? 1 : 0,
                }}
                aria-hidden={!active}
              >
                바로가기 →
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export function StableHoverDemo() {
  return (
    <>
      <style>{`
        @keyframes stable-ripple {
          from { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          to { transform: translate(-50%, -50%) scale(6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          a[style] { transform: none !important; }
        }
      `}</style>

      {/* Simulated hero frame — fixed height so page chrome doesn't jump */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[1.15]"
          style={{ backgroundImage: "url('/images/hero-naepo.jpg')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/20 via-[#0B0F19]/55 to-[#0a0a0a]" aria-hidden />

        <div className="relative z-10 flex min-h-[520px] flex-col px-5 pb-8 pt-10 md:px-10 md:pt-12">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold text-white/90" style={{ fontFamily: "Georgia, serif" }}>
              충청권 전역 부동산 · 전국 경매 권리분석
            </p>
            <h1
              className="text-3xl font-bold md:text-4xl"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                background: "linear-gradient(180deg, #fff0b3 0%, #d4af37 45%, #8b6914 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              찬스부동산 경매중개
            </h1>
          </div>

          {/* Moved slightly up vs previous mt-10/14 */}
          <div className="mt-6 md:mt-8">
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <h2
                className="text-xl font-semibold tracking-wide md:text-2xl"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  background: "linear-gradient(180deg, #fff0b3 0%, #d4af37 45%, #8b6914 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Our Services
              </h2>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>

            <StableNeonCards />
          </div>

          <p className="mt-auto pt-6 text-center text-[11px] text-white/40">
            히어로 프레임 높이 고정 · 카드는 scale만 · 바로가기는 opacity
          </p>
        </div>
      </div>
    </>
  );
}
