import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const [properties, auctions, news, legal] = await Promise.all([
  prisma.property.count({ where: { status: "ACTIVE" } }),
  prisma.auction.count({ where: { status: "ONGOING" } }),
  prisma.news.count(),
  prisma.legalQuestion.count({ where: { isPublic: true } }),
]);
console.log(JSON.stringify({ properties, auctions, news, legal }));
await prisma.$disconnect();
