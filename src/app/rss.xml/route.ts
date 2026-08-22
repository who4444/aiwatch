import { SEED_EVENTS } from "@/lib/seed-data";

export async function GET() {
  const items = [...SEED_EVENTS]
    .sort((a, b) => +new Date(b.detected_at) - +new Date(a.detected_at))
    .slice(0, 20)
    .map(
      (ev) => `
    <item>
      <title><![CDATA[${ev.title}]]></title>
      <link>${ev.source_url}</link>
      <guid>${ev.id}</guid>
      <pubDate>${new Date(ev.detected_at).toUTCString()}</pubDate>
      <description><![CDATA[${ev.why_it_matters} Fix: ${ev.fix}]]></description>
      <category>${ev.provider}/${ev.severity}/${ev.event_type}</category>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>aiwatch — breaking changes</title>
  <link>https://aiwatch.dev/timeline</link>
  <description>Breaking-change monitor for 11 frontier labs. Deprecations, alias retirements, price thresholds.</description>
  ${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
