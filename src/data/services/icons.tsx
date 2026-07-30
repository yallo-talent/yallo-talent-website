const wrap = (children: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    role="presentation"
  >
    <title>Icon</title>
    {children}
  </svg>
);

export const clockIcon = wrap(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>,
);

export const shieldIcon = wrap(
  <>
    <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </>,
);

export const targetIcon = wrap(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </>,
);

export const globeIcon = wrap(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
  </>,
);

export const usersIcon = wrap(
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M21 21v-2a4 4 0 00-3-3.87M17 3.13a4 4 0 010 7.75" />
  </>,
);

export const puzzleIcon = wrap(
  <path d="M14 3h3a2 2 0 012 2v3a2 2 0 002 2h1v3h-1a2 2 0 00-2 2v3a2 2 0 01-2 2h-3v-1a2 2 0 00-2-2 2 2 0 00-2 2v1H5a2 2 0 01-2-2v-3h1a2 2 0 000-4H3V7a2 2 0 012-2h3v1a2 2 0 002 2 2 2 0 002-2V3z" />,
);

export const checkCircleIcon = wrap(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-5" />
  </>,
);

export const boltIcon = wrap(<path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />);

export const layersIcon = wrap(
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
);

export const rocketIcon = wrap(
  <>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </>,
);

export const scaleIcon = wrap(
  <path d="M12 3v18M6 8h12l-3 6h-6L6 8zM4 21h16" />,
);

export const handshakeIcon = wrap(
  <path d="M11 17l-3.5-3.5a3 3 0 010-4.24l1.24-1.24a3 3 0 014.24 0L14 9M11 17l3.5 3.5M13 12l3-3M3 15l4-4M17 8l4-4" />,
);
