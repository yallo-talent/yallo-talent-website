"use client";

import { useState } from "react";
import { engagementOptions, regionOptions } from "@/lib/briefLabels";
import { getCampaignParams } from "@/lib/campaign";
import { type BriefFormValues, briefFormSchema } from "@/lib/schemas";
import styles from "./BriefForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

/* No no-JS fallback. Confirmed absent, logged twice (round 11) and again
 * here rather than fixed: the site's only conversion surface submits via
 * fetch, and closing this means a classic POST with a server-rendered
 * response or a Server Action — a candidate for a post-cutover round, not
 * this one. round12-scope.md §4.5.
 */
export function BriefForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<
    Partial<Record<keyof BriefFormValues, string>>
  >({});
  const [message, setMessage] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      role: String(data.get("role") ?? ""),
      platform: String(data.get("platform") ?? ""),
      region: String(data.get("region") ?? "") as BriefFormValues["region"],
      engagement: String(
        data.get("engagement") ?? "",
      ) as BriefFormValues["engagement"],
      message: String(data.get("message") ?? ""),
    };

    const parsed = briefFormSchema.safeParse(payload);
    const campaign = getCampaignParams();
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BriefFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BriefFormValues | undefined;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      const firstInvalid = Object.keys(fieldErrors)[0];
      if (firstInvalid) {
        form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, campaign }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(
          body.error ?? "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
      setMessage("Thanks. We'll be in touch within one working day.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="brief" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            Send us a brief
          </div>
          <h2 className={styles.h}>Tell us what you're hiring for.</h2>
          <p className={styles.sub}>
            A short brief is all we need to run the calibration call and start
            the specialist-led screen. Shortlists back within 72 hours.
          </p>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.row}>
            <Field label="Your name" name="name" error={errors.name} required />
            <Field
              label="Company"
              name="company"
              error={errors.company}
              required
            />
          </div>
          <div className={styles.row}>
            <Field
              label="Work email"
              name="email"
              type="email"
              error={errors.email}
              required
            />
            <Field label="Role" name="role" error={errors.role} required />
          </div>
          <div className={styles.row}>
            <Field
              label="Platform (optional)"
              name="platform"
              placeholder="SAP, Oracle, Salesforce…"
              error={errors.platform}
            />
            <div className={styles.field}>
              <label htmlFor="region" className={styles.label}>
                Region <span className={styles.req}>*</span>
              </label>
              <select
                id="region"
                name="region"
                className={styles.select}
                defaultValue=""
                required
                aria-invalid={Boolean(errors.region)}
                aria-describedby={errors.region ? "region-error" : undefined}
              >
                <option value="" disabled>
                  Select region
                </option>
                {regionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.region && (
                <span id="region-error" role="alert" className={styles.error}>
                  {errors.region}
                </span>
              )}
            </div>
          </div>
          <fieldset className={styles.field}>
            <legend className={`${styles.label} ${styles.legend}`}>
              Engagement type <span className={styles.req}>*</span>
            </legend>
            <div className={styles.chipRow}>
              {engagementOptions.map((o) => (
                <label key={o.value} className={styles.chip}>
                  <input
                    type="radio"
                    name="engagement"
                    value={o.value}
                    required
                    aria-invalid={Boolean(errors.engagement)}
                    aria-describedby={
                      errors.engagement ? "engagement-error" : undefined
                    }
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
            {errors.engagement && (
              <span id="engagement-error" role="alert" className={styles.error}>
                {errors.engagement}
              </span>
            )}
          </fieldset>
          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              A little context <span className={styles.req}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={4000}
              className={styles.textarea}
              placeholder="Programme, timelines, must-haves, a few sentences is enough."
              required
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
              {status === "submitting" ? "Sending…" : "Send brief"}
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

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
}: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.req}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={styles.input}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}
