interface IconProps {
  className?: string;
}

const wrap = (children: React.ReactNode, className?: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    role="presentation"
  >
    <title>Nav icon</title>
    {children}
  </svg>
);

export const navIcons = {
  contract: (p: IconProps) =>
    wrap(
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10h8M8 14h5M8 18h3" />
      </>,
      p.className,
    ),
  permanent: (p: IconProps) =>
    wrap(
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M17 3.13a4 4 0 0 1 0 7.75" />
      </>,
      p.className,
    ),
  eor: (p: IconProps) =>
    wrap(
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 4V2M16 4V2M3 10h18" />
      </>,
      p.className,
    ),
  managed: (p: IconProps) =>
    wrap(
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>,
      p.className,
    ),
  retail: (p: IconProps) =>
    wrap(
      <>
        <path d="M6 2l-3 6v14a2 2 0 002 2h14a2 2 0 002-2V8l-3-6" />
        <path d="M3 8h18" />
        <path d="M16 12a4 4 0 01-8 0" />
      </>,
      p.className,
    ),
  finance: (p: IconProps) =>
    wrap(
      <>
        <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z" />
        <path d="M12 22v-7M2 8.5l10 7 10-7" />
      </>,
      p.className,
    ),
  manufacturing: (p: IconProps) =>
    wrap(
      <>
        <path d="M2 20h20" />
        <path d="M4 20V8l6 4 6-4v12" />
        <path d="M18 20V4l4 2v14" />
      </>,
      p.className,
    ),
  healthcare: (p: IconProps) =>
    wrap(
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>,
      p.className,
    ),
  government: (p: IconProps) =>
    wrap(
      <>
        <path d="M3 21h18M5 21V9l7-4 7 4v12M10 21v-5h4v5" />
      </>,
      p.className,
    ),
  telco: (p: IconProps) =>
    wrap(
      <>
        <path d="M5 12.5a11 11 0 0114 0M1.5 9a16 16 0 0121 0M8.5 16a6 6 0 017 0M12 20h.01" />
      </>,
      p.className,
    ),
  sap: (p: IconProps) =>
    wrap(
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 8h8v2H8zM8 12h5" />
      </>,
      p.className,
    ),
  oracle: (p: IconProps) =>
    wrap(
      <>
        <ellipse cx="12" cy="12" rx="9" ry="6" />
      </>,
      p.className,
    ),
  microsoft: (p: IconProps) =>
    wrap(
      <>
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="8" />
        <rect x="3" y="13" width="8" height="8" />
        <rect x="13" y="13" width="8" height="8" />
      </>,
      p.className,
    ),
  salesforce: (p: IconProps) =>
    wrap(
      <>
        <path d="M8 15a4 4 0 010-8 5 5 0 019.5-1A4 4 0 0121 12a4 4 0 01-6 4c-1 3-5 3-7 0z" />
      </>,
      p.className,
    ),
  "blue-yonder": (p: IconProps) =>
    wrap(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18" />
      </>,
      p.className,
    ),
  workday: (p: IconProps) =>
    wrap(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M7 12l3 3 7-7" />
      </>,
      p.className,
    ),
  capabilities: (p: IconProps) =>
    wrap(
      <>
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" />
      </>,
      p.className,
    ),
  insights: (p: IconProps) =>
    wrap(
      <>
        <path d="M2 20l4-5 5 3 4-8 7 4" />
      </>,
      p.className,
    ),
  cases: (p: IconProps) =>
    wrap(
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v5M8 14h8" />
      </>,
      p.className,
    ),
  about: (p: IconProps) =>
    wrap(
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </>,
      p.className,
    ),
  why: (p: IconProps) =>
    wrap(
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 10a3 3 0 016 0c0 2-3 2-3 4M12 18h.01" />
      </>,
      p.className,
    ),
  leadership: (p: IconProps) =>
    wrap(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
        <path d="M18 3l1.5 1.5L22 2" />
      </>,
      p.className,
    ),
  dataAi: (p: IconProps) =>
    wrap(
      <>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 3 5-5" />
        <circle cx="7" cy="14" r="1.5" />
        <circle cx="18" cy="9" r="1.5" />
      </>,
      p.className,
    ),
  devops: (p: IconProps) =>
    wrap(
      <>
        <path d="M4 4v6h6" />
        <path d="M20 20v-6h-6" />
        <path d="M4 10a8 8 0 0114-3M20 14a8 8 0 01-14 3" />
      </>,
      p.className,
    ),
  cloud: (p: IconProps) =>
    wrap(
      <>
        <path d="M18 10a4 4 0 00-8-1 5 5 0 00-1 9.9h9a4 4 0 000-8z" />
      </>,
      p.className,
    ),
  security: (p: IconProps) =>
    wrap(
      <>
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </>,
      p.className,
    ),
  integration: (p: IconProps) =>
    wrap(
      <>
        <circle cx="5" cy="7" r="2" />
        <circle cx="5" cy="17" r="2" />
        <circle cx="19" cy="12" r="2" />
        <path d="M7 7h4a3 3 0 013 3v4a3 3 0 003 3M7 17h4a3 3 0 003-3v-4a3 3 0 013-3" />
      </>,
      p.className,
    ),
  emerging: (p: IconProps) =>
    wrap(
      <>
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.2 16.2l2.9 2.9M2 12h4M18 12h4M4.9 19.1l2.8-2.9M16.2 7.7l2.9-2.8" />
        <circle cx="12" cy="12" r="3" />
      </>,
      p.className,
    ),
  uploadCv: (p: IconProps) =>
    wrap(
      <>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <path d="M17 8l-5-5-5 5" />
        <path d="M12 3v12" />
      </>,
      p.className,
    ),
  manageAccount: (p: IconProps) =>
    wrap(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
        <circle cx="19" cy="19" r="2" />
      </>,
      p.className,
    ),
  jobSearch: (p: IconProps) =>
    wrap(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M8 11h6M11 8v6" />
      </>,
      p.className,
    ),
} as const;
