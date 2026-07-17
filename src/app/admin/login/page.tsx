"use client";

import { useState } from "react";
import { navigateTo } from "@/lib/navigate";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@chance.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "로그인에 실패했습니다.");
      setLoading(false);
      return;
    }

    navigateTo("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-landing-bg p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <GlassCard className="p-8">
        <h1 className="font-headline-md text-landing-text">CHANCE ADMIN</h1>
        <p className="mt-2 text-sm text-landing-muted">Management Console 로그인</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-landing-text">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-landing-text placeholder:text-landing-muted focus:border-blue-400/50 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-landing-text">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
        </GlassCard>
      </form>
    </div>
  );
}
