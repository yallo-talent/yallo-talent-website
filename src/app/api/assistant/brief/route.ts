import { NextResponse } from "next/server";
import { submitAssistantBrief } from "@/lib/assistant/capture";
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";
import { assistantBriefPayloadSchema } from "@/lib/assistant/schema";

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

  const parsed = assistantBriefPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const origin = new URL(request.url).origin;
  const result = await submitAssistantBrief(origin, parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
