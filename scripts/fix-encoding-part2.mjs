import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, "utf8");
  console.log("wrote", rel);
}

function patch(rel, replacements) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    console.log("patched", rel);
  } else {
    console.log("skip patch (already ok)", rel);
  }
}

write(
  "src/components/property/PropertyFilters.tsx",
  `"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname, useSearchParams } from "next/navigation";
import { navigateTo } from "@/lib/navigate";
import type { PropertyCategory } from "@prisma/client";
import { PROPERTY_CATEGORIES, PROPERTY_DEAL_TYPES, PROPERTY_REGIONS } from "@/lib/property-fields";
import {
  buildFilterSummary,
  FILTER_ALL_ACTIVE,
  FILTER_ALL_INACTIVE,
  getCategoryUi,
  getDealUi,
} from "@/lib/property-ui";

type PropertyFiltersProps = {
  counts?: Partial<Record<PropertyCategory, number>>;
  totalCount?: number;
  resultCount?: number;
};

export function PropertyFilters({ counts = {}, totalCount = 0, resultCount }: PropertyFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeDeal = searchParams.get("deal");
  const activeRegion = searchParams.get("region");
  const activeSort = searchParams.get("sort") ?? "latest";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    navigateTo(\`\${pathname}?\${params.toString()}\`);
  }

  const summary =
    resultCount != null
      ? buildFilterSummary({
          category: activeCategory,
          deal: activeDeal,
          region: activeRegion,
          count: resultCount,
        })
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-landing-border border-t-4 border-t-blue-500 bg-landing-surface p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-landing-text">매물 필터</p>
        {summary && (
          <span className="rounded-full bg-cta-from/15 px-3 py-1 font-caption font-bold text-blue-400">
            {summary}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-landing-muted">물건 유형</p>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            <CategoryChip
              active={!activeCategory}
              label={\`전체 \${totalCount}\`}
              icon="grid_view"
              activeClass={FILTER_ALL_ACTIVE}
              inactiveClass={FILTER_ALL_INACTIVE}
              onClick={() => updateParam("category", null)}
            />
            {PROPERTY_CATEGORIES.map((item) => {
              const ui = getCategoryUi(item.value);
              return (
                <CategoryChip
                  key={item.value}
                  active={activeCategory === item.value}
                  label={\`\${item.label} \${counts[item.value] ?? 0}\`}
                  icon={ui.icon}
                  activeClass={ui.filterActive}
                  inactiveClass={ui.filterInactive}
                  onClick={() => updateParam("category", item.value)}
                />
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-landing-muted">거래</p>
          <div className="flex flex-wrap gap-2">
            <DealChip
              active={!activeDeal}
              label="전체"
              activeClass={FILTER_ALL_ACTIVE}
              inactiveClass={FILTER_ALL_INACTIVE}
              onClick={() => updateParam("deal", null)}
            />
            {PROPERTY_DEAL_TYPES.map((item) => {
              const ui = getDealUi(item.value);
              return (
                <DealChip
                  key={item.value}
                  active={activeDeal === item.value}
                  label={item.label}
                  activeClass={ui.chipActive}
                  inactiveClass={ui.chipInactive}
                  onClick={() => updateParam("deal", item.value)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="w-full text-xs font-semibold text-landing-muted sm:mr-1 sm:w-auto">지역</p>
          <FilterChip
            active={!activeRegion}
            label="전체"
            activeClass={FILTER_ALL_ACTIVE}
            inactiveClass={FILTER_ALL_INACTIVE}
            onClick={() => updateParam("region", null)}
          />
          {PROPERTY_REGIONS.filter((r) => r !== "기타").map((region) => (
            <FilterChip
              key={region}
              active={activeRegion === region}
              label={region}
              activeClass="bg-cta-from/20 text-blue-300 border border-cta-from/30 filter-chip-active"
              inactiveClass="bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20"
              onClick={() => updateParam("region", region)}
            />
          ))}
          <select
            value={activeSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="ml-auto rounded-full border border-landing-border bg-landing-elevated px-4 py-1.5 text-sm font-medium text-landing-text focus:border-blue-400 focus:outline-none"
          >
            <option value="latest">최신순</option>
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  icon,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={\`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all \${
        active ? activeClass : inactiveClass
      }\`}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </button>
  );
}

function DealChip({
  label,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <FilterChip
      label={label}
      active={active}
      activeClass={activeClass}
      inactiveClass={inactiveClass}
      onClick={onClick}
    />
  );
}

function FilterChip({
  label,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={\`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all \${
        active ? activeClass : inactiveClass
      }\`}
    >
      {label}
    </button>
  );
}

export function PropertyFiltersLinkBar() {
  return (
    <div className="flex gap-2 text-xs">
      {PROPERTY_CATEGORIES.slice(0, 4).map((item) => (
        <Link
          key={item.value}
          href={\`/properties?category=\${item.value}\`}
          className="rounded-full px-2 py-0.5 font-medium text-blue-400 hover:bg-cta-from/10"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
`
);

