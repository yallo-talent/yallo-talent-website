import type { L1IconKey } from "@/data/l1/types";

interface IconProps {
  className?: string;
}

const wrap = (children: React.ReactNode, title: string, className?: string) => (
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
    <title>{title}</title>
    {children}
  </svg>
);

export const l1Icons: Record<L1IconKey, (p: IconProps) => React.ReactElement> =
  {
    cx: (p) =>
      wrap(
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
          <path d="M18 3v3M16.5 4.5h3" />
        </>,
        "Customer experience",
        p.className,
      ),
    store: (p) =>
      wrap(
        <>
          <path d="M3 9l1-4h16l1 4" />
          <path d="M4 9v11h16V9" />
          <path d="M9 20v-6h6v6" />
          <path d="M3 9a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0" />
        </>,
        "Store",
        p.className,
      ),
    merch: (p) =>
      wrap(
        <>
          <path d="M20 12l-8 8a2 2 0 01-2.83 0L2 12.83V4a2 2 0 012-2h8.83L20 9.17a2 2 0 010 2.83z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </>,
        "Merchandising",
        p.className,
      ),
    assortment: (p) =>
      wrap(
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>,
        "Assortment",
        p.className,
      ),
    pricing: (p) =>
      wrap(
        <>
          <path d="M19 5L5 19" />
          <circle cx="7.5" cy="7.5" r="2.5" />
          <circle cx="16.5" cy="16.5" r="2.5" />
        </>,
        "Pricing",
        p.className,
      ),
    loyalty: (p) =>
      wrap(
        <>
          <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" />
        </>,
        "Loyalty",
        p.className,
      ),
    omnichannel: (p) =>
      wrap(
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </>,
        "Omnichannel",
        p.className,
      ),
    ecommerce: (p) =>
      wrap(
        <>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.5 12h12l2-8H6" />
        </>,
        "E-commerce",
        p.className,
      ),
    pos: (p) =>
      wrap(
        <>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M2 20h20M7 8h10M7 12h6" />
        </>,
        "Point of sale",
        p.className,
      ),
    oms: (p) =>
      wrap(
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 9l2 2 4-4M7 15l2 2 4-4M16 10h2M16 16h2" />
        </>,
        "Order management",
        p.className,
      ),
    wms: (p) =>
      wrap(
        <>
          <path d="M3 8l9-5 9 5v13H3V8z" />
          <path d="M9 21v-8h6v8" />
          <path d="M3 12h18" />
        </>,
        "Warehouse management",
        p.className,
      ),
    tms: (p) =>
      wrap(
        <>
          <rect x="1" y="7" width="12" height="9" rx="1" />
          <path d="M13 10h5l3 4v2h-8" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </>,
        "Transport management",
        p.className,
      ),
    supply: (p) =>
      wrap(
        <>
          <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
          <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
        </>,
        "Supply chain",
        p.className,
      ),
    demand: (p) =>
      wrap(
        <>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </>,
        "Demand planning",
        p.className,
      ),
    inventory: (p) =>
      wrap(
        <>
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
          <path d="M11 7h2M11 17h2M7 11v2M17 11v2" />
        </>,
        "Inventory",
        p.className,
      ),
    analytics: (p) =>
      wrap(
        <>
          <path d="M3 3v18h18" />
          <path d="M7 15V9M12 15V6M17 15v-4" />
        </>,
        "Analytics",
        p.className,
      ),
    mdm: (p) =>
      wrap(
        <>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
        </>,
        "Master data",
        p.className,
      ),
    finance: (p) =>
      wrap(
        <>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </>,
        "Finance",
        p.className,
      ),
    workforce: (p) =>
      wrap(
        <>
          <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M21 21v-2a4 4 0 00-3-3.87M17 3.13a4 4 0 010 7.75" />
        </>,
        "Workforce",
        p.className,
      ),
    crm: (p) =>
      wrap(
        <>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" />
        </>,
        "CRM",
        p.className,
      ),
    returns: (p) =>
      wrap(
        <>
          <path d="M3 12a9 9 0 019-9 9 9 0 016.7 3" />
          <path d="M21 3v6h-6" />
          <path d="M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3" />
          <path d="M3 21v-6h6" />
        </>,
        "Returns",
        p.className,
      ),
    clienteling: (p) =>
      wrap(
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a6 6 0 016-6 6 6 0 016 6v2" />
          <path d="M20 8l1.5 1.5L23 8" />
        </>,
        "Clienteling",
        p.className,
      ),
    promotions: (p) =>
      wrap(
        <>
          <path d="M20.6 7.4L12 16l-8.6-8.6a5 5 0 017.1-7L12 3l1.5-1.5a5 5 0 017.1 5.9z" />
        </>,
        "Promotions",
        p.className,
      ),
    space: (p) =>
      wrap(
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 3v18" />
        </>,
        "Space planning",
        p.className,
      ),
    hr: (p) =>
      wrap(
        <>
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          <path d="M4 12h16" />
        </>,
        "HR",
        p.className,
      ),
    scarce: (p) =>
      wrap(
        <>
          <path d="M12 2l1.6 5.2L19 9l-4.2 3.2L16.5 18 12 15l-4.5 3 1.7-5.8L5 9l5.4-1.8z" />
          <path d="M4 4l1.5 1.5M20 4l-1.5 1.5M4 20l1.5-1.5M20 20l-1.5-1.5" />
        </>,
        "Scarce talent",
        p.className,
      ),
    spark: (p) =>
      wrap(
        <>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
          <circle cx="12" cy="12" r="2" />
        </>,
        "Spark",
        p.className,
      ),
    security: (p) =>
      wrap(
        <>
          <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
          <path d="M9 12l2 2 4-4" />
        </>,
        "Security",
        p.className,
      ),
    cloud: (p) =>
      wrap(
        <path d="M18 10a4 4 0 00-8-1 5 5 0 00-1 9.9h9a4 4 0 000-8z" />,
        "Cloud",
        p.className,
      ),
    dataAi: (p) =>
      wrap(
        <>
          <path d="M3 3v18h18" />
          <path d="M7 14l3-3 3 3 5-5" />
          <circle cx="7" cy="14" r="1.5" />
          <circle cx="18" cy="9" r="1.5" />
        </>,
        "Data & AI",
        p.className,
      ),
    integration: (p) =>
      wrap(
        <>
          <circle cx="5" cy="7" r="2" />
          <circle cx="5" cy="17" r="2" />
          <circle cx="19" cy="12" r="2" />
          <path d="M7 7h4a3 3 0 013 3v4a3 3 0 003 3M7 17h4a3 3 0 003-3v-4a3 3 0 013-3" />
        </>,
        "Integration",
        p.className,
      ),
    government: (p) =>
      wrap(
        <path d="M3 21h18M5 21V9l7-4 7 4v12M10 21v-5h4v5" />,
        "Government",
        p.className,
      ),
    eor: (p) =>
      wrap(
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M8 4V2M16 4V2M3 10h18" />
        </>,
        "EOR / policy admin",
        p.className,
      ),
    pillarContract: (p) =>
      wrap(
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </>,
        "Contract",
        p.className,
      ),
    pillarPermanent: (p) =>
      wrap(
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
          <path d="M9 12l2 2 4-4" />
        </>,
        "Permanent",
        p.className,
      ),
    pillarEor: (p) =>
      wrap(
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M8 4V2M16 4V2M3 10h18" />
          <path d="M8 14h3M14 14h3M8 17h3" />
        </>,
        "EOR",
        p.className,
      ),
    pillarManaged: (p) =>
      wrap(
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </>,
        "Managed delivery",
        p.className,
      ),
  };
