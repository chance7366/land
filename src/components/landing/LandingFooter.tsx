import { AppLink as Link } from "@/components/ui/AppLink";

const BUSINESS = {
  name: "찬스부동산 경매중개",
  address: "충남 홍성군 홍북읍 신경리 00번지",
  representative: "김영찬 공인중개사",
  officeRegNo: "000000-0000-00000",
  bidAgentRegNo: "0000000-0000-00000",
  tel: "041-633-0000",
  mobile: "010-0000-0000",
  email: "kimdayn2@gmail.com",
  note: "매물·경매 정보는 참고용이며, 최종 확인은 현장·등기·법원 공고를 기준으로 합니다.",
} as const;

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-[12px] leading-tight">
      <dt className="w-[6.75rem] shrink-0 font-extrabold text-white sm:w-32">{label}</dt>
      <dd className="min-w-0 font-medium text-white/85">{children}</dd>
    </div>
  );
}

/**
 * Homepage business footer — compact height, bold white labels,
 * representative under brand name, no fax.
 */
export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-landing-border bg-landing-bg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4dabff]/55 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-container-padding-mobile py-3 md:px-8 md:py-3.5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="max-w-sm shrink-0">
            <Link
              href="/"
              className="inline-block outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text font-['Times_New_Roman',serif] text-sm font-bold text-transparent md:text-base">
                CHANCE REAL ESTATE & AUCTION
              </span>
            </Link>
            <h2 className="mt-1 text-sm font-extrabold italic text-[#d4af37] md:text-base">
              {BUSINESS.name}
            </h2>
            <p className="mt-0.5 text-[12px] font-extrabold leading-tight text-white">
              대표자 {BUSINESS.representative}
            </p>
          </div>

          <dl className="grid flex-1 gap-1 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-1">
            <InfoRow label="주소">{BUSINESS.address}</InfoRow>
            <InfoRow label="사무소등록번호">{BUSINESS.officeRegNo}</InfoRow>
            <InfoRow label="매수신청대리등록번호">{BUSINESS.bidAgentRegNo}</InfoRow>
            <InfoRow label="전화번호">
              <a href={`tel:${BUSINESS.tel.replace(/-/g, "")}`} className="hover:text-white">
                {BUSINESS.tel}
              </a>
            </InfoRow>
            <InfoRow label="핸드폰">
              <a href={`tel:${BUSINESS.mobile.replace(/-/g, "")}`} className="hover:text-white">
                {BUSINESS.mobile}
              </a>
            </InfoRow>
            <InfoRow label="이메일">
              <a href={`mailto:${BUSINESS.email}`} className="break-all hover:text-white">
                {BUSINESS.email}
              </a>
            </InfoRow>
          </dl>
        </div>

        <div className="mt-2 flex flex-col gap-0.5 border-t border-landing-border pt-2 text-[10px] text-landing-faint sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="leading-tight">{BUSINESS.note}</p>
          <p className="shrink-0">
            © {year} {BUSINESS.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
