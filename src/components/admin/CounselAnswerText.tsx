/** 법률·세무 상담 5단 답변 렌더 — 제목 분홍, 요약 본문 노랑 */

const HEADING_RE = /^(■\s*\[[^\]]+\])\s*/;

function isSummaryHeading(heading: string): boolean {
  return /요약\s*답변/.test(heading);
}

export function CounselAnswerText({ content }: { content: string }) {
  const blocks = content.split(/(?=■\s*\[[^\]]+\])/).filter((b) => b.length > 0);

  if (blocks.length === 0) {
    return <span className="whitespace-pre-wrap text-slate-200">{content}</span>;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const m = block.match(HEADING_RE);
        if (!m) {
          return (
            <p key={i} className="whitespace-pre-wrap text-slate-200">
              {block}
            </p>
          );
        }
        const heading = m[1];
        const body = block.slice(m[0].length).replace(/^\n+/, "").replace(/\n+$/, "");
        const summary = isSummaryHeading(heading);
        return (
          <div key={i}>
            <p className="font-bold text-[#ff8ec8]">{heading}</p>
            {body ? (
              <p
                className={`mt-1 whitespace-pre-wrap ${
                  summary ? "font-medium text-[#ffe566]" : "text-slate-200"
                }`}
              >
                {body}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
