interface Props {
  className?: string;
  size?: number;
}

/** Four-petal Yallo mark. Uses `currentColor` so it inherits from the parent. */
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
      <title>Yallo</title>
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
