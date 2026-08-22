import EventCard from "@/components/EventCard";
import { SEED_EVENTS } from "@/lib/seed-data";
import { PROVIDERS } from "@/lib/providers";

export const metadata = { title: "Timeline — aiwatch" };

export default function TimelinePage({ searchParams }: { searchParams: { provider?: string; severity?: string } }) {
  const provider = searchParams.provider as string | undefined;
  const severity = searchParams.severity as string | undefined;
  let events = [...SEED_EVENTS].sort((a, b) => +new Date(b.detected_at) - +new Date(a.detected_at));
  if (provider) events = events.filter((e) => e.provider === provider);
  if (severity) events = events.filter((e) => e.severity === severity);

  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-[10px] tracking-[0.18em] uppercase opacity-50">Tape archive</div>
          <h1 className="display text-3xl">Timeline — newest first</h1>
          <p className="mono text-xs opacity-60 mt-1">{SEED_EVENTS.length} events from 11 labs • watched directly from official pages • due dates tracked</p>
        </div>
        <div className="mono text-[10px] tracking-widest uppercase border border-[var(--line-strong)] bg-white px-3 py-2">
          {events.length} shown {provider || severity ? `• filtered` : ""}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        <a href="/timeline" className={`mono text-[10px] tracking-widest uppercase px-3 py-1.5 border ${!provider ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line-strong)] hover:border-[var(--ink)]"}`}>
          All labs
        </a>
        {Object.values(PROVIDERS).map((p) => (
          <a
            key={p.slug}
            href={`/timeline?provider=${p.slug}${severity ? `&severity=${severity}` : ""}`}
            className={`mono text-[10px] tracking-widest uppercase px-3 py-1.5 border inline-flex items-center gap-1.5 ${provider === p.slug ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line-strong)] hover:border-[var(--ink)]"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: provider === p.slug ? "white" : p.color }} />
            {p.name}
          </a>
        ))}
      </div>

      <div className="mt-3 flex gap-2 mono text-[10px] tracking-widest uppercase">
        <a href={`/timeline${provider ? `?provider=${provider}` : ""}`} className={`px-3 py-1.5 border ${!severity ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line-strong)]"}`}>All severities</a>
        {["high", "medium", "low"].map((s) => (
          <a
            key={s}
            href={`/timeline?${provider ? `provider=${provider}&` : ""}severity=${s}`}
            className={`px-3 py-1.5 border capitalize ${severity === s ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line-strong)]"}`}
          >
            {s}
          </a>
        ))}
      </div>

      <div className="mt-6 relative">
        {/* vertical rail */}
        <div className="hidden lg:block absolute left-[18px] top-0 bottom-0 w-px bg-[var(--line-strong)]" />
        <div className="grid md:grid-cols-2 gap-4 lg:pl-10">
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </div>

      {events.length === 0 && <div className="mt-8 mono text-sm opacity-60">No events for this filter. <a href="/timeline" className="underline">Clear</a></div>}
    </div>
  );
}
