import { FileText, PlayCircle } from "lucide-react";

const CHANNELS = {
  youtube:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ??
    "https://www.youtube.com/@%EC%B0%AC%EC%8A%A4%EA%B2%BD%EB%A7%A4%EC%A4%91%EA%B0%9C",
  blog: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.naver.com/kimdayn",
} as const;

export function ChannelShortcuts({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <a
        href={CHANNELS.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-landing-border bg-landing-card px-2 py-2 text-[11px] font-bold text-landing-text transition-colors hover:border-red-500/50 hover:bg-landing-card-hover sm:px-2.5"
        title="YouTube"
      >
        <PlayCircle className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
        <span className="hidden sm:inline">YouTube</span>
      </a>
      <a
        href={CHANNELS.blog}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-landing-border bg-[#03c75a]/10 px-2 py-2 text-[11px] font-bold text-landing-text transition-colors hover:border-[#03c75a]/50 hover:bg-[#03c75a]/20 sm:px-2.5"
        title="네이버 블로그"
      >
        <FileText className="h-4 w-4 shrink-0 text-[#03c75a]" aria-hidden />
        <span className="hidden sm:inline">네이버 블로그</span>
      </a>
    </div>
  );
}
