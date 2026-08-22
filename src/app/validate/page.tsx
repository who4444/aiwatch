export const metadata = { title: "Validate — aiwatch smoke test" };

export default function ValidatePage() {
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">
      <div className="mono text-[10px] tracking-[0.18em] uppercase opacity-50">Playbook</div>
      <h1 className="display text-3xl">Smoke-test validation — 7 days</h1>
      <p className="mono text-xs opacity-60 mt-1">Goal: validate $5/mo $39/yr high-vol before building billing.</p>

      <div className="mt-6 space-y-4">
        <div className="border border-[var(--line-strong)] bg-white p-5">
          <div className="mono text-[10px] tracking-widest uppercase opacity-50">Day 1-2 — Ship + seed</div>
          <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
            <li>
              <code className="bg-[var(--paper-2)] border px-1">npm run build</code> passes (21 routes, 11 SSG). Current build: ✓
            </li>
            <li>
              Push to Vercel, set <code className="bg-[var(--paper-2)] border px-1">CRON_SECRET</code>, test <code className="bg-[var(--paper-2)] border px-1">/api/cron?secret=xxx</code>
            </li>
            <li>
              Run <code className="bg-[var(--paper-2)] border px-1">supabase.sql</code> in dashboard; fill
              <code className="bg-[var(--paper-2)] border px-1">.env.local</code>
            </li>
          </ul>
        </div>

        <div className="border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] p-5">
          <div className="mono text-[10px] tracking-widest uppercase opacity-60">Day 3-7 — $100 spend + organic</div>
          <ul className="mt-2 text-sm space-y-1 list-disc pl-5 opacity-90">
            <li>Post X bot thread + r/LocalLLaMA + HN Show HN — capture utm via referrer.</li>
            <li>$50 Reddit + $50 X promote → /?ref=ad</li>
            <li>
              Query: <code className="bg-white/10 border border-white/20 px-1">select plan, count(*) from checkout_intents group by plan</code>
            </li>
          </ul>
          <div className="mt-4 bg-white text-[var(--ink)] p-3 mono text-xs">
            PASS &gt;12% email @500 + &gt;2.5% intent → build Stripe. FAIL &lt;1.5% after 2 iterates → stay free + sponsors.
          </div>
        </div>

        <div className="border border-[var(--line-strong)] bg-white p-5">
          <div className="mono text-[10px] tracking-widest uppercase opacity-50">Interview (10 indie hackers, X DM)</div>
          <ol className="mt-2 text-sm list-decimal pl-5 space-y-1">
            <li>Last model/price break? Hours/$ lost?</li>
            <li>How monitor 11 labs today?</li>
            <li>Would &lt;1h fix-it note save you? Pay $5?</li>
          </ol>
          <div className="mono text-[10px] tracking-widest uppercase opacity-40 mt-2">If no $ cost → not a paid problem.</div>
        </div>

        <div className="border border-[var(--line-strong)] bg-white p-5">
          <div className="mono text-[10px] tracking-widest uppercase opacity-50">Where to market — indie priority</div>
          <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
            <li>
              <strong>Tier1 zero-CAC:</strong> X bot (every high), r/LocalLLaMA teardown, Indie Hackers, HN
            </li>
            <li>
              <strong>Tier2:</strong> Ben’s Bites (120k) + TLDR AI (1.1M) slot + Product Hunt
            </li>
            <li>
              <strong>Tier3 SEO:</strong> Every model + diff diff page long-tail (MCP later)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
