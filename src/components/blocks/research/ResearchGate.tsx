"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./Research.module.css";

/**
 * The lead-capture form for the gated synthesis.
 *
 * Three fields. It is not a brief and must not grow into one: a lead magnet
 * whose form asks what a brief asks is a brief with a worse conversion rate,
 * and the page routes anyone with a live requirement to /brief instead.
 *
 * On success the download link replaces the form and receives focus, so a
 * keyboard or screen-reader user is taken to the thing they asked for rather
 * than left at the top of a form that has silently disappeared.
 */
export function ResearchGate({ asset }: { asset: string }) {
  const nameId = useId();
  const companyId = useId();
  const emailId = useId();
  const statusId = useId();

  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [href, setHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          company: String(form.get("company") ?? ""),
          email: String(form.get("email") ?? ""),
          asset,
        }),
      });
      const body = (await res.json()) as {
        ok: boolean;
        href?: string;
        error?: string;
      };
      if (!res.ok || !body.ok || !body.href) {
        setError(body.error ?? "That did not send. Please try again.");
        setState("error");
        return;
      }
      setHref(body.href);
      setState("done");
    } catch {
      setError("That did not send. Please check your connection and retry.");
      setState("error");
    }
  }

  if (state === "done" && href) {
    return (
      <div className={styles.gate}>
        <p className={styles.gateStatus}>
          Thank you. The full synthesis is ready.
        </p>
        {/* The payoff of the whole surface, and it was wearing `gateStatus` —
            the class for the little grey sentence under the form. It rendered
            as body text with nothing to say it could be clicked. `gateDownload`
            is the design system's link control: underline plus accent, a real
            focus ring, and enough padding to clear the 24px target floor.

            Still a plain anchor rather than the Button component: this points
            at a static file and wants the browser's download behaviour, not a
            client-side navigation. */}
        {/* biome-ignore lint/a11y/noAutofocus: the form this replaced has just
            been removed from the page, so focus would otherwise fall to the
            document body and a screen-reader user would not be told that the
            thing they asked for had arrived. */}
        <a autoFocus className={styles.gateDownload} href={href} download>
          Download the cross-market synthesis (PDF)
        </a>
        <p className={styles.gateNote}>
          It is a normal link. Forward it to whoever needs it; they will not be
          asked for anything.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.gate} onSubmit={onSubmit} noValidate>
      <label className={styles.gateField} htmlFor={nameId}>
        <span className={styles.gateLabel}>Name</span>
        <input
          className={styles.gateInput}
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </label>
      <label className={styles.gateField} htmlFor={companyId}>
        <span className={styles.gateLabel}>Company</span>
        <input
          className={styles.gateInput}
          id={companyId}
          name="company"
          type="text"
          autoComplete="organization"
          required
        />
      </label>
      <label className={styles.gateField} htmlFor={emailId}>
        <span className={styles.gateLabel}>Work email</span>
        <input
          className={styles.gateInput}
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      {/* The ratified button treatment, via the component that carries it.
          This read as plain body text because it asked for `btn btn-primary`
          and NEITHER CLASS EXISTS anywhere in the repository — the site's
          buttons are the Button component's own module classes, so the markup
          was styling itself with two names that resolve to nothing and the
          browser's default control was all that showed. */}
      <Button variant="primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Get the synthesis"}
      </Button>
      <p
        className={`${styles.gateStatus} ${state === "error" ? styles.gateError : ""}`}
        id={statusId}
        role="status"
      >
        {state === "error" && error
          ? error
          : "We will send nothing else unless you ask us to."}
      </p>
    </form>
  );
}
