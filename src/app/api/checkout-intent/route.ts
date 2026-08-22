import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, plan, price } = await req.json().catch(() => ({}));
  const row = {
    email: email ?? null,
    plan: plan ?? "pro-monthly",
    price: price ?? "$5/mo",
    referrer: req.headers.get("referer"),
    user_agent: req.headers.get("user-agent"),
  };
  if (!isSupabaseConfigured) {
    console.log("[mock checkout-intent]", row);
    return NextResponse.json({ ok: true, mock: true });
  }
  const { error } = await supabase.from("checkout_intents").insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
