/**
 * Update all auction + property titles using auto-suggest rules.
 * Run from serve dir: node ./node_modules/tsx/dist/cli.mjs prisma/update-titles.ts
 */
import { PrismaClient } from "@prisma/client";
import { suggestPropertyTitle } from "../src/lib/property-fields";
import { suggestAuctionTitle } from "../src/lib/auction-title";

const prisma = new PrismaClient();

async function main() {
  const auctions = await prisma.auction.findMany();
  let auctionUpdated = 0;
  for (const a of auctions) {
    const title = suggestAuctionTitle({
      itemType: a.itemType,
      landArea: a.landArea,
      buildingArea: a.buildingArea,
      appraisalPrice: a.appraisalPrice,
      minPrice: a.minPrice ?? a.recommendedPrice,
      saleDate: a.saleDate,
    });
    if (title && title !== a.title) {
      await prisma.auction.update({ where: { id: a.id }, data: { title } });
      auctionUpdated += 1;
    }
  }

  const properties = await prisma.property.findMany();
  let propertyUpdated = 0;
  for (const p of properties) {
    const title = suggestPropertyTitle({
      category: p.category,
      type: p.type,
      buildingName: p.buildingName,
      exclusiveArea: p.exclusiveArea,
    });
    if (title && title !== p.title) {
      await prisma.property.update({ where: { id: p.id }, data: { title } });
      propertyUpdated += 1;
    }
  }

  console.log(`Auctions updated: ${auctionUpdated}/${auctions.length}`);
  console.log(`Properties updated: ${propertyUpdated}/${properties.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