write(
  "src/components/landing/FeaturedPicks.tsx",
  `import type { Auction, Property } from "@prisma/client";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingCta } from "@/components/landing/LandingCta";
import { formatPrice, formatPropertyPrice } from "@/lib/format";

type FeaturedPicksProps = {
  properties: Property[];
  auctions: Auction[];
};

export function FeaturedPicks({ properties, auctions }: FeaturedPicksProps) {
  return (
    <section className="border-t border-landing-border px-container-padding-mobile py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-blue-400">FEATURED</p>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-headline)] text-[28px] font-extrabold leading-tight text-landing-text md:text-[32px]">
              추천 매물 · 경매
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-landing-muted md:text-base">
              엄선된 일부만 홈에 노출합니다. 전체 목록은 각 서비스 페이지에서 확인하세요.
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-landing-text">
            일반중개
          </h3>
          <LandingCta href="/properties" variant="ghost" className="!px-4 !py-2 text-xs">
            더보기
          </LandingCta>
        </div>
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={\`/properties/\${property.id}\`}
              className="rounded-2xl border border-landing-border bg-landing-surface p-5 transition-colors hover:border-white/20 hover:bg-landing-elevated"
            >
              <p className="line-clamp-2 font-[family-name:var(--font-headline)] text-base font-semibold text-landing-text">
                {property.title}
              </p>
              <p className="mt-2 text-sm font-bold text-blue-400">{formatPropertyPrice(property)}</p>
              <p className="mt-2 text-xs text-landing-muted">{property.region}</p>
            </Link>
          ))}
          {properties.length === 0 && (
            <p className="text-sm text-landing-muted">등록된 매물이 없습니다.</p>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-landing-text">
            경매물건
          </h3>
          <LandingCta href="/auctions" variant="ghost" className="!px-4 !py-2 text-xs">
            더보기
          </LandingCta>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => (
            <Link
              key={auction.id}
              href={\`/auctions/\${auction.id}\`}
              className="rounded-2xl border border-landing-border bg-landing-surface p-5 transition-colors hover:border-white/20 hover:bg-landing-elevated"
            >
              <p className="line-clamp-2 font-[family-name:var(--font-headline)] text-base font-semibold text-landing-text">
                {auction.title}
              </p>
              <p className="mt-2 text-sm font-bold text-violet-400">
                감정가 {formatPrice(auction.appraisalPrice)}
              </p>
              <p className="mt-2 text-xs text-landing-muted">
                D-{auction.dDay} · {auction.caseNumber}
              </p>
            </Link>
          ))}
          {auctions.length === 0 && (
            <p className="text-sm text-landing-muted">등록된 경매가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
`
);

