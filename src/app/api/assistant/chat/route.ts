import { NextResponse } from "next/server";
import { requestAssistantReply } from "@/lib/assistant/client";
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";
import { assistantChatRequestSchema } from "@/lib/assistant/schema";
import { recordTranscriptTurn } from "@/lib/db/transcripts";

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

    // Append-only snapshot of the conversation so far, including this
    // turn's reply — see docs/design/context-round14-scope.md §2.1. Logged
    // rather than thrown: a persistence failure must never surface as a
    // failed reply to the visitor mid-conversation.
    const replyMessage =
      reply.type === "text"
        ? reply.text
        : `[brief_draft] ${JSON.stringify(reply.draft)}`;
    recordTranscriptTurn(parsed.data.transcriptId, [
      ...parsed.data.messages,
      { role: "assistant", content: replyMessage },
    ]).catch((err) => {
      console.error("[assistant/chat] transcript persistence failed:", err);
    });

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
