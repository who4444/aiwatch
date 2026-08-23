import { formatEventForEmail } from "@/lib/notify";
import { SEED_EVENTS } from "@/lib/seed-data";

export const metadata = { title: "Email preview — aiwatch" };

export default function EmailPreviewPage({ searchParams }: { searchParams: { id?: string } }) {
  const ev = SEED_EVENTS.find((e) => e.id === searchParams.id) ?? SEED_EVENTS.find((e) => e.severity === "high")!;
  const { subject, html, text } = formatEventForEmail(ev);

  return (
    <div className="mx-auto max-w-[760px] px-4 py-8">
      <div className="text-[10px] tracking-widest uppercase opacity-50">Mail artifact — preview</div>
      <h1 className="text-2xl font-bold mt-1">What the mail looks like</h1>
      <p className="text-sm text-zinc-600 mt-1">Fixed font (JetBrains Mono → Courier fallback), plain language, single focus, lots of air. This is the actual HTML we send via Resend.</p>

      <div className="mt-6 border border-[var(--line-strong)] bg-white p-4">
        <div className="text-xs tracking-wide uppercase opacity-60">Subject</div>
        <div className="font-medium mt-1">{subject}</div>
        <div className="text-xs opacity-60 mt-2">From: aiwatch &lt;onboarding@resend.dev&gt; (or your RESEND_FROM) · Preheader: {ev.why_it_matters.slice(0, 80)}…</div>
      </div>

      <div className="mt-6">
        <div className="text-xs tracking-widest uppercase opacity-50 mb-2">Rendered HTML (iframe)</div>
        <div className="border border-[var(--ink)] bg-[#F6F5F1] p-2">
          <iframe title="email preview" srcDoc={html} className="w-full h-[640px] bg-white border border-[#D6D3CC]" />
        </div>
      </div>

      <details className="mt-6 border border-[var(--line-strong)] bg-white">
        <summary className="px-4 py-3 text-sm font-medium cursor-pointer">Show plain-text version (for clients that block HTML)</summary>
        <pre className="px-4 pb-4 pt-2 text-xs leading-relaxed whitespace-pre-wrap break-words bg-[var(--paper-2)] border-t">{text}</pre>
      </details>

      <div className="mt-4 flex gap-2 text-xs">
        <span className="opacity-60">Previewing:</span>
        {SEED_EVENTS.slice(0, 5).map((e) => (
          <a key={e.id} href={`/email-preview?id=${e.id}`} className={`px-2 py-1 border text-xs ${e.id === ev.id ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line-strong)] hover:border-[var(--ink)]"}`}>
            {e.provider} · {e.severity}
          </a>
        ))}
      </div>

      <div className="mt-6 border border-dashed p-4 text-xs leading-relaxed bg-white">
        <strong>Design notes:</strong> Table-based, inline styles, 560px max (email-safe). Hazard stripe only on high. Two sections only — “What changed” + “What to do” — no hash/RSS jargon. CTA is a solid ink button. Footer is one line: manage / unsubscribe / timeline. Fixed font degrades to Courier New where JetBrains Mono isn’t available.
      </div>
    </div>
  );
}
