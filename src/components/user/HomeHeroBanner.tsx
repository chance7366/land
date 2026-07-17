import Image from "next/image";

export const HERO_BANNER_COPY = {
  hook: "이집 저집 내집, 이땅 저땅 내땅",
  main: "찬스부동산 경매중개",
  region:
    "충남 홍성 전지역, 서산, 당진, 예산, 천안, 아산, 세종, 대전 부동산 매물, 경매 물건 소개합니다.",
} as const;

export const HERO_BANNER_SIZE = {
  hook: "font-headline-md text-[18px] leading-snug tracking-tight",
  main: "font-headline-lg text-[50px] leading-tight tracking-tight",
  region: "mx-auto max-w-xl text-pretty font-body-md text-[18px] leading-relaxed",
} as const;

export type HeroColorSchemeId = "tricolor" | "vivid" | "soft";

export type HeroColorScheme = {
  id: HeroColorSchemeId;
  label: string;
  description: string;
  hookColor: string;
  mainColor: string;
  regionColor: string;
  hookHex: string;
  mainHex: string;
  regionHex: string;
};

export const HERO_COLOR_SCHEMES: Record<HeroColorSchemeId, HeroColorScheme> = {
  tricolor: {
    id: "tricolor",
    label: "푸른·녹·금 (추천)",
    description: "슬로건 블루 · 메인 그린 · 지역 골드",
    hookColor: "text-primary-container",
    mainColor: "text-secondary",
    regionColor: "text-on-tertiary-fixed-variant",
    hookHex: "#1a2b4b",
    mainHex: "#3b6934",
    regionHex: "#5d4201",
  },
  vivid: {
    id: "vivid",
    label: "선명 블루·그린·앰버",
    description: "surface-tint · secondary-container 톤 · tertiary-container",
    hookColor: "text-surface-tint",
    mainColor: "text-on-secondary-container",
    regionColor: "text-on-tertiary-container",
    hookHex: "#4e5e81",
    mainHex: "#3f6d38",
    regionHex: "#b18d48",
  },
  soft: {
    id: "soft",
    label: "소프트 블루·민트·샌드",
    description: "inverse-primary · secondary · tertiary-fixed-dim",
    hookColor: "text-primary-fixed-dim",
    mainColor: "text-on-secondary-fixed-variant",
    regionColor: "text-tertiary-fixed-dim",
    hookHex: "#b6c6ef",
    mainHex: "#23501e",
    regionHex: "#e9c176",
  },
};

export const DEFAULT_HERO_COLOR_SCHEME: HeroColorSchemeId = "tricolor";

export function HeroBannerContent({
  schemeId = DEFAULT_HERO_COLOR_SCHEME,
}: {
  schemeId?: HeroColorSchemeId;
}) {
  const scheme = HERO_COLOR_SCHEMES[schemeId];

  return (
    <div className="mx-auto max-w-[min(100%,40rem)] px-container-padding-mobile text-center md:px-8">
      <p className={`${HERO_BANNER_SIZE.hook} ${scheme.hookColor}`}>{HERO_BANNER_COPY.hook}</p>
      <h1 className={`mt-1 md:mt-2 ${HERO_BANNER_SIZE.main} ${scheme.mainColor}`}>
        {HERO_BANNER_COPY.main}
      </h1>
      <p className={`mt-2 md:mt-3 ${HERO_BANNER_SIZE.region} ${scheme.regionColor}`}>
        {HERO_BANNER_COPY.region}
      </p>
    </div>
  );
}

type HeroBannerVisualProps = {
  className?: string;
  priority?: boolean;
  schemeId?: HeroColorSchemeId;
};

export function HeroBannerVisual({
  className = "",
  priority = false,
  schemeId = DEFAULT_HERO_COLOR_SCHEME,
}: HeroBannerVisualProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/images/hero-naepo.jpg"
        alt="내포신도시 전경"
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center brightness-105 saturate-[0.92]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/88 via-white/55 to-primary/18"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-white/10"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <HeroBannerContent schemeId={schemeId} />
      </div>
    </div>
  );
}

export function HomeHeroBanner() {
  return (
    <section
      className="relative h-[300px] w-full border-b border-outline-variant/20 md:h-[400px]"
      aria-label="찬스부동산 경매중개 소개"
    >
      <HeroBannerVisual className="h-full w-full" priority schemeId={DEFAULT_HERO_COLOR_SCHEME} />
    </section>
  );
}
