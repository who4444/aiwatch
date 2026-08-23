// Single source of truth for the public site URL.
// Set NEXT_PUBLIC_SITE_URL in Vercel once you buy a domain (e.g. https://aiwatch.io).
// Falls back to your live vercel.app deployment so nothing is hardcoded.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://aiwatch-tau.vercel.app");
