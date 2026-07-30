import type { RoleIcon } from "@/data/home/roles";
import type { ScreenIcon } from "@/data/home/screen";

/**
 * Drawn line icons for the homepage. Stroke inherits currentColor so a single
 * set works on both grounds and in both themes — no per-theme icon variants.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const rolePaths: Record<RoleIcon, React.ReactNode> = {
  arch: <path d="M3 20h18M6 20V9l6-5 6 5v11M10 20v-6h4v6" />,
  app: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M8 14h8" />
    </>
  ),
  dev: <path d="M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16" />,
  data: <path d="M4 20V10M9.5 20V4M15 20v-8M20.5 20V7" />,
  cloud: (
    <path d="M6 17a4 4 0 010-8 5.5 5.5 0 0110.5-1.5A3.75 3.75 0 0119 17H6z" />
  ),
  test: <path d="M9 3h6M10 3v5l-5 9a3 3 0 002.7 4h8.6a3 3 0 002.7-4l-5-9V3" />,
  biz: <path d="M3 20V6l7-3 7 3v14M7 20v-5h6v5M20 20V10" />,
  prod: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
};

export function RoleGlyph({ name }: { name: RoleIcon }) {
  return (
    <svg {...base} width="24" height="24" aria-hidden="true">
      {rolePaths[name]}
    </svg>
  );
}

const screenPaths: Record<ScreenIcon, React.ReactNode> = {
  brief: (
    <>
      <path d="M9 4h6v3H9zM7 7h10v13H7z" />
      <path d="M10 12h4M10 16h4" />
    </>
  ),
  calibrate: (
    <>
      <path d="M4 8h6M14 8h6M4 16h10M18 16h2" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="16" cy="16" r="2" />
    </>
  ),
  screen: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5L20 20" />
    </>
  ),
  shortlist: (
    <>
      <path d="M5 7h9M5 12h9M5 17h5" />
      <path d="M17 10l2 2 3-3.5" />
    </>
  ),
};

export function ScreenGlyph({ name }: { name: ScreenIcon }) {
  return (
    <svg {...base} width="20" height="20" strokeWidth={1.6} aria-hidden="true">
      {screenPaths[name]}
    </svg>
  );
}

export function ArrowGlyph() {
  return (
    <svg {...base} width="15" height="15" strokeWidth={1.8} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function TickGlyph() {
  return (
    <svg {...base} width="14" height="14" strokeWidth={2} aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}
