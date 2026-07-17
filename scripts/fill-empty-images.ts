/**
 * One-off: assign a random existing photo to properties/auctions with empty images.
 * Run: npx tsx scripts/fill-empty-images.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseImages(json: string | null | undefined): string[] {
  try {
    const arr = JSON.parse(json || "[]");
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x.trim()) : [];
  } catch {
    return [];
  }
}

function pickRandom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

async function main() {
  const [properties, auctions] = await Promise.all([
    prisma.property.findMany({ select: { id: true, images: true, title: true } }),
    prisma.auction.findMany({ select: { id: true, images: true, title: true } }),
  ]);

  const pool = [
    ...properties.flatMap((p) => parseImages(p.images)),
    ...auctions.flatMap((a) => parseImages(a.images)),
  ];

  const uniquePool = [...new Set(pool)];
  if (uniquePool.length === 0) {
    console.error("No stored images found to reuse.");
    process.exit(1);
  }

  const emptyProps = properties.filter((p) => parseImages(p.images).length === 0);
  const emptyAucts = auctions.filter((a) => parseImages(a.images).length === 0);

  console.log(
    `Pool: ${uniquePool.length} unique images · empty properties: ${emptyProps.length} · empty auctions: ${emptyAucts.length}`,
  );

  let propUpdated = 0;
  for (const p of emptyProps) {
    const img = pickRandom(uniquePool);
    await prisma.property.update({
      where: { id: p.id },
      data: { images: JSON.stringify([img]) },
    });
    propUpdated++;
    console.log(`property ${p.id} ← ${img}`);
  }

  let auctUpdated = 0;
  for (const a of emptyAucts) {
    const img = pickRandom(uniquePool);
    await prisma.auction.update({
      where: { id: a.id },
      data: { images: JSON.stringify([img]) },
    });
    auctUpdated++;
    console.log(`auction ${a.id} ← ${img}`);
  }

  console.log(`Done. Updated properties=${propUpdated}, auctions=${auctUpdated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
