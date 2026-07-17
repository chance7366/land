import {
  HERO_BANNER_COPY,
  HERO_BANNER_SIZE,
  HERO_COLOR_SCHEMES,
  DEFAULT_HERO_COLOR_SCHEME,
  HeroBannerVisual,
  type HeroColorScheme,
  type HeroColorSchemeId,
} from "@/components/user/HomeHeroBanner";

const SCHEME_ORDER: HeroColorSchemeId[] = ["tricolor", "vivid", "soft"];

function schemeTypoSpec(scheme: HeroColorScheme) {
  return [
    {
      role: "슬로건 (Hook)",
      copy: HERO_BANNER_COPY.hook,
      size: "18px",
      family: "푸른색 계열",
      token: scheme.hookColor,
      hex: scheme.hookHex,
      className: `${HERO_BANNER_SIZE.hook} ${scheme.hookColor}`,
    },
    {
      role: "메인 (H1)",
      copy: HERO_BANNER_COPY.main,
      size: "50px",
      family: "녹색 계열",
      token: scheme.mainColor,
      hex: scheme.mainHex,
      className: `${HERO_BANNER_SIZE.main} ${scheme.mainColor}`,
    },
    {
      role: "지역 소개",
      copy: HERO_BANNER_COPY.region,
      size: "18px",
      family: "노랑·금색 계열",
      token: scheme.regionColor,
      hex: scheme.regionHex,
      className: `${HERO_BANNER_SIZE.region} ${scheme.regionColor}`,
    },
  ] as const;
}

function DeviceFrame({
  label,
  widthClass,
  children,
}: {
  label: string;
  widthClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-surface-container-high px-2 py-1 font-caption font-bold text-on-surface-variant">
          {label}
        </span>
      </div>
      <div
        className={`overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface shadow-md ${widthClass}`}
      >
        {children}
      </div>
    </div>
  );
}

export function HeroBannerColorSchemeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SCHEME_ORDER.map((id) => {
        const scheme = HERO_COLOR_SCHEMES[id];
        const isActive = id === DEFAULT_HERO_COLOR_SCHEME;

        return (
          <div
            key={id}
            className={`rounded-2xl border p-4 ${
              isActive
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-outline-variant/30 bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="font-card-title text-primary">{scheme.label}</p>
              {isActive && (
                <span className="rounded-full bg-primary px-2 py-0.5 font-caption font-bold text-on-primary">
                  홈 적용
                </span>
              )}
            </div>
            <p className="mb-4 font-caption text-on-surface-variant">{scheme.description}</p>
            <div className="space-y-2">
              {[
                { label: "푸른", hex: scheme.hookHex, token: scheme.hookColor },
                { label: "녹", hex: scheme.mainHex, token: scheme.mainColor },
                { label: "금", hex: scheme.regionHex, token: scheme.regionColor },
              ].map((swatch) => (
                <div key={swatch.label} className="flex items-center gap-2">
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-outline-variant/30"
                    style={{ backgroundColor: swatch.hex }}
                    aria-hidden="true"
                  />
                  <span className="font-caption text-on-surface-variant">
                    {swatch.label} · {swatch.token} · {swatch.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroBannerTypoSpec({ schemeId = DEFAULT_HERO_COLOR_SCHEME }: { schemeId?: HeroColorSchemeId }) {
  const rows = schemeTypoSpec(HERO_COLOR_SCHEMES[schemeId]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-white">
      <table className="w-full min-w-[800px] text-left font-caption">
        <thead>
          <tr className="border-b border-outline-variant/30 bg-surface-container-low">
            <th className="px-4 py-3 font-bold text-primary">역할</th>
            <th className="px-4 py-3 font-bold text-primary">색상 계열</th>
            <th className="px-4 py-3 font-bold text-primary">크기</th>
            <th className="px-4 py-3 font-bold text-primary">토큰</th>
            <th className="px-4 py-3 font-bold text-primary">Hex</th>
            <th className="px-4 py-3 font-bold text-primary">미리보기</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.role} className="border-b border-outline-variant/20 last:border-0">
              <td className="px-4 py-3 font-medium text-on-surface">{row.role}</td>
              <td className="px-4 py-3 text-on-surface-variant">{row.family}</td>
              <td className="px-4 py-3 text-on-surface-variant">{row.size}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-on-surface-variant">{row.token}</td>
              <td className="px-4 py-3 font-mono text-on-surface-variant">{row.hex}</td>
              <td className="px-4 py-3">
                <span className={row.className}>
                  {row.role === "지역 소개" ? "지역 소개 샘플" : row.copy}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HeroBannerSchemeComparison() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {SCHEME_ORDER.map((schemeId) => {
        const scheme = HERO_COLOR_SCHEMES[schemeId];
        return (
          <DeviceFrame
            key={schemeId}
            label={`${scheme.label} · 375px`}
            widthClass="w-full"
          >
            <HeroBannerVisual className="h-[300px] w-full" schemeId={schemeId} />
          </DeviceFrame>
        );
      })}
    </div>
  );
}

export function HeroBannerPreviewFrames() {
  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <DeviceFrame label="Mobile · 375px (홈 적용)" widthClass="w-full max-w-[375px]">
        <HeroBannerVisual
          className="h-[300px] w-[375px] max-w-full"
          schemeId={DEFAULT_HERO_COLOR_SCHEME}
        />
      </DeviceFrame>

      <div className="min-w-0">
        <DeviceFrame label="Desktop · 1280px (홈 적용)" widthClass="w-full">
          <div className="overflow-x-auto">
            <HeroBannerVisual
              className="h-[400px] w-[1280px] min-w-[1280px]"
              schemeId={DEFAULT_HERO_COLOR_SCHEME}
            />
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}
