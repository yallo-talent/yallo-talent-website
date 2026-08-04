"use client";

import { useEffect, useRef, useState } from "react";
import type { AssistantMessage } from "@/lib/assistant/schema";
import type { BriefFormValues } from "@/lib/schemas";
import styles from "./AssistantPanel.module.css";

type Status = "idle" | "sending" | "error";
type BriefStatus = "idle" | "sending" | "sent" | "error";

interface AssistantPanelProps {
  onClose: () => void;
}

interface DisplayMessage extends AssistantMessage {
  id: string;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Keyboard-reachable, focus-trapped, screen-reader-announced. `.glass.glass`
 * is deliberately not used here — this panel is opaque, so it never takes on
 * A3's "worst-case scrolled backdrop" contrast obligation in the first place,
 * and it never composes `--lift`, which DESIGN.md reserves for the hero
 * instrument alone ("if a second element acquires a shadow, the first one
 * stops meaning anything") — a border does the same visual separation job
 * without spending the site's one shadow.
 */
export function AssistantPanel({ onClose }: AssistantPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcriptId = useRef(newId());
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<BriefFormValues | null>(null);
  const [briefStatus, setBriefStatus] = useState<BriefStatus>("idle");
  const [briefMessage, setBriefMessage] = useState<string>("");

  // Focus trap: move focus in on mount, cycle Tab/Shift+Tab within the
  // panel, Escape closes, focus returns to the launcher button on unmount.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    focusable()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusable();
      if (els.length === 0) return;
      const first = els[0] as HTMLElement;
      const last = els[els.length - 1] as HTMLElement;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "sending") return;

    const next: DisplayMessage[] = [
      ...messages,
      { id: newId(), role: "user", content: text },
    ];
    setMessages(next);
    setInput("");
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          transcriptId: transcriptId.current,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Something went wrong.");
      }
      const reply = body.reply as
        | { type: "text"; text: string }
        | { type: "brief_draft"; draft: BriefFormValues };

      if (reply.type === "brief_draft") {
        setDraft(reply.draft);
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content:
              "I've put together a brief from what you've told me. Take a look below and confirm when you're ready.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: reply.text },
        ]);
      }
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function confirmBrief() {
    if (!draft) return;
    setBriefStatus("sending");
    try {
      const res = await fetch("/api/assistant/brief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...draft,
          source: "assistant",
          transcriptId: transcriptId.current,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "The brief could not be sent.");
      }
      setBriefStatus("sent");
      setBriefMessage(
        "Sent — the team will be in touch within one working day.",
      );
    } catch (err) {
      setBriefStatus("error");
      setBriefMessage(
        err instanceof Error ? err.message : "The brief could not be sent.",
      );
    }
  }

  return (
    <div
      ref={panelRef}
      id="assistant-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Yallo Talent assistant"
      className={styles.panel}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Yallo Talent assistant</p>
          <p className={styles.disclosure}>
            This conversation is recorded and kept for 12 months. It answers
            from this site's own published content and serves clients only — see{" "}
            <a href="/privacy">/privacy</a>.
          </p>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close assistant"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <div className={styles.messages} role="log" aria-live="polite">
        {messages.length === 0 && (
          <p className={styles.empty}>
            Ask about a platform, an industry or an engagement model — I'll
            answer from the site and can put together a brief as we go.
          </p>
        )}
        {messages.map((m) => (
          <p
            key={m.id}
            className={m.role === "user" ? styles.userMsg : styles.assistantMsg}
          >
            {m.content}
          </p>
        ))}
        {status === "sending" && (
          <p className={styles.assistantMsg} aria-hidden="true">
            …
          </p>
        )}
      </div>

      <div ref={liveRegionRef} className={styles.srOnly} aria-live="polite">
        {status === "error" && error}
      </div>

      {draft && (
        <div className={styles.draft} aria-live="polite">
          <p className={styles.draftHeading}>Confirm this brief</p>
          <dl className={styles.draftList}>
            <div>
              <dt>Name</dt>
              <dd>{draft.name}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{draft.company}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{draft.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{draft.role}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>{draft.region}</dd>
            </div>
            <div>
              <dt>Engagement</dt>
              <dd>{draft.engagement}</dd>
            </div>
          </dl>
          {briefStatus === "sent" || briefStatus === "error" ? (
            <p
              role="status"
              className={
                briefStatus === "sent" ? styles.draftOk : styles.draftErr
              }
            >
              {briefMessage}
            </p>
          ) : (
            <div className={styles.draftActions}>
              <button
                type="button"
                className={styles.confirmButton}
                disabled={briefStatus === "sending"}
                onClick={confirmBrief}
              >
                {briefStatus === "sending" ? "Sending…" : "Send this brief"}
              </button>
              <button
                type="button"
                className={styles.dismissDraftButton}
                onClick={() => setDraft(null)}
              >
                Not yet
              </button>
            </div>
          )}
        </div>
      )}

      <form className={styles.form} onSubmit={sendMessage}>
        <label htmlFor="assistant-input" className={styles.srOnly}>
          Message
        </label>
        <textarea
          id="assistant-input"
          ref={inputRef}
          className={styles.input}
          rows={2}
          maxLength={4000}
          placeholder="Ask a question or describe what you're hiring for…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={status === "sending" || input.trim().length === 0}
        >
          Send
        </button>
      </form>
    </div>
  );
}
