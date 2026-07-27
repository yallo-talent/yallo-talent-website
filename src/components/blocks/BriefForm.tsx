"use client";

import { useState } from "react";
import { type BriefFormValues, briefFormSchema } from "@/lib/schemas";
import styles from "./BriefForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

const engagementOptions: {
  value: BriefFormValues["engagement"];
  label: string;
}[] = [
  { value: "contract", label: "Contract" },
  { value: "permanent", label: "Permanent" },
  { value: "eor", label: "EOR" },
  { value: "managed-delivery", label: "Managed Delivery" },
];

const regionOptions: { value: BriefFormValues["region"]; label: string }[] = [
  { value: "uk", label: "United Kingdom" },
  { value: "me", label: "Middle East" },
  { value: "india", label: "India" },
  { value: "multi", label: "Multi-region" },
];

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
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BriefFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BriefFormValues | undefined;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(
          body.error ?? "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
      setMessage("Thanks — we'll be in touch within one working day.");
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
            the architect-led screen. Shortlists back within 72 hours.
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
                <span className={styles.error}>{errors.region}</span>
              )}
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="engagement" className={styles.label}>
              Engagement type <span className={styles.req}>*</span>
            </label>
            <div className={styles.chipRow}>
              {engagementOptions.map((o) => (
                <label key={o.value} className={styles.chip}>
                  <input
                    type="radio"
                    name="engagement"
                    value={o.value}
                    required
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
            {errors.engagement && (
              <span className={styles.error}>{errors.engagement}</span>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              A little context <span className={styles.req}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className={styles.textarea}
              placeholder="Programme, timelines, must-haves — a few sentences is enough."
              required
            />
            {errors.message && (
              <span className={styles.error}>{errors.message}</span>
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
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
