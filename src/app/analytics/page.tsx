import { SEED_EVENTS, SEED_MODELS } from "@/lib/seed-data";
import { PROVIDERS } from "@/lib/providers";

export const metadata = { title: "Analytics — aiwatch" };

export default function AnalyticsPage() {
  const byProvider = Object.keys(PROVIDERS)
    .map((slug) => ({
      slug,
      name: PROVIDERS[slug as keyof typeof PROVIDERS].name,
      color: PROVIDERS[slug as keyof typeof PROVIDERS].color,
      count: SEED_MODELS.filter((m) => m.provider === slug).length,
    }))
    .sort((a, b) => b.count - a.count);

  const max = Math.max(1, ...byProvider.map((p) => p.count));

  const byMonth = [...SEED_MODELS]
    .sort((a, b) => +new Date(a.release_date) - +new Date(b.release_date))
    .reduce((acc: Record<string, number>, m) => {
      const k = m.release_date.slice(0, 7);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

  const severity = SEED_EVENTS.reduce((a, e) => {
    a[e.severity] = (a[e.severity] || 0) + 1;
    return a;
  }, {} as Record<string, number>);

  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-8">
      <div className="mono text-[10px] tracking-[0.18em] uppercase opacity-50">Seismograph</div>
      <h1 className="display text-3xl">Analytics — cadence & severity</h1>
      <p className="mono text-xs opacity-60 mt-1">Seed Aug 2026 • live fetcher updates in prod • 4× monthly cadence since 2023 (Business Insider)</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="border border-[var(--line-strong)] bg-white p-4">
          <div className="display text-lg">Models by provider</div>
          <div className="mt-4 space-y-2.5">
            {byProvider.map((r) => (
              <div key={r.slug} className="flex items-center gap-2">
                <span className="mono text-xs w-24 truncate">{r.name}</span>
                <div className="flex-1 h-2 bg-[var(--paper-2)] border border-[var(--line)] overflow-hidden">
                  <div className="h-full" style={{ width: `${(r.count / max) * 100}%`, background: r.color }} />
                </div>
                <span className="mono text-xs w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[var(--line-strong)] bg-white p-4">
          <div className="display text-lg">Releases by month</div>
          <div className="mt-4 space-y-2 mono text-xs">
            {Object.entries(byMonth).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-dashed border-[var(--line)] py-1">
                <span>{k}</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 bg-[var(--ink)] inline-block" style={{ width: `${v * 18}px` }} /> {v}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 mono text-[10px] tracking-widest uppercase bg-[var(--paper-2)] border border-[var(--line)] p-2">Industry: monthly cadence 4× since 2023.</div>
        </div>

        <div className="border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] p-4">
          <div className="display text-lg">Severity</div>
          <div className="mono text-xs opacity-60">What breaks prod vs noise</div>
          <div className="mt-4 space-y-3">
            {[
              ["high", severity.high || 0, "bg-[var(--hazard)]", "deprecation/sunset/alias/price-threshold"],
              ["medium", severity.medium || 0, "bg-amber-500", "new model / context"],
              ["low", severity.low || 0, "bg-zinc-600", "chore / docs"],
            ].map(([k, v, cls, desc]) => (
              <div key={k as string} className="flex items-center gap-3">
                <span className={`h-6 w-10 inline-flex items-center justify-center mono text-[10px] font-bold uppercase ${cls} text-white`}>{k as string}</span>
                <span className="mono text-sm">{String(v)}</span>
                <span className="mono text-[10px] opacity-60 tracking-widest uppercase">{desc as string}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 mono text-[10px] tracking-widest uppercase border border-white/20 p-2">High → instant. Medium → digest. Pro filterable.</div>
        </div>
      </div>

      <div className="mt-6 border border-[var(--line-strong)] bg-white p-5">
        <h3 className="display text-lg">Benchmark frontier</h3>
        <div className="mono text-xs opacity-60">GPQA Diamond • SWE-Bench Verified • MMMU — live in v1 via Artificial Analysis</div>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 mono text-xs">
          <div className="border border-[var(--ink)] p-3">
            <div className="opacity-60 tracking-widest uppercase">GPQA Diamond</div>
            <div className="text-sm font-medium mt-1">GPT-5.4-Pro — 94.4%</div>
          </div>
          <div className="border border-[var(--ink)] p-3">
            <div className="opacity-60 tracking-widest uppercase">SWE-Bench Verified</div>
            <div className="text-sm font-medium mt-1">Claude Opus 4.7 — 87.6%</div>
          </div>
          <div className="border border-[var(--ink)] p-3">
            <div className="opacity-60 tracking-widest uppercase">MMMU</div>
            <div className="text-sm font-medium mt-1">Tracked per-model in seed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
