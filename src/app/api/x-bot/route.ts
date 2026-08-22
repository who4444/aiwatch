import { NextRequest, NextResponse } from "next/server";
import { SEED_EVENTS } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  // Stub for X bot: returns next tweet text. Hook to real X API via env X_BEARER later.
  const ev = [...SEED_EVENTS].sort((a, b) => +new Date(b.detected_at) - +new Date(a.detected_at))[0];
  const text = `🚨 ${ev.title}\n\nWhy: ${ev.why_it_matters}\nFix: ${ev.fix}\n\nSource: ${ev.source_url}\n\n#aiwatch #${ev.provider}`;
  if (req.nextUrl.searchParams.get("preview") === "1") {
    return NextResponse.json({ text, length: text.length, event: ev.id });
  }
  const bearer = process.env.X_BEARER_TOKEN;
  if (!bearer) return NextResponse.json({ ok: false, error: "X_BEARER_TOKEN not set", preview: text });
  // TODO: POST to https://api.twitter.com/2/tweets with {text}
  return NextResponse.json({ ok: true, posted: false, text, note: "wire X API when ready" });
}
