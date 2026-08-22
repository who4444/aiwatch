"use client";

export default function PricingFakeDoor() {
  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-3xl">
      <div className="border border-[var(--line-strong)] bg-white p-6">
        <div className="text-xs tracking-widest uppercase opacity-50">Free</div>
        <div className="text-3xl font-bold mt-1">$0</div>
        <div className="text-xs opacity-60">daily digest • 24h delay</div>
        <ul className="mt-4 space-y-1.5 text-sm">
          <li>— Follow feed + X updates</li>
          <li>— All 11 labs</li>
          <li>— Timeline access</li>
        </ul>
        <a href="#" className="mt-6 block text-center border border-[var(--ink)] py-2.5 text-xs tracking-widest uppercase hover:bg-[var(--ink)] hover:text-white transition">
          Subscribe free
        </a>
      </div>

      <div className="border border-[var(--ink)] bg-[var(--ink)] text-white p-6">
        <div className="inline-flex bg-[var(--hazard)] text-white text-[10px] tracking-widest uppercase px-2 py-1">Pro — most pick</div>
        <div className="text-3xl font-bold mt-3">$5<span className="text-sm font-normal opacity-60">/mo</span> <span className="text-xs opacity-50">or $39/yr</span></div>
        <ul className="mt-4 space-y-1.5 text-sm opacity-90">
          <li>— Instant &lt;1h on high</li>
          <li>— Discord + Telegram</li>
          <li>— Fix-it notes</li>
        </ul>
        <button
          onClick={async () => {
            const email = prompt("Email for Pro waitlist:");
            if (email) {
              await fetch("/api/checkout-intent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, plan: "pro-monthly", price: "$5/mo" }) });
              alert("Tracked — 1mo free at launch.");
            }
          }}
          className="mt-6 w-full bg-white text-[var(--ink)] py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-zinc-100"
        >
          Go Pro — fake checkout
        </button>
        <button
          onClick={async () => {
            const email = prompt("Email for $39/yr:");
            if (email) {
              await fetch("/api/checkout-intent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, plan: "pro-annual", price: "$39/yr" }) });
              alert("Tracked annual — 2mo free.");
            }
          }}
          className="mt-2 w-full border border-white/20 py-2.5 text-xs tracking-widest uppercase hover:bg-white/10"
        >
          $39/yr
        </button>
      </div>
    </div>
  );
}
