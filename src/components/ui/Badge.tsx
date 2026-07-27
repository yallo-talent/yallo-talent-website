import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type Tone = "accent" | "neutral" | "success";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

const toneClass: Record<Tone, string> = {
  accent: styles.accent,
  neutral: styles.neutral,
  success: styles.success,
};

export function Badge({ tone = "accent", children }: BadgeProps) {
  return (
    <span className={`${styles.base} ${toneClass[tone]}`}>{children}</span>
  );
}
