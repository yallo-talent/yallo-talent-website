import { NextResponse } from "next/server";
import { Resend } from "resend";
import { briefFormSchema } from "@/lib/schemas";

const RESEND_FROM =
  process.env.RESEND_FROM ?? "Yallo Talent <brief@talent.yallo.co>";
const RESEND_TO = process.env.RESEND_TO ?? "hello@yallo.co";

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

  if (!apiKey) {
    console.warn(
      "[brief] RESEND_API_KEY not set — validated payload only:",
      subject,
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: [RESEND_TO],
      replyTo: v.email,
      subject,
      html,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message ?? "Delivery failed." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delivery failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
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
