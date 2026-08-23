import { notFound } from "next/navigation";
import { PROVIDERS } from "@/lib/providers";
import { SEED_EVENTS, SEED_MODELS } from "@/lib/seed-data";
import EventCard from "@/components/EventCard";
import { ProviderSlug } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(PROVIDERS).map((slug) => ({ slug }));
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug) as ProviderSlug;
  const provider = PROVIDERS[slug];
  if (!provider) notFound();
  const models = SEED_MODELS.filter((m) => m.provider === slug).sort((a, b) => +new Date(b.release_date) - +new Date(a.release_date));
  const events = SEED_EVENTS.filter((e) => e.provider === slug).sort((a, b) => +new Date(b.detected_at) - +new Date(a.detected_at));

  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center gap-4">
        <span className="h-12 w-12 inline-flex items-center justify-center text-white mono text-sm font-bold" style={{ background: provider.color }}>
          {provider.name[0]}
        </span>
        <div>
          <div className="mono text-[10px] tracking-[0.18em] uppercase opacity-50">{slug} • provider</div>
          <h1 className="display text-3xl leading-none">{provider.name}</h1>
          <a href={provider.homepage} target="_blank" className="mono text-xs opacity-60 hover:opacity-100 underline">
            {provider.homepage} ↗
          </a>
        </div>
        <span className="ml-auto mono text-xs border border-[var(--line-strong)] bg-white px-3 py-2">{models.length} models • {events.length} breaks</span>
      </div>

      <div className="mt-8 border border-[var(--line-strong)] bg-white overflow-hidden">
        <div className="flex items-baseline justify-between px-4 py-3 border-b bg-[var(--paper-2)] mono text-[10px] tracking-widest uppercase">
          <span>Models</span>
          <span className="opacity-60">sorted newest first • source-linked</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="mono text-[10px] tracking-widest uppercase bg-[var(--ink)] text-[var(--paper)]">
              <tr>
                <th className="text-left px-4 py-2">Model</th>
                <th className="text-left">Family</th>
                <th className="text-left">Released</th>
                <th className="text-right">Context</th>
                <th className="text-right px-4">Price in/out</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody className="mono text-xs">
              {models.map((m) => (
                <tr key={m.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper-2)]">
                  <td className="px-4 py-2 font-medium">
                    <a href={m.source_url} target="_blank" className="hover:underline">
                      {m.name}
                    </a>
                  </td>
                  <td>{m.family ?? "—"}</td>
                  <td>{new Date(m.release_date).toLocaleDateString("en-GB")}</td>
                  <td className="text-right">{m.context_window ? `${(m.context_window / 1000).toFixed(0)}K` : "—"}</td>
                  <td className="text-right px-4">{m.pricing_input !== undefined ? `$${m.pricing_input}/$${m.pricing_output}` : "—"}</td>
                  <td className="text-center">
                    <span className={`mono text-[10px] tracking-widest uppercase px-2 py-1 ${m.status === "deprecated" ? "bg-red-600 text-white" : m.status === "preview" ? "bg-amber-500 text-white" : "bg-white border"}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {models.length === 0 && <div className="p-4 mono text-sm opacity-60">No models seeded yet — fetcher will populate.</div>}
      </div>

      <h2 className="display text-xl mt-8">Breaks — {events.length}</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <EventCard key={ev.id} ev={ev} />
        ))}
      </div>
      {events.length === 0 && <div className="mono text-sm opacity-60">No breaks yet for {provider.name}.</div>}
    </div>
  );
}
