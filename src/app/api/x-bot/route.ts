import { NextRequest, NextResponse } from "next/server";
import { SEED_EVENTS } from "@/lib/seed-data";

// GET /api/x-bot?preview=1 — public preview of next tweet (safe, no side effects)
// Posting is gated behind CRON_SECRET so nobody can tweet from our account
export async function GET(req: NextRequest) {
  const ev = [...SEED_EVENTS].sort((a, b) => +new Date(b.detected_at) - +new Date(a.detected_at))[0];
  const text = `🚨 ${ev.title}\n\nWhat changed: ${ev.why_it_matters}\nWhat to do: ${ev.fix}\n\n${ev.source_url}\n\n#aiwatch #${ev.provider}`;

  if (req.nextUrl.searchParams.get("preview") === "1" || !process.env.X_BEARER_TOKEN) {
    return NextResponse.json({ preview: true, text, length: text.length, event: ev.id });
  }

  const secret = process.env.CRON_SECRET;
  const authorized = !secret || req.headers.get("authorization") === `Bearer ${secret}` || req.nextUrl.searchParams.get("secret") === secret;
  if (!authorized) return NextResponse.json({ error: "unauthorized — posting requires secret" }, { status: 401 });

  // Wire real posting here when X_BEARER_TOKEN is set:
  // POST https://api.twitter.com/2/tweets {text} with Bearer token
  return NextResponse.json({ ok: true, posted: false, note: "wire X API v2 POST when ready", preview: text });
}
