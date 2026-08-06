import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SYNTHESIS_PDF_PATH } from "@/data/research/synthesis";
import { recordDelivery, recordSubmission } from "@/lib/db/submissions";
import { resendFrom, resendTo } from "@/lib/mail-config";
import { researchGateSchema } from "@/lib/schemas";

/**
 * The research gate — the capture table's third consumer.
 *
 * Same discipline as /api/brief and deliberately so: persist first, route
 * second, so the row exists before any downstream is attempted and a mail
 * failure degrades to captured-but-undelivered rather than a lost lead.
 *
 * WHAT THIS DOES NOT DO. It does not mint a token, sign a URL or otherwise
 * gate access to the file. The PDF is served from a static path because a
 * programme director forwarding it to procurement is the whole mechanism, and
 * a forwarded link that demands an email address from the second reader
 * defeats it. The gate captures the people who arrive through the site; it is
 * lead capture and is described that way everywhere, including on the page.
 */
const RESEND_FROM = resendFrom("Yallo Talent <brief@yallo.co>");
const RESEND_TO = resendTo();

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

  const parsed = researchGateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const v = parsed.data;

  let submissionId: string;
  try {
    submissionId = await recordSubmission({
      endpoint: "research",
      payload: v,
      originSource: v.asset,
      referrer: request.headers.get("referer"),
    });
  } catch (err) {
    console.error("[research] capture failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not record your request. Please try again." },
      { status: 502 },
    );
  }

  const subject = `Research download · ${v.company} · ${v.asset}`;
  const html = `
    <h2>Research asset requested</h2>
    <ul>
      <li><b>Name:</b> ${escapeHtml(v.name)}</li>
      <li><b>Company:</b> ${escapeHtml(v.company)}</li>
      <li><b>Email:</b> ${escapeHtml(v.email)}</li>
      <li><b>Asset:</b> ${escapeHtml(v.asset)}</li>
    </ul>
  `;

  /* The download is returned regardless of whether the notification email
     sends. The reader has done their half of the exchange; withholding the
     file because our mail provider is down would be punishing them for our
     outage. The row is already durable either way. */
  if (!apiKey) {
    console.warn(
      "[research] RESEND_API_KEY not set — persisted, not delivered:",
      subject,
    );
    await recordDelivery(submissionId, "email", {
      delivered: false,
      error: "RESEND_API_KEY not set",
    });
    return NextResponse.json({ ok: true, href: SYNTHESIS_PDF_PATH });
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
    await recordDelivery(submissionId, "email", {
      delivered: !error,
      ...(error ? { error: error.message } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delivery failed.";
    await recordDelivery(submissionId, "email", {
      delivered: false,
      error: message,
    });
  }

  return NextResponse.json({ ok: true, href: SYNTHESIS_PDF_PATH });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
