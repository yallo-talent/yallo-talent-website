import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { recordDelivery, recordSubmission } from "@/lib/db/submissions";
import { resendFrom, resendTo } from "@/lib/mail-config";
import { cvUploadSchema } from "@/lib/schemas";

const campaignSchema = z.record(z.string(), z.string().max(200)).optional();

/* Same fix as api/brief/route.ts, same reason: Sumeet's direct instruction
   (chat, round 14) — no talent.yallo.co, and only brief@yallo.co and
   hello@yallo.co as default recipients.

   ROUND 17 §2.4: aligned to brief@yallo.co. bench@yallo.co was a third sender
   address — the very thing api/brief's comment says it avoided inventing — and
   an outward-facing address was correctly not treated as an adjacent fix last
   round. Ruled now, so it changes here. RESEND_FROM still overrides it. */
const RESEND_FROM = resendFrom("Yallo Talent <brief@yallo.co>");
const RESEND_TO = resendTo();

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { ok: false, error: "Expected multipart/form-data." },
      { status: 415 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Attach a CV file." },
      { status: 422 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "File exceeds 5 MB limit." },
      { status: 413 },
    );
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Only PDF or Word documents accepted." },
      { status: 415 },
    );
  }

  const payload = {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    linkedin: String(form.get("linkedin") ?? ""),
    interests: form.getAll("interests").map((v) => String(v)),
    message: String(form.get("message") ?? ""),
    filename: file.name,
  };

  const parsed = cvUploadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const v = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  let campaignRaw: unknown;
  try {
    campaignRaw = JSON.parse(String(form.get("campaign") ?? "null"));
  } catch {
    campaignRaw = null;
  }
  const campaign = campaignSchema.safeParse(campaignRaw);

  let submissionId: string;
  try {
    submissionId = await recordSubmission({
      endpoint: "cv",
      payload: v,
      referrer: request.headers.get("referer"),
      campaign: campaign.success ? (campaign.data ?? null) : null,
    });
  } catch (err) {
    console.error("[cv] capture failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not record your submission. Please try again.",
      },
      { status: 502 },
    );
  }

  if (!apiKey) {
    console.warn(
      "[cv] RESEND_API_KEY not set — persisted, not delivered:",
      v.filename,
    );
    await recordDelivery(submissionId, "email", {
      delivered: false,
      error: "RESEND_API_KEY not set",
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: v.email,
      subject: `CV · ${v.name} · ${v.interests.join(" / ")}`,
      html: `
        <h2>New candidate CV</h2>
        <ul>
          <li><b>Name:</b> ${escapeHtml(v.name)}</li>
          <li><b>Email:</b> ${escapeHtml(v.email)}</li>
          <li><b>LinkedIn:</b> ${escapeHtml(v.linkedin || "—")}</li>
          <li><b>Interests:</b> ${escapeHtml(v.interests.join(", "))}</li>
        </ul>
        <p><b>Message:</b></p>
        <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(v.message ?? "")}</pre>
      `,
      attachments: [{ filename: file.name, content: fileBuffer }],
    });
    if (error) {
      await recordDelivery(submissionId, "email", {
        delivered: false,
        error: error.message,
      });
      return NextResponse.json({ ok: true, delivered: false });
    }
    // TODO(phase-4): also push to ATS/vendor system
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
