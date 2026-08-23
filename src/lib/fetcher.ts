import { createHash } from "crypto";
import { SOURCES } from "./providers";
import { ModelEvent, Source } from "./types";

export function hashBody(body: string): string {
  return createHash("sha256").update(body).digest("hex").slice(0, 16);
}

export async function fetchSource(source: Source): Promise<{ body: string; hash: string; ok: boolean; status: number }> {
  try {
    const res = await fetch(source.url, {
      headers: {
        "User-Agent": "aiwatch/1.0 (+https://aiwatch.io/bot)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(15000),
    });
    const body = await res.text();
    // Truncate to first 50k for diff stability (ignore ads/footer churn via naive normalize)
    const normalized = body
      .replace(/\s+/g, " ")
      .replace(/<!--.*?-->/g, "")
      .slice(0, 50000);
    return { body: normalized, hash: hashBody(normalized), ok: res.ok, status: res.status };
  } catch (e) {
    return { body: String(e), hash: "error", ok: false, status: 0 };
  }
}

export function classifySeverity(title: string, eventType: ModelEvent["event_type"]): ModelEvent["severity"] {
  const t = title.toLowerCase();
  if (eventType === "sunset" || eventType === "deprecation_notice" || eventType === "alias_retirement" || eventType === "breaking_behavior") return "high";
  if (eventType === "price_change" && (t.includes("2x") || t.includes("threshold") || t.includes("increase"))) return "high";
  if (eventType === "new_model") return "medium";
  return "medium";
}

// Field-level diff for known HTML patterns — fallback is hash diff with AI summary placeholder
export function diffToEvent(args: {
  source: Source;
  beforeHash: string | null;
  afterHash: string;
  beforeBody: string | null;
  afterBody: string;
}): ModelEvent | null {
  if (args.beforeHash && args.beforeHash === args.afterHash) return null;
  if (!args.beforeHash) {
    // First snapshot — not an event unless we seed
    return null;
  }
  // Naive breaking-change heuristics on body text
  const body = args.afterBody.toLowerCase();
  let eventType: ModelEvent["event_type"] = "breaking_behavior";
  let title = `${args.source.label} changed`;
  let severity: ModelEvent["severity"] = "medium";

  if (body.includes("deprecated") || body.includes("deprecation")) {
    eventType = "deprecation_notice";
    title = `${args.source.label}: deprecation notice detected`;
    severity = "high";
  } else if (body.includes("sunset") || body.includes("retirement")) {
    eventType = "sunset";
    title = `${args.source.label}: sunset/retirement detected`;
    severity = "high";
  } else if (body.includes("price") && (body.includes("$") || body.includes("per 1m"))) {
    eventType = "price_change";
    title = `${args.source.label}: pricing change detected`;
    severity = "high";
  } else if (body.includes("breaking change") || body.includes("migration")) {
    eventType = "breaking_behavior";
    title = `${args.source.label}: breaking behavior change`;
    severity = "high";
  } else if (body.includes("context") && body.includes("token")) {
    eventType = "context_change";
    title = `${args.source.label}: context window change`;
    severity = "medium";
  }

  return {
    id: `evt-${args.source.id}-${args.afterHash}`,
    provider: args.source.provider,
    model_name: args.source.label,
    event_type: eventType,
    severity,
    title,
    before: args.beforeHash ? { hash: args.beforeHash } : undefined as unknown as Record<string, unknown>,
    after: { hash: args.afterHash } as Record<string, unknown>,
    source_url: args.source.url,
    detected_at: new Date().toISOString(),
    why_it_matters: `We noticed this official page changed. Open the page to check the migration window and dates.`,
    fix: `Open the official page and search for "${eventType.replace("_", " ")}". If you use a generic model name, switch to an exact version.`,
  };
}

export function getSourcesToCheck(all = SOURCES, lastChecked: Record<string, string> = {}): Source[] {
  const now = Date.now();
  return all.filter((s) => {
    const last = lastChecked[s.id] ? new Date(lastChecked[s.id]).getTime() : 0;
    const intervalMs = s.check_interval_hours * 3600 * 1000;
    return now - last >= intervalMs;
  });
}
