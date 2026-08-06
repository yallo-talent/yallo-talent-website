import Anthropic from "@anthropic-ai/sdk";
import { buildAssistantCorpus } from "@/lib/assistant/corpus";
import type { AssistantMessage } from "@/lib/assistant/schema";
import { buildSystemPrompt } from "@/lib/assistant/system-prompt";
import type { BriefFormValues } from "@/lib/schemas";

/* Same class of pattern check-assistant-grounding.mjs already asserts
   citations against (a path token after start/whitespace/an opening
   bracket or quote), kept as its own declaration rather than shared
   across the src/lib <-> scripts/ boundary — the existing check-assistant-*
   gates are plain Node scripts that don't resolve the `@/` path alias, so
   nothing under scripts/ imports src/lib today. */
const CITATION_PATTERN = /(?<=^|[\s("'])\/[a-z][a-z0-9/-]*/g;

/**
 * Turns a bare citation ("see /platforms/sap") into a real markdown link
 * with the page's own title, using the same corpus the model was grounded
 * in: never a second, hand-maintained title list. Only paths the corpus
 * actually recognises get linked; anything else (a citation the model got
 * wrong, or plain text that merely looks like a path) is left as-is rather
 * than linked to a guess.
 */
function linkifyCitations(text: string): string {
  const titleByPath = new Map(
    buildAssistantCorpus().map((doc) => [doc.path, doc.linkLabel ?? doc.title]),
  );
  return text.replace(CITATION_PATTERN, (path) => {
    const title = titleByPath.get(path);
    return title ? `[${title}](${path})` : path;
  });
}

/**
 * One model, Sonnet 5, no router: context-round13-chatbot.md §3, ratified
 * and not reopened. Traffic on an enterprise B2B site is not the binding
 * constraint; the quality of what it says to a CHRO is.
 */
const MODEL = "claude-sonnet-5";
const MAX_OUTPUT_TOKENS = 1024;

/**
 * The brief tool. Mirrors `briefFormSchema` field-for-field so the draft the
 * model proposes is always shaped like the one form both surfaces share
 * (§4.2). The model calls this only when it judges the conversation has
 * reached brief shape: the client then shows the draft back for explicit
 * confirmation before anything is sent (§4.1 item 3), so a tool call is a
 * proposal, never itself a submission.
 */
const SUBMIT_BRIEF_TOOL: Anthropic.Tool = {
  name: "submit_brief",
  description:
    "Call this once, only when the conversation has reached brief shape: you know the role, region, engagement type and enough context, and you have the visitor's name, company and email. Never call this to ask for information: ask in plain text instead, and only call this to propose the brief you have assembled for the visitor to confirm.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The visitor's name." },
      company: { type: "string", description: "The visitor's company." },
      email: { type: "string", description: "The visitor's work email." },
      role: {
        type: "string",
        description: "The role or roles being hired for.",
      },
      platform: {
        type: "string",
        description: "Platform or module, if mentioned (e.g. SAP, Oracle).",
      },
      region: {
        type: "string",
        enum: ["uk", "me", "india", "multi"],
        description: "Delivery region.",
      },
      engagement: {
        type: "string",
        enum: ["contract", "permanent", "eor", "managed-delivery"],
        description: "Engagement type.",
      },
      message: {
        type: "string",
        description: "A couple of sentences of context from the conversation.",
      },
    },
    required: [
      "name",
      "company",
      "email",
      "role",
      "region",
      "engagement",
      "message",
    ],
  },
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set: the assistant cannot reach the model.",
    );
  }
  client ??= new Anthropic({ apiKey });
  return client;
}

export type AssistantReply =
  | { type: "text"; text: string }
  | { type: "brief_draft"; draft: BriefFormValues };

/**
 * Sends one turn. The system prompt (conversation design, forbidden list,
 * corpus) is marked ephemeral-cacheable: a cache hit costs 10% of standard
 * input, so the corpus pays for itself after one repeat read inside the
 * 5-minute TTL, which is the shape of a real conversation's back-and-forth.
 */
export async function requestAssistantReply(
  messages: AssistantMessage[],
): Promise<AssistantReply> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: [
      {
        type: "text",
        text: buildSystemPrompt(),
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [SUBMIT_BRIEF_TOOL],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const toolUse = response.content.find(
    (block) => block.type === "tool_use" && block.name === "submit_brief",
  );
  if (toolUse && toolUse.type === "tool_use") {
    return { type: "brief_draft", draft: toolUse.input as BriefFormValues };
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (textBlock?.type !== "text") {
    throw new Error("The model returned no text content.");
  }
  return { type: "text", text: linkifyCitations(textBlock.text) };
}
