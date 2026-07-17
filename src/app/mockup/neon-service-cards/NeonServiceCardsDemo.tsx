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

export function NeonServiceCardsDemo() {
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
    <>
      <style>{`
        .neon-card { will-change: transform, box-shadow, opacity; }
        .ripple {
          position: absolute;
          width: 12px;
          height: 12px;
          margin: -6px 0 0 -6px;
          border-radius: 9999px;
          pointer-events: none;
          border: 2px solid currentColor;
          animation: ripple-out 0.7s ease-out forwards;
          z-index: 5;
        }
        @keyframes ripple-out {
          from { transform: scale(1); opacity: 0.9; }
          to { transform: scale(6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ripple { display: none; }
          .neon-card { transition: border-color 0.2s, background 0.2s !important; transform: none !important; }
        }
      `}</style>

      <div className="mb-6 flex items-center justify-center gap-4">
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

      <div
        ref={areaRef}
        className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        onMouseLeave={() => setActiveKey(null)}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{ left: r.x, top: r.y, color: r.color }}
          />
        ))}

        {SERVICES.map((service) => {
          const active = activeKey === service.key;
          const dimmed = activeKey !== null && activeKey !== service.key;
          return (
            <Link
              key={service.key}
              href={service.href}
              onMouseEnter={() => setActiveKey(service.key)}
              onMouseLeave={() => setActiveKey(null)}
              onMouseMove={(e) => {
                if (Math.random() > 0.72) spawnRipple(e, service.accent);
              }}
              className="neon-card relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300"
              style={{
                borderColor: active ? service.accent : "rgba(255,255,255,0.1)",
                background: active
                  ? `rgba(${service.accentRgb}, 0.12)`
                  : "rgba(31,31,31,0.95)",
                boxShadow: active
                  ? `0 0 0 1px ${service.accent}, 0 0 28px rgba(${service.accentRgb}, 0.45), 0 12px 36px rgba(0,0,0,0.5)`
                  : "0 8px 32px rgba(0,0,0,0.45)",
                opacity: dimmed ? 0.45 : 1,
                transform: active ? "translateY(-6px)" : undefined,
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
                className="mt-2 line-clamp-2 text-xs leading-relaxed transition-colors duration-300"
                style={{
                  color: active ? `rgba(${service.accentRgb}, 0.9)` : "#a3a3a3",
                }}
              >
                {service.description}
              </p>
              {active && (
                <p
                  className="mt-2 text-[10px] font-semibold tracking-wide"
                  style={{ color: service.accent }}
                >
                  바로가기 →
                </p>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-3 rounded-2xl border border-white/10 bg-[#121212] p-5 text-xs text-[#a3a3a3] sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: s.accent, boxShadow: `0 0 10px ${s.accent}` }}
            />
            <span className="text-white">{s.title}</span>
            <span className="font-mono">{s.accent}</span>
          </div>
        ))}
      </div>
    </>
  );
}
