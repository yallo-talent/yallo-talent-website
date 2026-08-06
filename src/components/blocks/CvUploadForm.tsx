"use client";

import { useState } from "react";
import { getCampaignParams } from "@/lib/campaign";
import { platformLabels } from "@/lib/platforms";
import { type CvUploadValues, cvUploadSchema } from "@/lib/schemas";
import styles from "./BriefForm.module.css";

/* The one schema key with no same-named DOM field: the schema validates
   `filename` (derived from the chosen file), but the input a screen-reader
   user needs focus sent to is `name="file"`. */
const fieldToDomName: Partial<Record<keyof CvUploadValues, string>> = {
  filename: "file",
};

/* The platform names DERIVE; the two trailing options are authored and stay.
   That split is the point of the rule rather than an exception to it:
   "Programme leadership" and "Data & platform" are not platforms and have no
   index to come from, so a deriver that owned this whole list would have to
   invent them.
   The platform half was hand-written and had lost Informatica, so a candidate
   with Informatica experience could not say so on the form for the one platform
   whose desk Yallo had just stood up. */
const interestOptions: readonly string[] = [
  ...platformLabels(),
  "Programme leadership",
  "Data & platform",
];

type Status = "idle" | "submitting" | "success" | "error";

export function CvUploadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CvUploadValues, string>>
  >({});
  const [message, setMessage] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      linkedin: String(formData.get("linkedin") ?? ""),
      interests: formData.getAll("interests").map((v) => String(v)),
      message: String(formData.get("message") ?? ""),
      filename: (formData.get("file") as File | null)?.name ?? "",
    };

    const parsed = cvUploadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CvUploadValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CvUploadValues | undefined;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      const firstInvalid = Object.keys(fieldErrors)[0] as
        | keyof CvUploadValues
        | undefined;
      if (firstInvalid) {
        const domName = fieldToDomName[firstInvalid] ?? firstInvalid;
        form.querySelector<HTMLElement>(`[name="${domName}"]`)?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");

    try {
      const campaign = getCampaignParams();
      if (campaign) formData.append("campaign", JSON.stringify(campaign));
      const res = await fetch("/api/cv", { method: "POST", body: formData });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Upload failed. Please try again.");
      }
      setStatus("success");
      setMessage(
        "Thanks: your CV has landed. We'll be in touch if there's a fit.",
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
            areas you work in. We'll be in touch when there's a fit.
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
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" role="alert" className={styles.error}>
                  {errors.name}
                </span>
              )}
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
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" role="alert" className={styles.error}>
                  {errors.email}
                </span>
              )}
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
              aria-invalid={Boolean(errors.linkedin)}
              aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
            />
            {errors.linkedin && (
              <span id="linkedin-error" role="alert" className={styles.error}>
                {errors.linkedin}
              </span>
            )}
          </div>

          <fieldset className={styles.field}>
            <legend className={`${styles.label} ${styles.legend}`}>
              Areas you work in <span className={styles.req}>*</span>
            </legend>
            <div className={styles.chipRow}>
              {interestOptions.map((opt) => (
                <label key={opt} className={styles.chip}>
                  <input
                    type="checkbox"
                    name="interests"
                    value={opt}
                    aria-invalid={Boolean(errors.interests)}
                    aria-describedby={
                      errors.interests ? "interests-error" : undefined
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.interests && (
              <span id="interests-error" role="alert" className={styles.error}>
                {errors.interests}
              </span>
            )}
          </fieldset>

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
              aria-invalid={Boolean(errors.filename)}
              aria-describedby={errors.filename ? "file-error" : undefined}
            />
            {errors.filename && (
              <span id="file-error" role="alert" className={styles.error}>
                {errors.filename}
              </span>
            )}
            {!errors.filename && filename && (
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
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <span id="message-error" role="alert" className={styles.error}>
                {errors.message}
              </span>
            )}
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
                role="status"
                aria-live="polite"
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
