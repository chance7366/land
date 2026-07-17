/** 줄바꿈 확정 문구 (슬로건 A) */
export const HERO_TAGLINE_LINES = [
  { text: "부동산의 모든 것,", color: "text-white" },
  { text: "매매·임대부터", color: "text-[#fef08a]" },
  { text: "법원 경매 권리분석까지", color: "text-[#facc15]" },
  { text: "한번에!", color: "text-[#ca8a04]" },
] as const;

export const HERO_TAGLINE = HERO_TAGLINE_LINES.map((l) => l.text).join(" ");

/** 히어로 좌측 교차 슬로건 (행 텍스트만) */
export const HERO_SLOGAN_A = [
  "부동산의 모든 것,",
  "매매·임대부터",
  "법원 경매 권리분석까지",
  "한번에!",
] as const;

export const HERO_SLOGAN_B = [
  "안전한 중개",
  "정확한 권리분석",
  "성공적인 경매투자",
  "찬스부동산이 함께 합니다.",
] as const;

export const HERO_SLOGAN_SETS = [HERO_SLOGAN_A, HERO_SLOGAN_B] as const;

type Side = "left" | "right";

type Variant = {
  id: string;
  name: string;
  note: string;
  side: Side;
  fontClass: string;
};

const VARIANTS: Variant[] = [
  {
    id: "A",
    name: "붓글씨 · 좌측",
    note: "Nanum Brush Script",
    side: "left",
    fontClass: "font-hero-brush",
  },
  {
    id: "B",
    name: "손글씨 · 우측",
    note: "Gamja Flower",
    side: "right",
    fontClass: "font-hero-gamja",
  },
  {
    id: "C",
    name: "독도체 · 좌측 (적용안)",
    note: "East Sea Dokdo · 행별 화이트→진한 노랑",
    side: "left",
    fontClass: "font-hero-dokdo",
  },
];

function CalligraphyBlock({
  fontClass,
  align = "left",
  className = "",
}: {
  fontClass: string;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <p
      className={`${fontClass} text-[0.95rem] leading-[1.2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-[1.15rem] md:text-[1.85rem] md:leading-[1.25] lg:text-[2.2rem] ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {HERO_TAGLINE_LINES.map((line) => (
        <span key={line.text} className={`block whitespace-nowrap ${line.color}`}>
          {line.text}
        </span>
      ))}
    </p>
  );
}

/**
 * Home hero calligraphy — C안 기준.
 * 모바일: 작은 글씨로 전체 문구 표시 · 데스크톱: 큰 글씨.
 */
export function HeroCalligraphyOptions({
  activeId = "C",
}: {
  activeId?: string;
}) {
  const active = VARIANTS.find((v) => v.id === activeId) ?? VARIANTS.find((v) => v.id === "C")!;
  const sideClass =
    active.side === "left"
      ? "left-2 top-3 sm:left-3 sm:top-4 md:left-4 md:top-20 lg:left-8 lg:top-24 xl:left-12"
      : "right-2 top-3 sm:right-3 sm:top-4 md:right-4 md:top-20 lg:right-8 lg:top-24 xl:right-12";

  return (
    <div
      className={`pointer-events-none absolute z-[5] max-w-[min(100%,11.5rem)] sm:max-w-[13rem] md:max-w-[16rem] lg:max-w-[19rem] ${sideClass}`}
      aria-hidden="true"
    >
      <CalligraphyBlock
        fontClass={active.fontClass}
        align={active.side === "right" ? "right" : "left"}
      />
    </div>
  );
}

export function HeroCalligraphyVariantList({
  ids,
}: {
  ids?: string[];
} = {}) {
  const list = ids ? VARIANTS.filter((v) => ids.includes(v.id)) : VARIANTS;

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {list.map((v) => (
        <li key={v.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold text-[#d4af37]">
            {v.id}. {v.name}
          </p>
          <p className="mt-1 text-[11px] text-[#737373]">{v.note}</p>
          <div className="mt-3">
            <CalligraphyBlock fontClass={v.fontClass} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export { VARIANTS as HERO_CALLIGRAPHY_VARIANTS };
