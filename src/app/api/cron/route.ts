import { NextRequest, NextResponse } from "next/server";
import { SOURCES } from "@/lib/providers";
import { fetchSource, diffToEvent, hashBody } from "@/lib/fetcher";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendDiscord, sendEmailViaResend, sendTelegram } from "@/lib/notify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // allow in dev without secret
  return req.headers.get("authorization") === `Bearer ${secret}` || req.nextUrl.searchParams.get("secret") === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const results: unknown[] = [];
  // In no-Supabase mode, just hash-diff against in-memory (demo: run fetches, return preview)
  // In Supabase mode, load last snapshots
  let lastHashes: Record<string, { hash: string; body: string }> = {};
  if (isSupabaseConfigured) {
    const { data } = await supabase.from("snapshots").select("source_id, hash, body").order("fetched_at", { ascending: false }).limit(64);
    if (data) {
      for (const r of data as { source_id: string; hash: string; body: string }[]) {
        if (!lastHashes[r.source_id]) lastHashes[r.source_id] = { hash: r.hash, body: r.body };
      }
    }
  }

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

    // persist snapshot
    if (isSupabaseConfigured) {
      await supabase.from("snapshots").insert({ source_id: source.id, url: source.url, hash: fetched.hash, body: fetched.body.slice(0, 20000) });
      await supabase.from("sources").upsert({ id: source.id, provider: source.provider, label: source.label, url: source.url, kind: source.kind, check_interval_hours: source.check_interval_hours, last_checked_at: new Date().toISOString(), last_hash: fetched.hash }, { onConflict: "id" });
    }

    if (ev) {
      // persist event + fanout (best-effort)
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
        // fanout to subscribers who match severity/provider
        const { data: subs } = await supabase.from("subscribers").select("*").limit(1000);
        if (subs) {
          for (const s of subs as { email: string; providers: string[]; severities: string[]; channel: string; webhook_url: string | null }[]) {
            if (!s.severities.includes(ev.severity)) continue;
            if (s.providers.length > 0 && !s.providers.includes(ev.provider)) continue;
            try {
              if (s.channel === "email") await sendEmailViaResend(s.email, ev);
              else if (s.channel === "discord" && s.webhook_url) await sendDiscord(s.webhook_url, ev);
              else if (s.channel === "telegram" && s.webhook_url) {
                // webhook_url stores "botToken:chatId"
                const [token, chatId] = s.webhook_url.split(":");
                if (token && chatId) await sendTelegram(token, chatId, ev);
              }
            } catch {}
          }
        }
      }
      results.push({ source: source.id, event: ev.title, severity: ev.severity, hash: fetched.hash });
    } else {
      results.push({ source: source.id, hash: fetched.hash, changed: false });
    }
  }

  return NextResponse.json({ ok: true, checked: SOURCES.length, results, mock: !isSupabaseConfigured });
}
