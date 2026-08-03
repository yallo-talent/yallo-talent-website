interface Props {
  className?: string;
  size?: number;
}

/**
 * Four-petal Yallo mark. Uses `currentColor` so it inherits from the parent.
 *
 * NO <title>, which is one of the two causes of a WCAG 2.5.3 failure the Phase 8
 * run found on the header brand link. The mark is `aria-hidden`, so a title
 * inside it was unreachable by assistive technology and bought nothing — but it
 * was still a text node inside the link, so it put a second "Yallo" into the
 * link's textContent. Removing it alone did NOT clear the audit; measured, and
 * the missing space in Lockup was the other half. Both are needed.
 * The link's aria-label is the accessible name. A decorative mark contributes
 * nothing to it.
 */
export function YalloFlower({ className, size = 36 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M19.6,214.3c0-32.4,26.1-58.7,58.3-58.7h58.3v58.7c0,32.4-26.1,58.7-58.3,58.7s-58.3-26.3-58.3-58.7Z"
      />
      <path
        fillRule="evenodd"
        d="M272.5,78.9c0,32.4-26.1,58.7-58.3,58.7h-58.3v-58.7c0-32.4,26.1-58.7,58.3-58.7s58.3,26.3,58.3,58.7Z"
      />
      <path
        fillRule="evenodd"
        d="M19.6,78.9c0,32.4,26.1,58.7,58.3,58.7h58.3v-58.7c0-32.4-26.1-58.7-58.3-58.7s-58.3,26.3-58.3,58.7Z"
      />
      <path
        fillRule="evenodd"
        d="M272.5,214.3c0-32.4-26.1-58.7-58.3-58.7h-58.3v58.7c0,32.4,26.1,58.7,58.3,58.7s58.3-26.3,58.3-58.7Z"
      />
    </svg>
  );
}
