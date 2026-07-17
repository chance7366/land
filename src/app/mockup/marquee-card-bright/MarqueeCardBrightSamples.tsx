"use client";

const DEMO = {
  title: "대 · 제2종일반주거지역",
  spec: "대지 660㎡",
  price: "매매가 12억",
  addr: "충청남도 홍성군 홍북읍",
  date: "2026.07.11",
};

/** 더 밝은 톤 · 단색이 아닌 안↔밖 흐림 그라데이션 */
const BODY_SAMPLES = [
  {
    id: "in-mist",
    name: "1안 · 센터 브라이트 미스트",
    note: "안에서 밖으로 흐림 — 중앙이 가장 밝고 가장자리로 옅어짐",
    mood: "추천",
    bodyClass: "mb-body-in-mist",
    darkText: false,
  },
  {
    id: "out-frost",
    name: "2안 · 가장자리 프로스트",
    note: "밖에서 안으로 흐림 — 테두리가 밝고 중심으로 은은히 들어감",
    mood: "시원",
    bodyClass: "mb-body-out-frost",
    darkText: false,
  },
  {
    id: "in-rose",
    name: "3안 · 로즈 인워드 글로우",
    note: "중앙 로즈 하이라이트 → 바깥으로 페이드 (히어로 로즈와 맞춤)",
    mood: "따뜻",
    bodyClass: "mb-body-in-rose",
    darkText: false,
  },
  {
    id: "out-champagne",
    name: "4안 · 샴페인 림 라이트",
    note: "가장 밝음 — 바깥 크림이 안으로 부드럽게 스며듦",
    mood: "밝음",
    bodyClass: "mb-body-out-champagne",
    darkText: true,
  },
  {
    id: "in-sapphire",
    name: "5안 · 사파이어 코어 글로우",
    note: "중앙 블루 발광 → 바깥으로 흐림 (추천매물 파랑과 호흡)",
    mood: "신뢰",
    bodyClass: "mb-body-in-sapphire",
    darkText: false,
  },
] as const;

function BodyPreview({
  bodyClass,
  darkText,
}: {
  bodyClass: string;
  darkText?: boolean;
}) {
  return (
    <article className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#121622] shadow-[0_8px_28px_rgba(0,0,0,0.4)]">
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#2a3344] to-[#151a24] text-[11px] text-white/40">
        이미지 영역
      </div>
      <div className={`featured-marquee-card__body p-4 ${bodyClass}`}>
        <p
          className={`line-clamp-2 text-sm font-bold ${darkText ? "text-[#1e293b]" : "text-[#60a5fa]"}`}
        >
          {DEMO.title}
        </p>
        <p
          className={`mt-1 line-clamp-1 text-[11px] font-bold ${darkText ? "text-[#64748b]" : "text-white/75"}`}
        >
          {DEMO.spec}
        </p>
        <p
          className={`mt-2 text-left text-sm font-bold ${darkText ? "text-[#be185d]" : "text-[#f472b6]"}`}
        >
          {DEMO.price}
        </p>
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <p
            className={`text-[11px] font-extrabold leading-none ${darkText ? "text-[#334155]" : "text-white"}`}
          >
            {DEMO.addr}
          </p>
          <p
            className={`shrink-0 text-[11px] font-extrabold leading-none ${darkText ? "text-[#475569]" : "text-white"}`}
          >
            {DEMO.date}
          </p>
        </div>
      </div>
    </article>
  );
}

function HoverDemoCard({
  variant,
  label,
}: {
  variant: "property" | "auction";
  label: string;
}) {
  const cls =
    variant === "property"
      ? "featured-marquee-card featured-marquee-card--property"
      : "featured-marquee-card featured-marquee-card--auction";

  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`${cls} w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#121622]`}
    >
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#2a3344] to-[#151a24] text-[11px] text-white/50">
        {label}
      </div>
      <div className="featured-marquee-card__body mb-body-in-mist p-4">
        <p className="line-clamp-2 text-sm font-bold text-[#60a5fa]">{DEMO.title}</p>
        <p className="mt-1 text-[11px] font-bold text-white/75">{DEMO.spec}</p>
        <p className="mt-2 text-sm font-bold text-[#f472b6]">{DEMO.price}</p>
      </div>
    </a>
  );
}

export function MarqueeCardBrightSamples() {
  return (
    <div className="space-y-14">
      <section className="space-y-4 rounded-2xl border border-[#4dabff]/25 bg-[#4dabff]/08 p-5">
        <h2 className="text-sm font-bold text-[#93c5fd]">호버 모션 A형 — 홈 적용됨</h2>
        <p className="text-[12px] text-[#a3a3a3]">
          스케일 + 부상 + 글로우. 추천매물=파랑, 추천경매=노랑. 아래로 미리보기 후 홈에서도
          확인해 보세요.
        </p>
        <div className="flex flex-wrap justify-center gap-6 py-4">
          <HoverDemoCard variant="property" label="추천매물 · 호버" />
          <HoverDemoCard variant="auction" label="추천경매 · 호버" />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">카드 본문 배경 샘플 5종 (미적용)</h2>
          <p className="mt-1 text-sm text-[#a3a3a3]">
            단색이 아니라 안↔밖 흐림(radial)으로 밝은 톤을 줬습니다. 번호로 골라 주세요.
          </p>
        </div>
        <div className="space-y-8">
          {BODY_SAMPLES.map((s) => (
            <article
              key={s.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/80"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3">
                <div>
                  <h3 className="text-sm font-bold text-[#4dabff]">{s.name}</h3>
                  <p className="text-[11px] text-[#a3a3a3]">{s.note}</p>
                </div>
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-bold text-[#cbd5e1]">
                  {s.mood}
                </span>
              </div>
              <div className="flex justify-center bg-[radial-gradient(ellipse_at_50%_0%,#1a1220_0%,#0a0809_70%)] px-4 py-8">
                <BodyPreview bodyClass={s.bodyClass} darkText={s.darkText} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
