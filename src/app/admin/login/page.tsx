"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

function resolveFromPath(): string {
  if (typeof window === "undefined") return "/admin";
  const from = new URLSearchParams(window.location.search).get("from") || "/admin";
  return from.startsWith("/admin") ? from : "/admin";
}

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.trim() }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "로그인에 실패했습니다.");
      setLoading(false);
      return;
    }

    // 쿠키 반영을 위해 soft navigation 대신 전체 이동
    window.location.href = resolveFromPath();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-landing-bg p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <GlassCard className="p-8">
          <h1 className="font-headline-md text-landing-text">CHANCE ADMIN</h1>
          <p className="mt-2 text-sm text-landing-muted">
            관리자 비밀번호를 입력하세요.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-landing-text">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-landing-text placeholder:text-landing-muted focus:border-blue-400/50 focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-cta-from to-cta-to py-3 font-label-md text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "확인 중..." : "입장"}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
