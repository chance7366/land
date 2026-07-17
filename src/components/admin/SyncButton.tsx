"use client";

import { useState } from "react";

export function SyncButton() {
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    alert("동기화가 완료되었습니다.");
  }

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white transition-all hover:bg-primary-container disabled:opacity-50"
      >
        <span className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`}>sync</span>
        {loading ? "Synchronizing..." : "Sync Now"}
      </button>
      <button type="button" className="rounded-xl border border-outline px-4 text-primary hover:bg-surface" aria-label="동기화 중지">
        <span className="material-symbols-outlined">stop_circle</span>
      </button>
    </div>
  );
}
