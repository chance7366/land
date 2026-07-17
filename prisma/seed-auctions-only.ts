/**
 * Replace auction rows only (keeps properties and other data).
 * Run from serve dir: npx tsx prisma/seed-auctions-only.ts
 */
import { PrismaClient } from "@prisma/client";
import { AUCTION_SEED_DATA } from "./seed-auctions";

const prisma = new PrismaClient();

async function main() {
  await prisma.auction.deleteMany();
  await prisma.auction.createMany({
    data: AUCTION_SEED_DATA.map((row, i) => ({
      ...row,
      manageCode: `경매_${String(i + 1).padStart(8, "0")}`,
    })),
  });
  const count = await prisma.auction.count();
  console.log(`Auctions seeded: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
