import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, "utf8");
  console.log("wrote", rel);
}

function patch(rel, replacements) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content, "utf8");
  console.log("patched", rel);
}

patch("src/components/landing/LandingHeader.tsx", [["?�담 ?�약", "상담 예약"]]);

patch("src/components/property/PropertyDetailSpecs.tsx", [
  ["?�심 ?�보", "핵심 정보"],
  ["?�세", "상세"],
  ["?�치", "위치"],
  ["?�세 ?�명", "상세 설명"],
  ["??매물 ?�담 ?�청", "이 매물 상담 신청"],
]);

write(
  "src/components/consultation/ConsultationForm.tsx",
  `"use client";

import { useEffect, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { useSearchParams } from "next/navigation";
import { UserPageShell } from "@/components/user/UserPageShell";

const fieldClass =
  "w-full rounded-xl border border-landing-border bg-landing-elevated px-4 py-3 text-landing-text placeholder:text-landing-muted focus:border-blue-400 focus:outline-none";

export function ConsultationForm() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    category: "일반 상담",
    detail: "",
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (propertyId) {
      setForm((prev) => ({
        ...prev,
        category: "일반 상담",
        detail: prev.detail || \`매물 ID: \${propertyId}\\n\\n\`,
      }));
    }
  }, [propertyId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "신청에 실패했습니다.");
      return;
    }
    setDone(true);
  }

  return (
    <UserPageShell maxWidthClass="max-w-lg">
      <Link href="/" className="text-sm font-medium text-blue-400 hover:underline">
        ← 홈으로
      </Link>
      <h1 className="mt-4 font-headline-lg text-landing-text">상담 신청</h1>
      <p className="mt-2 text-landing-muted">변호사/세무사 1:1 맞춤 상담을 신청해주세요.</p>
      {propertyId && (
        <p className="mt-2 rounded-xl border border-landing-border bg-landing-surface px-3 py-2 text-sm text-landing-muted">
          선택한 매물에 대한 상담입니다.
        </p>
      )}

      {done ? (
        <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="font-bold text-emerald-300">상담 신청이 접수되었습니다.</p>
          <p className="mt-2 text-sm text-landing-muted">담당자가 빠르게 연락드리겠습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input placeholder="이름" className={fieldClass} value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} required />
          <input placeholder="연락처" className={fieldClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input placeholder="이메일 (선택)" type="email" className={fieldClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select className={fieldClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>일반 상담</option>
            <option>경매 입찰 상담</option>
            <option>권리분석 의뢰</option>
            <option>부동산 세무</option>
            <option>기타</option>
          </select>
          <textarea placeholder="상담 내용" rows={5} className={fieldClass} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required />
          {error && <p className="text-sm text-error">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,236,0.2)] transition-all hover:opacity-95">
            상담 신청하기
          </button>
        </form>
      )}
    </UserPageShell>
  );
}
`
);

console.log("done");
