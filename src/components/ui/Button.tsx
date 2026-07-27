import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "ghost" | "outline";

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonAsLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButtonProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

const variantClass: Record<Variant, string> = {
  primary: styles.primary,
  ghost: styles.ghost,
  outline: styles.outline,
};

export function Button(props: ButtonProps) {
  const { variant = "primary", children, className, ...rest } = props;
  const combined =
    `${styles.base} ${variantClass[variant]} ${className ?? ""}`.trim();

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as ButtonAsLinkProps;
    return (
      <Link href={href} className={combined} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={combined}
      {...(rest as ButtonAsButtonProps)}
    >
      {children}
    </button>
  );
}
