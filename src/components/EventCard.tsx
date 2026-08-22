import { ModelEvent } from "@/lib/types";
import { PROVIDERS } from "@/lib/providers";

export default function EventCard({ ev, compact = false }: { ev: ModelEvent; compact?: boolean }) {
  const p = PROVIDERS[ev.provider];
  const isHigh = ev.severity === "high";
  return (
    <a
      href={ev.source_url}
      target="_blank"
      rel="noopener"
      className="group flex gap-4 border bg-white p-4 hover:border-[var(--ink)] transition"
      style={{ borderColor: isHigh ? "var(--ink)" : "var(--line-strong)" }}
    >
      {/* accent */}
      <div className="w-1 shrink-0 self-stretch" style={{ background: isHigh ? "var(--hazard)" : "var(--line-strong)" }} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] tracking-wide uppercase opacity-60">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span>·</span>
          <span>{new Date(ev.detected_at).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}</span>
          {ev.effective_date && <span className="ml-auto text-amber-700">eff {ev.effective_date}</span>}
        </div>

        <h3 className="mt-1.5 text-[15px] leading-snug font-medium group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: isHigh ? "var(--hazard)" : "var(--line-strong)" }}>
          {ev.title}
        </h3>

        {!compact && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 line-clamp-2">{ev.why_it_matters}</p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <span className={`text-[10px] tracking-wide uppercase px-2 py-1 border ${isHigh ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line-strong)]"}`}>
            {ev.severity}
          </span>
          <span className="text-xs text-zinc-500 truncate">{ev.event_type.replace(/_/g, " ")}</span>
          <span className="ml-auto text-xs opacity-40 group-hover:opacity-80">↗</span>
        </div>
      </div>
    </a>
  );
}
