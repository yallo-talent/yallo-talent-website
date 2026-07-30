"use client";

import { useState } from "react";
import styles from "./BriefForm.module.css";

const interestOptions = [
  "SAP",
  "Oracle",
  "Microsoft",
  "Salesforce",
  "Blue Yonder",
  "Workday",
  "Programme leadership",
  "Data & platform",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function CvUploadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/cv", { method: "POST", body: formData });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Upload failed. Please try again.");
      }
      setStatus("success");
      setMessage(
        "Thanks — your CV has landed. We'll be in touch if there's a fit.",
      );
      form.reset();
      setFilename("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  return (
    <section id="cv-upload" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            Join the bench
          </div>
          <h2 className={styles.h}>Send us your CV.</h2>
          <p className={styles.sub}>
            We match specialist-screened contractors to enterprise programmes
            across the Middle East, Europe and India. Send your CV and mark the
            areas you work in — we'll be in touch when there's a fit.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={onSubmit}
          encType="multipart/form-data"
          noValidate
        >
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Your name <span className={styles.req}>*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                className={styles.input}
                type="text"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.req}>*</span>
              </label>
              <input
                id="email"
                name="email"
                required
                type="email"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="linkedin" className={styles.label}>
              LinkedIn (optional)
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/…"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>
              Areas you work in <span className={styles.req}>*</span>
            </span>
            <div className={styles.chipRow}>
              {interestOptions.map((opt) => (
                <label key={opt} className={styles.chip}>
                  <input type="checkbox" name="interests" value={opt} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="file" className={styles.label}>
              CV file (PDF / DOC / DOCX, max 5 MB){" "}
              <span className={styles.req}>*</span>
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.doc,.docx"
              required
              className={styles.input}
              onChange={(e) => setFilename(e.target.files?.[0]?.name ?? "")}
            />
            {filename && (
              <span
                className={styles.error}
                style={{ color: "var(--fg-muted)" }}
              >
                {filename}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              Anything we should know?
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className={styles.textarea}
              placeholder="Recent work, notice period, availability…"
            />
          </div>

          <div className={styles.foot}>
            <button
              type="submit"
              className={styles.submit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Uploading…" : "Send my CV"}
              <span aria-hidden="true">→</span>
            </button>
            {message && (
              <p
                className={`${styles.msg} ${status === "success" ? styles.msgOk : styles.msgErr}`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
