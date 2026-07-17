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
    accentBright: "#8ecfff",
    accentRgb: "77, 171, 255",
  },
  {
    key: "auctions",
    icon: "gavel",
    title: "경매공매",
    description: "법원 경매, 온비드 공매 물건 권리분석과 추천입찰가격 제안해 드립니다.",
    href: "/auctions",
    accent: "#d4af37",
    accentBright: "#e8c86a",
    accentRgb: "212, 175, 55",
  },
  {
    key: "news",
    icon: "newspaper",
    title: "부동산소식",
    description: "내포·충남 시장 이슈와 정책 소식을 빠르게 전달합니다.",
    href: "/news",
    accent: "#d450ff",
    accentBright: "#e090ff",
    accentRgb: "212, 80, 255",
  },
  {
    key: "legal",
    icon: "balance",
    title: "Q & A",
    description: "임대차·매매·경매 관련 질문에 상담으로 바로 연결합니다.",
    href: "/legal",
    accent: "#34d399",
    accentBright: "#6ee7b7",
    accentRgb: "52, 211, 153",
  },
] as const;

type Ripple = { id: number; x: number; y: number; color: string };

/**
 * Sample: faint accent-tint card bg + bright accent title (focus: blue 부동산중개).
 */
export function HeroServiceCardsBlueTintSample({
  blueOnly = false,
}: {
  /** If true, only 부동산중개 uses blue tint; others keep neutral glass */
  blueOnly?: boolean;
}) {
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
          className="hero-service-ripple"
          style={{ left: r.x, top: r.y, color: r.color }}
        />
      ))}

      {SERVICES.map((service) => {
        const active = activeKey === service.key;
        const dimmed = activeKey !== null && activeKey !== service.key;
        const useTint = !blueOnly || service.key === "properties";
        const idleBg = useTint
          ? `linear-gradient(165deg, rgba(${service.accentRgb}, 0.14) 0%, rgba(${service.accentRgb}, 0.06) 55%, rgba(15, 18, 28, 0.55) 100%)`
          : "var(--landing-service-bg)";
        const activeBg = useTint
          ? `linear-gradient(165deg, rgba(${service.accentRgb}, 0.22) 0%, rgba(${service.accentRgb}, 0.1) 50%, rgba(15, 18, 28, 0.65) 100%)`
          : "var(--landing-service-bg-active)";

        return (
          <div key={service.key} className="relative min-h-[132px]">
            <Link
              href={service.href}
              onMouseEnter={() => setActiveKey(service.key)}
              onMouseLeave={() => setActiveKey(null)}
              onMouseMove={(e) => {
                if (Math.random() > 0.72) spawnRipple(e, service.accent);
              }}
              className="hero-service-card absolute inset-0 flex flex-col rounded-2xl border p-4 backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color,opacity] duration-300"
              style={{
                borderColor: active
                  ? service.accent
                  : useTint
                    ? `rgba(${service.accentRgb}, 0.35)`
                    : "var(--landing-service-border)",
                background: active ? activeBg : idleBg,
                boxShadow: active
                  ? `0 0 0 1px ${service.accent}, 0 0 28px rgba(${service.accentRgb}, 0.45), 0 12px 36px rgba(0,0,0,0.25)`
                  : useTint
                    ? `0 8px 28px rgba(${service.accentRgb}, 0.12)`
                    : "var(--landing-service-shadow)",
                opacity: dimmed ? 0.45 : 1,
                transform: active ? "scale(1.05) translateY(-4px)" : "scale(1)",
                zIndex: active ? 10 : 1,
                transformOrigin: "center center",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined shrink-0 text-xl"
                  style={{ color: useTint ? "#ffffff" : service.accentBright }}
                  aria-hidden
                >
                  {service.icon}
                </span>
                <h3
                  className={`text-base ${useTint ? "font-extrabold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]" : "font-bold"}`}
                  style={useTint ? undefined : { color: "var(--color-landing-text)" }}
                >
                  {service.title}
                </h3>
              </div>
              <p
                className={`mt-2 line-clamp-2 flex-1 text-xs leading-relaxed ${
                  useTint ? "font-semibold text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]" : ""
                }`}
                style={
                  useTint
                    ? undefined
                    : { color: "var(--color-landing-muted)" }
                }
              >
                {service.description}
              </p>
              <p
                className="mt-1.5 text-[10px] font-bold tracking-wide text-white transition-opacity duration-300"
                style={{
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
