"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, providers: [], channel: "email" }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "failed");
      setStatus("ok");
      setMsg("Check inbox — free digest. Pro is instant (<1h).");
    } catch (err: unknown) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[var(--ink)]">
      <div className="h-1 bg-[var(--ink)]" />
      <div className="p-5">
        <div className="text-xs tracking-widest uppercase opacity-50">Get breaking changes</div>
        <div className="text-base font-medium mt-1">Stay ahead — free digest</div>

        <div className="mt-4 flex gap-2">
          <input
            required
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border border-[var(--ink)] px-3 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
          />
          <button disabled={status === "loading"} className="bg-[var(--ink)] text-white px-4 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50">
            {status === "loading" ? "…" : "Join"}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs opacity-60">
          <span>Discord + Telegram on Pro</span>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }} className="ml-auto underline">
            See pricing →
          </a>
        </div>

        {msg && <div className={`mt-3 text-xs px-3 py-2 border ${status === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>{msg}</div>}
      </div>
    </form>
  );
}
