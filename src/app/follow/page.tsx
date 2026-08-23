"use client";
import { useState } from "react";

export default function FollowPage() {
  const [copied, setCopied] = useState(false);
  const feedUrl = typeof window !== "undefined" ? `${window.location.origin}/feed` : "/feed";

  async function copy() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-14">
      <div className="text-[10px] tracking-widest uppercase opacity-50">Follow aiwatch</div>
      <h1 className="text-3xl font-bold mt-2">Three ways to stay updated</h1>
      <p className="text-sm text-zinc-600 mt-2">Pick whichever fits your flow. All free, all the same breaking-change feed.</p>

      {/* 1 — email */}
      <div className="mt-8 border border-[var(--ink)] bg-white">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-[var(--paper-2)]">
          <span className="h-5 w-5 inline-flex items-center justify-center bg-[var(--ink)] text-white text-[10px] font-bold">1</span>
          <span className="text-sm font-medium">Email digest</span>
          <span className="ml-auto text-[10px] tracking-widest uppercase opacity-50">easiest</span>
        </div>
        <div className="p-4 text-sm text-zinc-600">One email a day, max. Only when something actually changed.</div>
        <div className="px-4 pb-4"><a href="/#top" className="inline-block border border-[var(--ink)] px-4 py-2 text-xs tracking-widest uppercase hover:bg-[var(--ink)] hover:text-white">Subscribe on homepage →</a></div>
      </div>

      {/* 2 — RSS */}
      <div className="mt-4 border border-[var(--line-strong)] bg-white">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-[var(--paper-2)]">
          <span className="h-5 w-5 inline-flex items-center justify-center border border-[var(--ink)] text-[10px] font-bold">2</span>
          <span className="text-sm font-medium">RSS reader</span>
          <span className="ml-auto text-[10px] tracking-widest uppercase opacity-50">Feedly · NetNewsWire · Minifl</span>
        </div>
        <div className="p-4">
          <div className="text-sm text-zinc-600 mb-3">Paste this URL into any RSS app:</div>
          <div className="flex gap-2">
            <code className="flex-1 border bg-[var(--paper-2)] px-3 py-2.5 text-xs break-all">{feedUrl}</code>
            <button onClick={copy} className="bg-[var(--ink)] text-white px-4 text-xs tracking-widest uppercase hover:bg-black shrink-0">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* 3 — X */}
      <div className="mt-4 border border-[var(--line-strong)] bg-white">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-[var(--paper-2)]">
          <span className="h-5 w-5 inline-flex items-center justify-center border border-[var(--ink)] text-[10px] font-bold">3</span>
          <span className="text-sm font-medium">X / Twitter bot</span>
          <span className="ml-auto text-[10px] tracking-widest uppercase opacity-50">high-severity only</span>
        </div>
        <div className="p-4 flex flex-wrap gap-3 items-center">
          <div className="text-sm text-zinc-600">Every high-severity break posted the moment we catch it.</div>
          <a href="/api/x-bot?preview=1" className="ml-auto underline text-sm">Preview next post →</a>
        </div>
      </div>

      <p className="mt-8 text-xs opacity-40">Pro subscribers additionally get instant &lt;1h alerts on Discord + Telegram.</p>
    </div>
  );
}
