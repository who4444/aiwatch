import SubscribeForm from "@/components/SubscribeForm";
import EventCard from "@/components/EventCard";
import PricingFakeDoor from "@/components/PricingFakeDoor";
import { SEED_EVENTS } from "@/lib/seed-data";

export default function Home() {
  const featured = SEED_EVENTS.find((e) => e.severity === "high")!;
  const latest = SEED_EVENTS.slice(0, 3);

  return (
    <div className="pb-12">
      {/* Hero — spacious, single focus */}
      <section className="mx-auto max-w-[760px] px-4 sm:px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 border border-[var(--line-strong)] bg-white px-3 py-1 text-[11px] tracking-wide uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live • 11 labs • checked every 4h
        </div>

        <h1 className="text-[42px] sm:text-[52px] leading-[0.95] font-bold tracking-tight mt-6">
          Never wake to
          <br />
          <span className="bg-[var(--ink)] text-white px-2">model_not_found</span>
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-zinc-600 max-w-xl mx-auto">
          Breaking-change alerts for frontier models — sunsets, alias retirements and price cliffs in &lt;1h, with source and fix.
        </p>

        <div className="mt-8 max-w-sm mx-auto">
          <SubscribeForm />
        </div>

        <div className="mt-4 text-xs tracking-wide uppercase opacity-40">Free digest • No spam • Unsubscribe anytime</div>
      </section>

      {/* Single featured break — replaces 3-card hazard grid */}
      <section className="mx-auto max-w-[760px] px-4 sm:px-6">
        <a href={featured.source_url} target="_blank" className="flex gap-4 border border-[var(--ink)] bg-white p-4 hover:border-black transition">
          <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--hazard)] text-white text-xs font-bold">!</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] tracking-wide uppercase opacity-60">Featured high-severity • eff {featured.effective_date ?? "now"}</div>
            <div className="font-medium leading-tight mt-1">{featured.title}</div>
            <div className="text-sm text-zinc-600 mt-1 line-clamp-2">{featured.why_it_matters} — {featured.fix}</div>
          </div>
          <span className="hidden sm:block text-xs opacity-40 self-center">↗</span>
        </a>
        <div className="mt-3 text-center">
          <a href="/timeline?severity=high" className="text-xs tracking-wide uppercase underline opacity-60 hover:opacity-100">
            View all high-severity →
          </a>
        </div>
      </section>

      {/* Latest — only 3, generous whitespace */}
      <section className="mx-auto max-w-[760px] px-4 sm:px-6 pt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Latest tape</h2>
          <a href="/timeline" className="text-xs tracking-wide uppercase underline opacity-60 hover:opacity-100">
            View all →
          </a>
        </div>
        <div className="mt-6 space-y-4">
          {latest.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </section>

      {/* How it works — 3 steps, air, no code block */}
      <section className="mx-auto max-w-[760px] px-4 sm:px-6 pt-14">
        <h2 className="text-lg font-bold text-center">How it works</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="mx-auto h-8 w-8 flex items-center justify-center border border-[var(--ink)] text-xs font-bold">01</div>
            <div className="text-sm font-medium mt-3">Watch official pages</div>
            <div className="text-sm text-zinc-600 mt-1">We check 16 official pages every 4h</div>
          </div>
          <div>
            <div className="mx-auto h-8 w-8 flex items-center justify-center border border-[var(--ink)] text-xs font-bold">02</div>
            <div className="text-sm font-medium mt-3">Only when it changed</div>
            <div className="text-sm text-zinc-600 mt-1">No change → no alert. Zero noise.</div>
          </div>
          <div>
            <div className="mx-auto h-8 w-8 flex items-center justify-center bg-[var(--ink)] text-white text-xs font-bold">03</div>
            <div className="text-sm font-medium mt-3">Alert you right away</div>
            <div className="text-sm text-zinc-600 mt-1">Pro gets it within an hour on Discord / Telegram</div>
          </div>
        </div>
      </section>

      {/* Pricing — 2 cards only, calm */}
      <section id="pricing" className="mx-auto max-w-[760px] px-4 sm:px-6 pt-14">
        <h2 className="text-lg font-bold text-center">Simple pricing</h2>
        <p className="text-sm text-zinc-600 text-center mt-1">Free digest is real. Pro logs intent — you’ll be emailed at launch.</p>
        <PricingFakeDoor />
      </section>
    </div>
  );
}
