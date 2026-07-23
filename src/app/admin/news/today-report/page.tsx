import type { Metadata } from "next";
import { marked } from "marked";
import { AdminTodayNewsReport } from "@/components/admin/AdminTodayNewsReport";
import { seoulDateKey } from "@/lib/news-digest-email";
import { loadTodayArticles } from "@/lib/news-today";
import { loadTodayNewsReportMarkdown } from "@/lib/news-today-report";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

const REPORT_CSS = `
.chance-today-news { color: #2F2F2F; font-size: 14px; line-height: 1.7; }
.chance-today-news h1 {
  font-size: 22px; font-weight: 800; color: #6B5344; text-align: center;
  margin: 0 0 16px; letter-spacing: -0.02em;
}
.chance-today-news h2 {
  font-size: 15px; font-weight: 700; color: #3D342C;
  background: #F7E8D8; border-radius: 999px; padding: 10px 16px;
  margin: 22px 0 10px;
}
.chance-today-news p { margin: 0 0 10px; }
.chance-today-news ul { margin: 8px 0 14px; padding-left: 1.2em; }
.chance-today-news li { margin: 0 0 4px; }
.chance-today-news a { color: #2F6B4F; word-break: break-all; }
.chance-today-news strong { color: #3D342C; }
`;

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const dateKey =
    sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : seoulDateKey();
  return { title: `오늘의 뉴스 보고서 · ${dateKey} | 관리자` };
}

export default async function AdminTodayNewsReportPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const dateKey =
    sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : seoulDateKey();

  const [markdown, articles] = await Promise.all([
    loadTodayNewsReportMarkdown(dateKey),
    loadTodayArticles(dateKey).catch(() => []),
  ]);

  let articleHtml = "";
  if (markdown) {
    const body = await marked.parse(markdown, { async: true });
    articleHtml = `<style>${REPORT_CSS}</style>${body}`;
  }

  return (
    <AdminTodayNewsReport
      dateKey={dateKey}
      articleHtml={articleHtml}
      hasReport={Boolean(markdown)}
      articleCountHint={articles.length}
    />
  );
}
