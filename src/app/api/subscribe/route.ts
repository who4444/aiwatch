import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/notify";

const Schema = z.object({
  email: z.string().trim().email(),
  providers: z.array(z.string()).default([]),
  plan: z.string().default("free"),
  channel: z.enum(["email", "discord", "telegram"]).default("email"),
  webhook_url: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { email, providers, channel, webhook_url } = parsed.data;
  // Edge case: discord/telegram without webhook would silently never receive — reject early
  if (channel !== "email" && !webhook_url) {
    return NextResponse.json({ error: "webhook_url required for discord/telegram" }, { status: 400 });
  }
  const severities = ["high", "medium"];

  if (!isSupabaseConfigured) {
    console.log("[mock subscribe]", { email, providers, channel });
    return NextResponse.json({ ok: true, mock: true });
  }

  const { error } = await supabase.from("subscribers").upsert(
    { email: email.toLowerCase(), providers, severities, channel, webhook_url: webhook_url ?? null, referrer: req.headers.get("referer") },
    { onConflict: "email,channel" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // fire-and-forget welcome — makes "check your inbox" honest
  try {
    await sendWelcomeEmail(email.toLowerCase());
  } catch {}
  return NextResponse.json({ ok: true });
}

// Unsubscribe — DELETE /api/subscribe?email=you@x.com
export async function DELETE(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }
  if (!isSupabaseConfigured) {
    console.log("[mock unsubscribe]", email);
    return NextResponse.json({ ok: true, mock: true });
  }
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
