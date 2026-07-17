"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!token) {
      setError("유효하지 않은 링크입니다.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscriptions/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "해지에 실패했습니다.");
        return;
      }
      setDone(true);
    } catch {
      setError("네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />
      <div className="mx-auto max-w-lg px-container-padding-mobile py-16 md:px-8">
        <GlassCard className="p-6 md:p-8">
          <h1 className="text-xl font-extrabold text-white">맞춤 알림 해지</h1>
          {done ? (
            <p className="mt-4 text-sm text-white/70">알림 신청이 해지되었습니다.</p>
          ) : (
            <>
              <p className="mt-3 text-sm text-white/60">
                더 이상 관심 매물·경매 알림을 받지 않으려면 아래 버튼을 눌러 주세요.
              </p>
              {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
              <button
                type="button"
                disabled={loading || !token}
                onClick={confirm}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-[#4dabff] py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {loading ? "처리 중…" : "알림 해지하기"}
              </button>
            </>
          )}
          <Link href="/" className="mt-4 inline-block text-sm text-[#4dabff] hover:underline">
            ← 홈으로
          </Link>
        </GlassCard>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
