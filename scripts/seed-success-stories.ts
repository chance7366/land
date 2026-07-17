import { PrismaClient } from "@prisma/client";
import { SUCCESS_STORY_SAMPLES } from "../src/lib/mockup/success-story-sample";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.successStory.count();
  if (count > 0) {
    console.log(`[seed-success-stories] skip · already ${count} rows`);
    return;
  }

  for (const s of SUCCESS_STORY_SAMPLES) {
    await prisma.successStory.create({
      data: {
        category: s.category,
        title: s.title,
        content: s.content,
        authorName: s.authorName,
        status: "PUBLISHED",
        createdAt: new Date(s.createdAt),
      },
    });
  }
  console.log(`[seed-success-stories] created ${SUCCESS_STORY_SAMPLES.length}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
