export const metadata = { title: "Referral — aiwatch" };

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">
      <div className="mono text-[10px] tracking-[0.18em] uppercase opacity-50">Loop</div>
      <h1 className="display text-3xl">Referral — give 1mo, get 1mo</h1>
      <p className="mono text-xs opacity-60 mt-2">High-volume indie loop — every Pro waitlister gets a share link. When friend hits checkout-intent, both get +1mo at launch.</p>

      <div className="mt-8 border border-[var(--ink)] bg-white overflow-hidden">
        <div className="h-1 hazard" />
        <div className="p-6">
          <div className="mono text-[10px] tracking-widest uppercase opacity-60">Your share link (mock)</div>
          <div className="mt-2 bg-[var(--ink)] text-[var(--paper)] px-3 py-3 mono text-sm break-all">https://aiwatch.dev/?ref=YOUR_EMAIL</div>
          <div className="mt-3 mono text-xs opacity-60 leading-relaxed">
            Referrer captured via <code className="bg-[var(--paper-2)] border px-1">?ref=</code> in SubscribeForm + checkout-intent. Logged to <code className="bg-[var(--paper-2)] border px-1">subscribers.referrer</code> +{" "}
            <code className="bg-[var(--paper-2)] border px-1">checkout_intents.referrer</code>. Query: <code className="bg-[var(--paper-2)] border px-1">select referrer, count(*) from checkout_intents group by referrer</code>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[var(--ink)] text-[var(--paper)] p-4 mono text-xs tracking-widest uppercase">If referral rate &lt;5% after 500 visitors → your loop isn’t viral — double down on X bot retweets instead.</div>
    </div>
  );
}
