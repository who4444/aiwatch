import { NextRequest, NextResponse } from "next/server";
import { SOURCES } from "@/lib/providers";
import { fetchSource, diffToEvent } from "@/lib/fetcher";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendDiscord, sendDigestEmail, sendEmailViaResend, sendTelegram } from "@/lib/notify";
import { ModelEvent } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // allow in dev without secret
  return req.headers.get("authorization") === `Bearer ${secret}` || req.nextUrl.searchParams.get("secret") === secret;
}

// Edge case: Vercel cron (daily 09:00) + GitHub Actions (every 4h) both hit this route.
// Per-event sends dedupe via deliveries table. Digest only fires when UTC hour === 9,
// which no GH Actions schedule slot collides with (0,4,8,12,16,20).
async function alreadySent(eventId: string, subscriberId: string): Promise<boolean> {
  const { data } = await supabase.from("deliveries").select("id").eq("event_id", eventId).eq("subscriber_id", subscriberId).limit(1);
  return Boolean(data && data.length > 0);
}

async function markSent(eventId: string, subscriberId: string, channel: string) {
  await supabase.from("deliveries").insert({ event_id: eventId, subscriber_id: subscriberId, channel, status: "sent", sent_at: new Date().toISOString() });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const results: unknown[] = [];
  let lastHashes: Record<string, { hash: string; body: string }> = {};
  if (isSupabaseConfigured) {
    const { data } = await supabase.from("snapshots").select("source_id, hash, body").order("fetched_at", { ascending: false }).limit(64);
    if (data) {
      for (const r of data as { source_id: string; hash: string; body: string }[]) {
        if (!lastHashes[r.source_id]) lastHashes[r.source_id] = { hash: r.hash, body: r.body };
      }
    }
  }

  const newEvents: ModelEvent[] = [];

  for (const source of SOURCES.slice(0, 16)) {
    const fetched = await fetchSource(source);
    if (!fetched.ok) {
      results.push({ source: source.id, error: `fetch ${fetched.status}` });
      continue;
    }
    const prev = lastHashes[source.id] ?? null;
    const ev = diffToEvent({
      source,
      beforeHash: prev?.hash ?? null,
      afterHash: fetched.hash,
      beforeBody: prev?.body ?? null,
      afterBody: fetched.body,
    });

    if (isSupabaseConfigured) {
      await supabase.from("snapshots").insert({ source_id: source.id, url: source.url, hash: fetched.hash, body: fetched.body.slice(0, 20000) });
      await supabase.from("sources").upsert({ id: source.id, provider: source.provider, label: source.label, url: source.url, kind: source.kind, check_interval_hours: source.check_interval_hours, last_checked_at: new Date().toISOString(), last_hash: fetched.hash }, { onConflict: "id" });
    }

    if (ev) {
      newEvents.push(ev);
      if (isSupabaseConfigured) {
        await supabase.from("model_events").upsert(
          {
            id: ev.id,
            provider: ev.provider,
            model_name: ev.model_name,
            event_type: ev.event_type,
            severity: ev.severity,
            title: ev.title,
            before: ev.before ?? null,
            after: ev.after ?? null,
            source_url: ev.source_url,
            detected_at: ev.detected_at,
            effective_date: ev.effective_date ?? null,
            why_it_matters: ev.why_it_matters,
            fix: ev.fix,
          },
          { onConflict: "id" }
        );
        // instant fanout — high-severity only; medium/low go in the daily digest
        if (ev.severity === "high") {
          const { data: subs } = await supabase.from("subscribers").select("*").limit(1000);
          if (subs) {
            for (const s of subs as { id: string; email: string; providers: string[]; severities: string[]; channel: string; webhook_url: string | null }[]) {
              if (!s.severities.includes(ev.severity)) continue;
              if (s.providers.length > 0 && !s.providers.includes(ev.provider)) continue;
              try {
                if (await alreadySent(ev.id, s.id)) continue; // dedupe double-trigger
                let sent = false;
                if (s.channel === "email") sent = await sendEmailViaResend(s.email, ev);
                else if (s.channel === "discord" && s.webhook_url) sent = await sendDiscord(s.webhook_url, ev);
                else if (s.channel === "telegram" && s.webhook_url) {
                  const [token, chatId] = s.webhook_url.split(":");
                  if (token && chatId) sent = await sendTelegram(token, chatId, ev);
                }
                if (sent) await markSent(ev.id, s.id, s.channel);
              } catch {}
            }
          }
        }
      }
      results.push({ source: source.id, event: ev.title, severity: ev.severity });
    } else {
      results.push({ source: source.id, hash: fetched.hash, changed: false });
    }
  }

  // Daily digest at 09:00 UTC — everything from the last 24h that wasn't sent instantly
  let digestSent = 0;
  if (isSupabaseConfigured && new Date().getUTCHours() === 9) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data: recent } = await supabase.from("model_events").select("*").gte("detected_at", since).order("detected_at", { ascending: false }).limit(50);
    if (recent && recent.length > 0) {
      const digestEvents = recent as unknown as ModelEvent[];
      const { data: subs } = await supabase.from("subscribers").select("*").eq("channel", "email").limit(1000);
      for (const s of (subs ?? []) as { id: string; email: string }[]) {
        try {
          const marker = `digest-${new Date().toISOString().slice(0, 10)}`;
          if (await alreadySent(marker, s.id)) continue;
          if (await sendDigestEmail(s.email, digestEvents)) {
            await markSent(marker, s.id, "email");
            digestSent++;
          }
        } catch {}
      }
    }
  }

  return NextResponse.json({ ok: true, checked: SOURCES.length, newEvents: newEvents.length, digestSent, results, mock: !isSupabaseConfigured });
}
