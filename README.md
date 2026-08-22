# aiwatch — breaking-change monitor for frontier models

**Indie, low-pay high-vol, $5/mo $39/yr.** 11 labs • Email + Discord + Telegram • hash-diff every 4h • instant &lt;1h on high-severity with fix-it notes.

## Stack
Next.js 16 (App Router) + Tailwind 4 + Supabase (Postgres) + Resend + Vercel Cron

## Quick start (mock mode — no Supabase needed)
```bash
npm install
npm run dev # http://localhost:3000 — uses SEED_DATA
curl http://localhost:3000/api/cron # preview fetches (no DB)
curl http://localhost:3000/rss.xml
curl http://localhost:3000/api/x-bot?preview=1
```

## With Supabase (live)
1. Create Supabase project, run `supabase.sql` in SQL editor.
2. Copy `.env.example` to `.env.local`, fill `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY`, `CRON_SECRET`, `RESEND_API_KEY`.
3. `npm run build && vercel --prod` — cron runs `0 */4 * * *` via `vercel.json`.

## Routes
- `/` — landing + pricing fake-door ($5/$39 intent) + breaking strip + models table
- `/timeline?provider=anthropic&severity=high` — filtered timeline
- `/c/[slug]` — per-provider (openai, anthropic, google, meta, xai, deepseek, mistral, qwen, moonshot, zai, cursor)
- `/analytics` — by-provider, by-month, severity
- `/rss.xml` — RSS for free users + X bot source
- `/api/subscribe` — `{email, providers[], channel, webhook_url}` upsert to `subscribers`
- `/api/checkout-intent` — fake checkout intent logger → `checkout_intents` (validation metric)
- `/api/cron` — fetches 16 sources, sha256, diffs, upserts `snapshots`+`model_events`, fans out to subscribers (email/Resend, Discord, Telegram)
- `/api/x-bot?preview=1` — next tweet preview; wire `X_BEARER_TOKEN` to post

## Sources (11 labs, 16 URLs)
See `src/lib/providers.ts` — OpenAI changelog/news, Anthropic news/docs, Google changelog/blog, Meta blog, xAI news/docs, DeepSeek docs, Mistral news/docs, Qwen, Moonshot, Z.ai, Cursor.

## Validation plan (smoke test)
Landing has free subscribe + Pro fake checkout ($5/mo $39/yr) logging to `checkout_intents` with referrer+UA. Target: >12% email @ 500 visitors, >2.5% intent. If <1.5% → stay free + sponsors.

## Low-vol ops
- Hash-diff is cheap: Vercel Cron 6 invocations/day, 16 fetches each, body truncated 50k, no X API $0.005/read.
- Severity: sunset/deprecation/alias/price-threshold/breaking => high => instant; new_model => medium => digest.
- Discord: per-subscriber webhook_url; Telegram: `botToken:chatId` in webhook_url.