write(
  "src/components/admin/AdminSidebar.tsx",
  `"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "대시보드", icon: "dashboard" },
  { href: "/admin/properties", label: "매물 관리", icon: "search" },
  { href: "/admin/auctions", label: "경매 관리", icon: "function" },
  { href: "/admin/news", label: "부동산 소식", icon: "newspaper" },
  { href: "/admin/reviews", label: "고객 후기", icon: "reviews" },
  { href: "/admin/consultations", label: "상담 예약", icon: "event" },
];

type AdminSidebarProps = {
  authEnabled: boolean;
};

export function AdminSidebar({ authEnabled }: AdminSidebarProps) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-72 flex-col rounded-r-xl bg-surface-container-lowest py-6 shadow-lg">
      <div className="mb-10 px-8">
        <Link href="/" className="mb-3 inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          ← 홈으로
        </Link>
        <h1 className="font-headline-md font-bold tracking-tight text-primary">CHANCE ADMIN</h1>
        <p className="font-label-md text-on-surface-variant opacity-70">Management Console</p>
        {!authEnabled && (
          <span className="mt-2 inline-block rounded bg-on-tertiary-container/20 px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
            DEV · 인증 비활성
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`mx-4 flex items-center gap-4 rounded-full px-6 py-3 transition-all \${
                active
                  ? "scale-95 bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }\`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-outline-variant px-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <p className="font-label-md font-bold">관리자 님</p>
            <p className="text-[10px] text-on-surface-variant">
              {authEnabled ? "시스템 최고권한" : "개발 모드"}
            </p>
          </div>
        </div>
        {authEnabled ? (
          <button
            type="button"
            onClick={logout}
            className="mt-4 text-sm text-on-surface-variant hover:text-primary"
          >
            로그아웃
          </button>
        ) : (
          <p className="mt-4 text-[10px] text-on-surface-variant">
            환경 변수 ADMIN_AUTH_ENABLED=true 로 로그인을 활성화하세요.
          </p>
        )}
      </div>
    </aside>
  );
}
`
);

write(
  "src/components/admin/AdminPropertyList.tsx",
  `"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import type { Property } from "@prisma/client";
import {
  categoryLabel,
  formatPropertyPrice,
  formatPropertySummary,
  parseImages,
  propertyTypeLabel,
} from "@/lib/format";

export function AdminPropertyList({ items }: { items: Property[] }) {
  async function handleDelete(id: string) {
    if (!confirm("이 매물을 삭제하시겠습니까?")) return;
    await fetch(\`/api/admin/properties/\${id}\`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-outline-variant bg-white custom-scrollbar">
      <table className="w-full text-left">
        <thead className="bg-surface-container text-on-surface-variant">
          <tr>
            {["매물", "분류", "거래", "가격", "지역", "상태", "관리"].map((h) => (
              <th key={h} className="p-4 font-label-md">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const thumb = parseImages(item.images)[0];
            return (
              <tr key={item.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-16 overflow-hidden rounded bg-surface-container">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">home</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-on-surface-variant">{formatPropertySummary(item)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm">{categoryLabel(item.category)}</td>
                <td className="p-4 text-sm">{propertyTypeLabel(item.type)}</td>
                <td className="p-4 text-sm font-bold text-primary">{formatPropertyPrice(item)}</td>
                <td className="p-4 text-sm">{item.region}</td>
                <td className="p-4 text-sm">
                  {item.status}
                  {item.featured && <span className="ml-1 text-xs text-secondary">★</span>}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={\`/admin/properties/\${item.id}/edit\`} className="text-sm text-primary">
                      수정
                    </Link>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-sm text-error">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
`
);

write(
  "src/app/admin/(console)/consultations/page.tsx",
  `import { AppLink as Link } from "@/components/ui/AppLink";
import { prisma } from "@/lib/prisma";

export default async function AdminConsultationsPage() {
  const items = await prisma.consultation.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-10">
      <h1 className="font-headline-lg text-primary">상담 예약 관리</h1>
      <div className="mt-8 custom-scrollbar overflow-x-auto rounded-xl border border-outline-variant bg-white">
        <table className="w-full text-left">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              {["일시", "의뢰인", "분류", "상태", "요약"].map((h) => (
                <th key={h} className="p-4 font-label-md">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-t border-outline-variant">
                <td className="p-4 text-sm">{row.createdAt.toLocaleString("ko-KR")}</td>
                <td className="p-4 text-sm font-bold">{row.clientName}</td>
                <td className="p-4 text-sm">{row.category}</td>
                <td className="p-4 text-sm">{row.status}</td>
                <td className="p-4 text-sm text-on-surface-variant">{row.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/admin" className="mt-6 inline-block text-primary">← 대시보드</Link>
    </main>
  );
}
`
);

patch("src/components/user/UserShell.tsx", [
  ["??중개", "일반중개"],
  ["??물건", "경매물건"],
  ["??소식", "부동산소식"],
  ["??상담", "법률상담"],
]);

console.log("done");
