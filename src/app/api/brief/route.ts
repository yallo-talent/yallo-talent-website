import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { recordDelivery, recordSubmission } from "@/lib/db/submissions";
import { briefFormSchema } from "@/lib/schemas";

/* Sumeet, direct instruction (chat, round 14): no talent.yallo.co — yallo.co
   itself becomes Yallo Talent's domain, there is no permanent subdomain.
   The old default here was the one place still asserting the subdomain as
   a real sender address. FROM reuses brief@yallo.co (one of the two
   addresses Sumeet named) rather than inventing an unapproved third one. */
const RESEND_FROM = process.env.RESEND_FROM ?? "Yallo Talent <brief@yallo.co>";

/* Both, not either — Sumeet named exactly these two, and the previous
   default only ever sent to one address (`to: [RESEND_TO]`, a single-
   element array) even though round13-chatbot.md §8 already said both
   aliases should receive it. Comma-separated so a future env override
   can still name more than one recipient without a second code change. */
const RESEND_TO = (process.env.RESEND_TO ?? "brief@yallo.co,hello@yallo.co")
  .split(",")
  .map((addr) => addr.trim())
  .filter(Boolean);

const campaignSchema = z.record(z.string(), z.string().max(200)).optional();

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = briefFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const v = parsed.data;
  const campaign = campaignSchema.safeParse(
    (body as { campaign?: unknown } | null)?.campaign,
  );

  // Persist first, route second: the row exists before any downstream is
  // attempted, so a Resend failure or a missing key degrades to an
  // undelivered-but-captured row rather than a lost brief. See
  // docs/design/context-round13-chatbot.md §2.1.
  let submissionId: string;
  try {
    submissionId = await recordSubmission({
      endpoint: "brief",
      payload: v,
      originSource: v.source,
      transcriptRef: v.transcriptId ?? null,
      referrer: request.headers.get("referer"),
      campaign: campaign.success ? (campaign.data ?? null) : null,
    });
  } catch (err) {
    console.error("[brief] capture failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not record your brief. Please try again." },
      { status: 502 },
    );
  }

  const subject = `Brief · ${v.company} · ${v.role}`;
  const html = `
    <h2>New contractor brief</h2>
    <ul>
      <li><b>Name:</b> ${escapeHtml(v.name)}</li>
      <li><b>Company:</b> ${escapeHtml(v.company)}</li>
      <li><b>Email:</b> ${escapeHtml(v.email)}</li>
      <li><b>Role:</b> ${escapeHtml(v.role)}</li>
      <li><b>Platform:</b> ${escapeHtml(v.platform ?? "—")}</li>
      <li><b>Region:</b> ${escapeHtml(v.region)}</li>
      <li><b>Engagement:</b> ${escapeHtml(v.engagement)}</li>
    </ul>
    <p><b>Message:</b></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(v.message)}</pre>
  `;

  // The row is already durable, so a missing key or a Resend failure is
  // reported as `delivered: false` rather than as an overall failure — the
  // brief is captured and recoverable either way. It is never `ok: true`
  // without having reached recordSubmission above.
  if (!apiKey) {
    console.warn(
      "[brief] RESEND_API_KEY not set — persisted, not delivered:",
      subject,
    );
    await recordDelivery(submissionId, "email", {
      delivered: false,
      error: "RESEND_API_KEY not set",
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: v.email,
      subject,
      html,
    });
    if (error) {
      await recordDelivery(submissionId, "email", {
        delivered: false,
        error: error.message,
      });
      return NextResponse.json({ ok: true, delivered: false });
    }
    await recordDelivery(submissionId, "email", { delivered: true });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delivery failed.";
    await recordDelivery(submissionId, "email", {
      delivered: false,
      error: message,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
