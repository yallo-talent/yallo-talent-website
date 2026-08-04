import { NextResponse } from "next/server";
import { requestAssistantReply } from "@/lib/assistant/client";
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";
import { assistantChatRequestSchema } from "@/lib/assistant/schema";

export async function POST(request: Request) {
  if (!ASSISTANT_ENABLED) {
    return NextResponse.json(
      { ok: false, error: "Not available." },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = assistantChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const reply = await requestAssistantReply(parsed.data.messages);
    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error("[assistant/chat] request failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "I could not reach the assistant just now. Please try the brief form instead.",
      },
      { status: 502 },
    );
  }
}
