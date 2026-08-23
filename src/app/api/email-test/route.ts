import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/notify";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/email-test?to=you@gmail.com&secret=CRON_SECRET
// Sends the real welcome email and returns Resend's raw result — diagnoses
// missing API key / unverified domain / bad FROM without guessing.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get("authorization") === `Bearer ${secret}` || req.nextUrl.searchParams.get("secret") === secret;
  if (secret && !provided) return NextResponse.json({ error: "unauthorized — add ?secret=CRON_SECRET" }, { status: 401 });

  const to = req.nextUrl.searchParams.get("to");
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: "add &to=you@gmail.com" }, { status: 400 });
  }

  const result = await sendWelcomeEmail(to);
  return NextResponse.json({
    to,
    resend_key_set: Boolean(process.env.RESEND_API_KEY),
    from: process.env.RESEND_FROM ?? "aiwatch <onboarding@resend.dev> (default)",
    supabase_configured: isSupabaseConfigured,
    ...result,
    hint: !process.env.RESEND_API_KEY
      ? "Set RESEND_API_KEY in Vercel env, redeploy."
      : result.ok
        ? "Check inbox/spam. If you set RESEND_FROM with your own domain, verify it at resend.com/domains."
        : "Read `error` — 403 usually means RESEND_FROM domain isn't verified in Resend.",
  });
}
