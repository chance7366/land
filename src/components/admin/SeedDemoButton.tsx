"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedDemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function run() {
    if (!confirm("데모 매물·경매·상담소·성공스토리를 Supabase에 넣을까요?")) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/seed-demo", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        properties?: number;
      };
      if (!res.ok) {
        setMsg(data.error ?? "실패했습니다. Supabase 환경변수를 확인하세요.");
        return;
      }
      setMsg("데모 데이터를 넣었습니다. 홈으로 가서 확인해 보세요.");
      router.refresh();
    } catch {
      setMsg("요청 중 오류가 발생했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={() => void run()}
        className="rounded-lg border border-amber-400/40 bg-amber-500/15 px-4 py-2 font-label-md text-amber-100 hover:bg-amber-500/25 disabled:opacity-50"
      >
        {busy ? "넣는 중…" : "데모 데이터 넣기"}
      </button>
      {msg ? <p className="max-w-xs text-right text-xs text-landing-muted">{msg}</p> : null}
    </div>
  );
}
