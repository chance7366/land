/**
 * DB의 /uploads/{kind}/... 경로 파일을 Supabase Storage(property-images)로 올리고
 * auctions/properties.images URL을 공개 Storage URL로 갱신합니다.
 *
 * 사용: node ./node_modules/tsx/dist/cli.mjs scripts/migrate-uploads-to-supabase-storage.ts
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "property-images";
const SEARCH_DIRS = [
  resolve(process.cwd(), "storage/uploads"),
  resolve("C:/dev/chance-auction/storage/uploads"),
  resolve(process.cwd(), "public/uploads"),
  resolve("C:/dev/chance-auction/public/uploads"),
];

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) throw new Error(".env.local 이 없습니다.");
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

function contentType(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "pdf") return "application/pdf";
  return "image/jpeg";
}

function findLocalFile(kind: string, filename: string): string | null {
  for (const root of SEARCH_DIRS) {
    const full = join(root, kind, filename);
    if (existsSync(full)) return full;
  }
  return null;
}

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((v): v is string => typeof v === "string" && v.length > 0);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((v): v is string => typeof v === "string" && v.length > 0)
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseUploadPath(url: string): { kind: string; filename: string } | null {
  const m = url.match(/^\/uploads\/(properties|auctions)\/([^/?#]+)$/);
  if (!m) return null;
  return { kind: m[1], filename: m[2] };
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase 키가 없습니다.");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const tables = ["auctions", "properties"] as const;
  const cache = new Map<string, string>(); // localPathOrKey -> publicUrl
  let uploaded = 0;
  let rewritten = 0;
  let missing = 0;

  for (const table of tables) {
    const { data, error } = await sb.from(table).select("id, manage_code, images");
    if (error) throw error;

    for (const row of data ?? []) {
      const images = parseImages(row.images);
      if (images.length === 0) continue;

      const nextImages: string[] = [];
      let changed = false;

      for (const img of images) {
        if (img.startsWith("http://") || img.startsWith("https://")) {
          nextImages.push(img);
          continue;
        }

        const parsed = parseUploadPath(img);
        if (!parsed) {
          nextImages.push(img);
          continue;
        }

        const cacheKey = `${parsed.kind}/${parsed.filename}`;
        if (cache.has(cacheKey)) {
          nextImages.push(cache.get(cacheKey)!);
          changed = true;
          continue;
        }

        const localPath = findLocalFile(parsed.kind, parsed.filename);
        if (!localPath) {
          console.warn("파일 없음:", img);
          missing += 1;
          nextImages.push(img);
          continue;
        }

        const storagePath = `${parsed.kind}/${parsed.filename}`;
        const body = readFileSync(localPath);
        const { error: upErr } = await sb.storage.from(BUCKET).upload(storagePath, body, {
          contentType: contentType(parsed.filename),
          upsert: true,
        });
        if (upErr) throw new Error(`upload ${storagePath}: ${upErr.message}`);

        const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
        cache.set(cacheKey, pub.publicUrl);
        nextImages.push(pub.publicUrl);
        uploaded += 1;
        changed = true;
        console.log("uploaded", storagePath);
      }

      if (changed) {
        const { error: updErr } = await sb
          .from(table)
          .update({ images: nextImages })
          .eq("id", row.id);
        if (updErr) throw new Error(`update ${table} ${row.manage_code}: ${updErr.message}`);
        rewritten += 1;
        console.log("updated", table, row.manage_code, nextImages.length);
      }
    }
  }

  console.log("\n완료:", { uploaded, rewrittenRows: rewritten, missing, cached: cache.size });
  console.log("검색 폴더:", SEARCH_DIRS.filter((d) => existsSync(d)));
  for (const root of SEARCH_DIRS) {
    for (const kind of ["auctions", "properties"]) {
      const dir = join(root, kind);
      if (!existsSync(dir)) continue;
      const n = readdirSync(dir).filter((f) => f !== ".gitkeep").length;
      console.log(`  ${dir}: ${n} files`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
