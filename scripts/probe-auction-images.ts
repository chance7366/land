import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) throw new Error(".env.local missing");
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnvLocal();
  process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("DATA_PROVIDER=", process.env.DATA_PROVIDER);
  console.log("SUPABASE_URL=", url);

  const { data, error } = await sb
    .from("auctions")
    .select("manage_code, title, images, status")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;

  console.log("\n=== Supabase auctions ===");
  for (const a of data ?? []) {
    const imgs = Array.isArray(a.images) ? a.images : [];
    console.log({
      code: a.manage_code,
      title: a.title,
      status: a.status,
      imgCount: imgs.length,
      sample: imgs[0] ?? null,
    });
  }

  const { data: props } = await sb
    .from("properties")
    .select("manage_code, title, images")
    .limit(10);
  console.log("\n=== Supabase properties (sample) ===");
  for (const p of props ?? []) {
    const imgs = Array.isArray(p.images) ? p.images : [];
    console.log({
      code: p.manage_code,
      imgCount: imgs.length,
      sample: imgs[0] ?? null,
    });
  }

  const prisma = new PrismaClient();
  try {
    const local = await prisma.auction.findMany({
      select: { manageCode: true, title: true, images: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    });
    console.log("\n=== Local Prisma auctions ===");
    for (const a of local) {
      let imgs: string[] = [];
      try {
        const parsed = JSON.parse(a.images || "[]");
        imgs = Array.isArray(parsed) ? parsed : [];
      } catch {
        imgs = [];
      }
      console.log({
        code: a.manageCode,
        title: a.title,
        imgCount: imgs.length,
        sample: imgs[0] ?? null,
      });
    }
  } finally {
    await prisma.$disconnect();
  }

  // storage list
  const { data: buckets } = await sb.storage.listBuckets();
  console.log(
    "\nBuckets:",
    (buckets ?? []).map((b) => b.name),
  );
  const { data: files, error: listErr } = await sb.storage
    .from("property-images")
    .list("auctions", { limit: 20 });
  console.log("storage auctions/", listErr?.message ?? files);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
