import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { PROPERTY_SEED_DATA } from "./seed-properties";
import { AUCTION_SEED_DATA } from "./seed-auctions";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@chance.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-in-production";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      name: "관리자",
    },
  });

  await prisma.property.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.news.deleteMany();
  await prisma.newsFeedItem.deleteMany();
  await prisma.legalQuestion.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.apiIntegration.deleteMany();
  await prisma.scrapingJob.deleteMany();
  await prisma.systemLog.deleteMany();

  await prisma.property.createMany({
    data: PROPERTY_SEED_DATA.map((row, i) => ({
      ...row,
      manageCode: `매물_${String(i + 1).padStart(8, "0")}`,
    })),
  });

  await prisma.auction.createMany({
    data: AUCTION_SEED_DATA.map((row, i) => ({
      ...row,
      manageCode: `경매_${String(i + 1).padStart(8, "0")}`,
    })),
  });

  await prisma.news.createMany({
    data: [
      {
        title: "내포신도시 개발 계획 발표",
        summary: "충청남도와 홍성군이 공동 발표한 제3차 국가산업단지 조성 계획...",
        body: "충청남도와 홍성군이 공동 발표한 제3차 국가산업단지 조성 계획에 내포신도시가 핵심 거점으로 선정되었습니다.",
        featured: true,
        thumbnail:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB3GiMJwP-aOwjOcQE7YkThX4ixXAyRHy_XwKGoN6NblpljNadXs5t3V61hFcIplwvr4LhYUuAqMVKIWA9aeYwILe2Jas9CAZfcmlv7gCAdHcaYZkYstm_SC2Cv1sQOGRi15g3OGi4Z20VgYG5BOran2QMkgnd_RHAZj9ZOoWaWpwQe3g0Ih_CapSZ2wQXJX0_XWMkenEJNQDsa5MRgiOuYQIQlpzm9AzSVAVEPCuOPPQ4-27m_jiKc",
      },
      {
        title: "내포-홍성 광역철도 연장 확정",
        summary: "주변 토지 및 아파트 거래 활성화 기대...",
        body: "내포-홍성 광역철도 연장이 확정되어 주변 부동산 시장에 긍정적 영향이 예상됩니다.",
      },
      {
        title: "내포신도시 3기 신규 분양 일정 공개",
        summary: "2026년 하반기 분양 예정, 청약 관심 집중",
        body: "내포신도시 3기 신규 아파트 단지 분양 일정이 공개되었습니다. 총 1,200세대 규모로 2026년 9월 분양 예정입니다.",
      },
      {
        title: "금리 인하와 내포 부동산 시장 전망",
        summary: "거래량 회복세, 실수요자 관망 해소 기대",
        body: "기준금리 인하 기대감으로 내포신도시 아파트 거래 문의가 증가하고 있습니다. 전문가들은 점진적 회복을 전망합니다.",
      },
      {
        title: "내포신도시 학군 재배치 발표",
        summary: "신규 초·중학교 개교로 학군 가치 상승",
        body: "교육청이 내포신도시 학군 재배치안을 발표했습니다. 2027년 신규 초·중학교 개교가 예정되어 있습니다.",
      },
      {
        title: "홍성군 전세사기 피해 예방 캠페인",
        summary: "임대차 계약 시 확인사항 안내",
        body: "홍성군이 전세사기 예방을 위한 임대인 확인 절차와 표준계약서 활용 캠페인을 실시합니다.",
      },
      {
        title: "내포신도시 상업지구 조성 착공",
        summary: "대형 마트·복합문화시설 유치 추진",
        body: "내포신도시 동쪽 상업지구 조성 공사가 착공되었습니다. 2028년 준공 목표로 복합문화시설 입점이 논의 중입니다.",
      },
      {
        title: "2026년 부동산 세제 개편안 요약",
        summary: "다주택·양도세 관련 주요 변경점 정리",
        body: "국회에서 논의 중인 부동산 세제 개편안의 핵심 내용을 요약합니다. 다주택자 양도세 중과 기준 등이 포함됩니다.",
      },
      {
        title: "내포-대전 광역버스 노선 확대",
        summary: "통근 접근성 개선, 외곽 아파트 수요 증가",
        body: "내포신도시에서 대전까지 연결되는 광역버스 노선이 확대됩니다. 출퇴근 통근 수요가 늘어날 것으로 보입니다.",
      },
      {
        title: "내포신도시 실거래가 동향 (2026년 2분기)",
        summary: "아파트 84㎡ 평균 4.1억, 전분기 대비 보합",
        body: "국토교통부 실거래가 기준 내포신도시 아파트 84㎡ 평균 거래가는 4.1억원으로 전분기와 비슷한 수준을 유지했습니다.",
      },
      {
        title: "경매 물건 증가와 내포 지역 영향",
        summary: "금융권 경매 출품 증가, 입찰 기회 확대",
        body: "금융기관 경매 출품이 늘면서 내포·홍성 지역 경매 물건도 증가 추세입니다. 권리분석 후 입찰 전략이 중요합니다.",
      },
      {
        title: "내포신도시 공원 조성 완료",
        summary: "주변 아파트 녹지 접근성 개선",
        body: "내포신도시 중앙공원 2단계 조성이 완료되어 주변 단지 주민들의 녹지 이용이 편리해졌습니다.",
      },
    ],
  });

  const { fallbackNewsFeedItems } = await import("../src/lib/news-feed-collect");
  await prisma.newsFeedItem.createMany({
    data: fallbackNewsFeedItems().map((row) => ({
      source: row.source,
      sourceName: row.sourceName,
      title: row.title,
      summary: row.summary ?? "",
      press: row.press ?? "",
      originUrl: row.originUrl,
      imageUrl: row.imageUrl ?? null,
      rank: row.rank ?? null,
      pubDate: row.pubDate,
    })),
  });

  await prisma.legalQuestion.createMany({
    data: [
      {
        category: "임대차",
        question: "계약 만료 전 퇴거 시 복비 문제",
        answer:
          "통상적으로 계약 기간을 채우지 못하고 퇴거할 경우 임차인이 수수료를 부담하는 관례가 있으나, 협의에 따라 달라질 수 있습니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "경매",
        question: "경매 낙찰 후 명도 절차 기간?",
        status: "PENDING",
      },
      {
        category: "임대차",
        question: "전세 계약 만료 후 보증금 반환 거부",
        answer:
          "임대차보호법상 계약 종료 후 정당한 사유 없이 보증금 반환을 거부할 수 없습니다. 내용증명 발송 후 지급명령·소송 절차를 검토하세요.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "경매",
        question: "경매 유찰 시 최저가는 어떻게 되나요?",
        answer:
          "유찰될 때마다 최저매각가격이 통상 20~30% 하락합니다. 단, 법원 기준과 물건별 특성에 따라 달라질 수 있습니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "세무",
        question: "다주택자 양도세 중과 기준은?",
        answer:
          "보유·거주 요건, 취득 시기, 조정대상지역 여부 등에 따라 중과율이 달라집니다. 개별 상담을 통해 정확한 세액을 산출하는 것이 좋습니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "명도",
        question: "대항력 있는 임차인 명도 방법",
        status: "PENDING",
      },
      {
        category: "임대차",
        question: "월세 인상 요구 가능 범위",
        answer:
          "갱신·재계약 시 임대료는 통상 5% 이내 인상이 관례입니다. 5% 초과 시 협의가 필요하며, 분쟁 시 조정·소송이 가능합니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "경매",
        question: "선순위 전세권과 낙찰자의 관계",
        status: "PENDING",
      },
      {
        category: "등기",
        question: "가등기 말소 후 매매 계약 유효 여부",
        answer:
          "가등기가 말소되면 원상 회복되나, 말소 전 매매계약의 효력은 개별 사안에 따라 달라집니다. 등기부등본 확인이 필수입니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "세무",
        question: "1세대 1주택 비과세 요건",
        status: "PENDING",
      },
      {
        category: "분양",
        question: "분양권 양도 시 취득세·양도세",
        answer:
          "분양권 양도는 부동산 양도로 보아 양도소득세가 발생할 수 있으며, 취득 시기·거주 요건에 따라 달라집니다. 세무사 상담을 권합니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
      {
        category: "명도",
        question: "유치권 주장 임차인 대응 방법",
        status: "PENDING",
      },
      {
        category: "임대차",
        question: "상가 권리금 반환 분쟁",
        answer:
          "권리금은 당사자 간 약정에 따르며, 임대인 승낙 없는 양도·반환 요구는 계약 내용에 따라 판단됩니다. 계약서·증빙 확인이 필요합니다.",
        answerer: "찬스 법률자문단",
        status: "ANSWERED",
        answeredAt: new Date(),
      },
    ],
  });

  await prisma.consultation.createMany({
    data: [
      {
        clientName: "김철수",
        phone: "010-1234-5678",
        category: "경매 입찰 대행",
        summary: "내포신도시 OO아파트 경매 참여 희망...",
        detail: "내포신도시 OO아파트 경매 참여를 희망합니다.",
        status: "PENDING",
      },
      {
        clientName: "이영희",
        phone: "010-2345-6789",
        category: "권리분석 요청",
        summary: "홍성읍 상가건물 유치권 행사 관련...",
        detail: "홍성읍 상가건물 유치권 행사 관련 상담 요청",
        status: "PENDING",
      },
      {
        clientName: "박민준",
        phone: "010-3456-7890",
        category: "부동산 절세",
        summary: "다주택자 취득세 중과 및 종부세...",
        detail: "다주택자 취득세 중과 및 종부세 관련 문의",
        status: "PROCESSING",
      },
    ],
  });

  await prisma.apiIntegration.createMany({
    data: [
      { name: "국토부 실거래가 API", provider: "molit", status: "ACTIVE", dailyUsage: 42 },
      { name: "카카오 맵 API", provider: "kakao", status: "WARNING", dailyUsage: 82 },
    ],
  });

  await prisma.scrapingJob.create({
    data: {
      name: "내포신도시 매물 수집기",
      status: "RUNNING",
      progress: 75,
      scrapedCount: 1402,
      errorCount: 3,
      updatedCount: 42,
      lastRunAt: new Date("2024-05-20T14:15:22"),
    },
  });

  await prisma.systemLog.createMany({
    data: [
      { level: "info", event: "DATA_FETCH_SUCCESS", message: "OK" },
      { level: "info", event: "REAL_PRICE_UPDATE", message: "OK" },
      { level: "error", event: "NEIGHBORHOOD_SYNC", message: "ERR" },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
