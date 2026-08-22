import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const Schema = z.object({
  email: z.string().email(),
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
  const severities = ["high", "medium"]; // free default; pro includes all via webhook filters later

  if (!isSupabaseConfigured) {
    console.log("[mock subscribe]", { email, providers, channel });
    return NextResponse.json({ ok: true, mock: true });
  }

  const { error } = await supabase.from("subscribers").upsert(
    { email: email.toLowerCase(), providers, severities, channel, webhook_url: webhook_url ?? null, referrer: req.headers.get("referer") },
    { onConflict: "email,channel" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
