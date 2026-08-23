"use client";
import { useState } from "react";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/subscribe?email=${encodeURIComponent(email)}`, { method: "DELETE" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "failed");
      setStatus("ok");
      setMsg("Removed. You won't hear from us again.");
    } catch (err: unknown) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 py-16 text-center">
      <div className="text-[10px] tracking-widest uppercase opacity-50">Unsubscribe</div>
      <h1 className="text-2xl font-bold mt-2">Leave the list</h1>
      <p className="text-sm text-zinc-600 mt-2">Enter the email you subscribed with. One click, gone — no “are you sure”.</p>

      {status === "ok" ? (
        <div className="mt-8 border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">{msg}</div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8">
          <div className="flex gap-2">
            <input
              required
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-[var(--ink)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
            />
            <button disabled={status === "loading"} className="bg-[var(--ink)] text-white px-4 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50">
              {status === "loading" ? "…" : "Remove me"}
            </button>
          </div>
          {msg && status === "err" && <div className="mt-3 text-xs px-3 py-2 border bg-red-50 border-red-200 text-red-700 text-left">{msg}</div>}
        </form>
      )}

      <p className="mt-6 text-xs opacity-40">Changed your mind later? Just subscribe again on the homepage.</p>
    </div>
  );
}
