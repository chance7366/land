/**
 * 기존 Property/Auction에 관리코드 부여 (매물_00000001 / 경매_00000001부터).
 * db push 직후 한 번 실행.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROPERTY_PREFIX = "매물";
const AUCTION_PREFIX = "경매";

function formatCode(prefix: string, seq: number) {
  return `${prefix}_${String(seq).padStart(8, "0")}`;
}

function parseSeq(code: string | null | undefined, prefix: string): number | null {
  if (!code) return null;
  const m = new RegExp(`^${prefix}_(\\d{1,8})$`).exec(code.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function main() {
  // 1) 컬럼이 없거나 비어 있으면 임시 유니크 값으로 채운 뒤 순번 부여
  const properties = await prisma.property.findMany({
    select: { id: true, manageCode: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  let p = 0;
  for (const row of properties) {
    const ok = parseSeq(row.manageCode, PROPERTY_PREFIX);
    if (ok != null) {
      if (ok > p) p = ok;
      continue;
    }
    p += 1;
    await prisma.property.update({
      where: { id: row.id },
      data: { manageCode: formatCode(PROPERTY_PREFIX, p) },
    });
  }

  const auctions = await prisma.auction.findMany({
    select: { id: true, manageCode: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  let a = 0;
  for (const row of auctions) {
    const ok = parseSeq(row.manageCode, AUCTION_PREFIX);
    if (ok != null) {
      if (ok > a) a = ok;
      continue;
    }
    a += 1;
    await prisma.auction.update({
      where: { id: row.id },
      data: { manageCode: formatCode(AUCTION_PREFIX, a) },
    });
  }

  console.log(`backfill done: properties up to ${formatCode(PROPERTY_PREFIX, p || 0)}, auctions up to ${formatCode(AUCTION_PREFIX, a || 0)}`);
  console.log(`counts: property=${properties.length}, auction=${auctions.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
