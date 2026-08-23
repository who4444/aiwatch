import { ModelEvent } from "./types";

function humanType(t: string) {
  return t.replace(/_/g, " ");
}

export function formatEventForEmail(ev: ModelEvent): { subject: string; html: string; text: string } {
  const isHigh = ev.severity === "high";
  // plain subject — no emoji, no jargon
  const subject = isHigh ? `Heads up: ${ev.title}` : `Update: ${ev.title}`;
  const preheader = ev.why_it_matters.slice(0, 110);

  // Fixed-font email: JetBrains Mono → Courier fallback (email clients can't load web fonts reliably)
  const fontStack = `'JetBrains Mono', 'Courier New', Courier, monospace`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#F6F5F1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader} — open the official page for the fix.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F6F5F1;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #D6D3CC;border-collapse:collapse;">
        ${isHigh ? `<tr><td style="height:3px;line-height:3px;background:repeating-linear-gradient(-45deg,#FF3E00 0 10px,#111 10px 20px);background-color:#FF3E00;">&nbsp;</td></tr>` : ``}
        <tr><td style="padding:18px 20px 0 20px;">
          <div style="font-family:${fontStack};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8A8E;line-height:16px;">
            aiwatch — breaking-change monitor · checked every 4h
          </div>
          <div style="font-family:${fontStack};font-size:11px;color:#8A8A8E;margin-top:4px;">
            ${ev.provider} · ${humanType(ev.event_type)} · ${new Date(ev.detected_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </td></tr>
        <tr><td style="padding:14px 20px 0 20px;">
          <h1 style="margin:0;font-family:${fontStack};font-size:18px;line-height:24px;font-weight:700;color:#0A0A0B;">
            ${ev.title}
          </h1>
        </td></tr>
        ${
          ev.effective_date
            ? `<tr><td style="padding:12px 20px 0 20px;">
                <div style="display:inline-block;font-family:${fontStack};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#92400E;background:#FFFBEB;border:1px solid #FDE68A;padding:6px 8px;">
                  Changes on ${ev.effective_date} — plan ahead
                </div>
              </td></tr>`
            : ``
        }
        <tr><td style="padding:18px 20px 0 20px;">
          <div style="font-family:${fontStack};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#0A0A0B;border-bottom:1px solid #E7E5E0;padding-bottom:6px;">What changed</div>
          <p style="margin:8px 0 0 0;font-family:${fontStack};font-size:13px;line-height:20px;color:#2A2A2E;">
            ${ev.why_it_matters}
          </p>
        </td></tr>
        <tr><td style="padding:16px 20px 0 20px;">
          <div style="font-family:${fontStack};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#0A0A0B;border-bottom:1px solid #E7E5E0;padding-bottom:6px;">What to do</div>
          <p style="margin:8px 0 0 0;font-family:${fontStack};font-size:13px;line-height:20px;color:#0A0A0B;font-weight:700;">
            ${ev.fix}
          </p>
        </td></tr>
        <tr><td style="padding:20px 20px 0 20px;">
          <a href="${ev.source_url}" style="display:inline-block;font-family:${fontStack};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;background:#0A0A0B;text-decoration:none;padding:11px 16px;">
            Open official page →
          </a>
          <div style="font-family:${fontStack};font-size:11px;color:#8A8A8E;margin-top:8px;word-break:break-all;">
            ${ev.source_url}
          </div>
        </td></tr>
        <tr><td style="padding:22px 20px 20px 20px;border-top:1px dashed #E7E5E0;margin-top:20px;">
          <p style="margin:0;font-family:${fontStack};font-size:11px;line-height:16px;color:#8A8A8E;">
            You're getting this because you asked for <strong style="color:#0A0A0B;">${ev.severity}</strong> alerts for <strong style="color:#0A0A0B;">${ev.provider}</strong>.
            <br>
            <a href="https://aiwatch.dev/timeline?provider=${ev.provider}" style="color:#0A0A0B;text-decoration:underline;">Manage alerts</a> ·
            <a href="https://aiwatch.dev/unsubscribe" style="color:#0A0A0B;text-decoration:underline;">Unsubscribe</a> ·
            <a href="https://aiwatch.dev/timeline" style="color:#0A0A0B;text-decoration:underline;">View timeline</a>
          </p>
          <p style="margin:8px 0 0 0;font-family:${fontStack};font-size:10px;line-height:14px;color:#A1A1AA;">
            We watch the official docs and only write when something actually changed. No spam — at most one email a day.
          </p>
        </td></tr>
      </table>
      <div style="font-family:${fontStack};font-size:10px;color:#A1A1AA;margin-top:12px;letter-spacing:0.08em;text-transform:uppercase;">
        aiwatch · direct from providers · no hype
      </div>
    </td></tr>
  </table>
</body></html>`;

  const text = `${subject}
${humanType(ev.event_type)} · ${ev.provider} · ${new Date(ev.detected_at).toLocaleDateString()}

What changed:
${ev.why_it_matters}

What to do:
${ev.fix}
${ev.effective_date ? `Changes on ${ev.effective_date}` : ""}

Open official page: ${ev.source_url}

— You're getting ${ev.severity} alerts for ${ev.provider}. Manage: https://aiwatch.dev/timeline?provider=${ev.provider}  Unsubscribe: https://aiwatch.dev/unsubscribe
We watch the official docs and only write when something actually changed.`;

  return { subject, html, text };
}

export function formatEventForDiscord(ev: ModelEvent): Record<string, unknown> {
  const color = ev.severity === "high" ? 0xff3e00 : ev.severity === "medium" ? 0xc98a00 : 0x8a8a8e;
  return {
    embeds: [
      {
        title: ev.title,
        url: ev.source_url,
        color,
        fields: [
          { name: "What changed", value: ev.why_it_matters.slice(0, 1024) },
          { name: "What to do", value: ev.fix.slice(0, 1024) },
          ...(ev.effective_date ? [{ name: "Changes on", value: ev.effective_date, inline: true }] : []),
        ],
        timestamp: ev.detected_at,
        footer: { text: "aiwatch — we watch the official docs" },
      },
    ],
  };
}

export function formatEventForTelegram(ev: ModelEvent): string {
  const sev = ev.severity === "high" ? "Heads up" : ev.severity === "medium" ? "Update" : "Note";
  return [
    `${sev} · ${ev.provider} · ${ev.event_type.replace(/_/g, " ")}`,
    `${ev.title}`,
    ``,
    `What changed: ${ev.why_it_matters}`,
    `What to do: ${ev.fix}`,
    ev.effective_date ? `Changes on ${ev.effective_date}` : "",
    `Open: ${ev.source_url}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Daily digest — one email, everything from last 24h. Honest copy, plain words.
export function formatDigestForEmail(events: ModelEvent[]): { subject: string; html: string; text: string } {
  const fontStack = `'JetBrains Mono', 'Courier New', Courier, monospace`;
  const high = events.filter((e) => e.severity === "high");
  const rest = events.filter((e) => e.severity !== "high");
  const subject = events.length === 1 ? `1 change yesterday: ${events[0].title.slice(0, 60)}` : `${events.length} changes in the last 24h`;
  const row = (e: ModelEvent) => `
    <tr><td style="padding:12px 0;border-bottom:1px solid #E7E5E0;">
      <div style="font-family:${fontStack};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8A8A8E;">
        ${e.provider} · ${e.severity}${e.effective_date ? ` · changes on ${e.effective_date}` : ""}
      </div>
      <div style="font-family:${fontStack};font-size:13px;font-weight:700;color:#0A0A0B;margin-top:4px;">${e.title}</div>
      <div style="font-family:${fontStack};font-size:12px;line-height:18px;color:#2A2A2E;margin-top:4px;">${e.fix}</div>
      <a href="${e.source_url}" style="font-family:${fontStack};font-size:11px;color:#0A0A0B;text-decoration:underline;">Open official page →</a>
    </td></tr>`;

  const html = `<html><body style="margin:0;background:#F6F5F1;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;"><tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF;border:1px solid #D6D3CC;">
        <tr><td style="height:3px;background:#FF3E00;line-height:3px;">&nbsp;</td></tr>
        <tr><td style="padding:18px 20px 0;">
          <div style="font-family:${fontStack};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8A8E;">aiwatch · daily digest</div>
          <h1 style="margin:6px 0 0;font-family:${fontStack};font-size:18px;color:#0A0A0B;">${subject}</h1>
        </td></tr>
        ${high.length ? `<tr><td style="padding:16px 20px 0;"><div style="font-family:${fontStack};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#FF3E00;">Breaks</div></td></tr><tr><td style="padding:4px 20px 0;"><table width="100%" cellpadding="0" cellspacing="0">${high.map(row).join("")}</table></td></tr>` : ""}
        ${rest.length ? `<tr><td style="padding:16px 20px 0;"><div style="font-family:${fontStack};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8A8A8E;">Also happened</div></td></tr><tr><td style="padding:4px 20px 0;"><table width="100%" cellpadding="0" cellspacing="0">${rest.map(row).join("")}</table></td></tr>` : ""}
        <tr><td style="padding:20px;border-top:1px dashed #E7E5E0;">
          <p style="margin:0;font-family:${fontStack};font-size:11px;color:#8A8A8E;">
            <a href="https://aiwatch.dev/timeline" style="color:#0A0A0B;">View timeline</a> ·
            <a href="https://aiwatch.dev/unsubscribe" style="color:#0A0A0B;">Unsubscribe</a> — one email a day, max.
          </p>
        </td></tr>
      </table>
    </td></tr></table></body></html>`;

  const text = `${subject}\n\n${events.map((e) => `- [${e.severity}] ${e.title}\n  Fix: ${e.fix}\n  ${e.source_url}`).join("\n\n")}\n\nUnsubscribe: https://aiwatch.dev/unsubscribe`;
  return { subject, html, text };
}

export async function sendDigestEmail(to: string, events: ModelEvent[]): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[mock digest] to=${to} events=${events.length}`);
    return true;
  }
  const { subject, html, text } = formatDigestForEmail(events);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM ?? "aiwatch <alerts@aiwatch.dev>", to, subject, html, text }),
  });
  return res.ok;
}

export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[mock welcome] to=${to}`);
    return true;
  }
  const fontStack = `'JetBrains Mono', 'Courier New', Courier, monospace`;
  const html = `<html><body style="margin:0;background:#F6F5F1;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;"><tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF;border:1px solid #D6D3CC;">
        <tr><td style="height:3px;background:#0A0A0B;line-height:3px;">&nbsp;</td></tr>
        <tr><td style="padding:24px 20px;">
          <div style="font-family:${fontStack};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8A8E;">aiwatch</div>
          <h1 style="margin:6px 0 0;font-family:${fontStack};font-size:18px;color:#0A0A0B;">You're on the list.</h1>
          <p style="font-family:${fontStack};font-size:13px;line-height:20px;color:#2A2A2E;margin-top:12px;">
            We watch the official docs of 11 frontier labs and only write when something actually changed.
            You'll get a daily digest at most — instant alerts (&lt;1h) are part of Pro when it launches.
          </p>
          <p style="font-family:${fontStack};font-size:13px;line-height:20px;color:#2A2A2E;">
            Until then, browse the live timeline:
          </p>
          <a href="https://aiwatch.dev/timeline" style="display:inline-block;font-family:${fontStack};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#FFF;background:#0A0A0B;text-decoration:none;padding:11px 16px;">Open timeline →</a>
          <p style="margin-top:16px;font-family:${fontStack};font-size:10px;color:#A1A1AA;">
            Didn't sign up? <a href="https://aiwatch.dev/unsubscribe" style="color:#0A0A0B;">Remove yourself here</a>.
          </p>
        </td></tr>
      </table>
    </td></tr></table></body></html>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "aiwatch <alerts@aiwatch.dev>",
      to,
      subject: "You're on the list — aiwatch",
      html,
      text: "You're on the list. Daily digest max; instant alerts come with Pro. Timeline: https://aiwatch.dev/timeline Unsubscribe: https://aiwatch.dev/unsubscribe",
    }),
  });
  return res.ok;
}

export async function sendDiscord(webhookUrl: string, ev: ModelEvent): Promise<boolean> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formatEventForDiscord(ev)),
  });
  return res.ok;
}

export async function sendTelegram(botToken: string, chatId: string, ev: ModelEvent): Promise<boolean> {
  const text = formatEventForTelegram(ev);
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: false }),
  });
  return res.ok;
}

export async function sendEmailViaResend(to: string, ev: ModelEvent): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[mock email] to=${to} subject=${ev.title}`);
    return true;
  }
  const { subject, html, text } = formatEventForEmail(ev);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "aiwatch <alerts@aiwatch.dev>",
      to,
      subject,
      html,
      text,
    }),
  });
  return res.ok;
}
