"use client";

import Link from "next/link";
import { l1Icons } from "@/components/blocks/l1/l1-icons";
import type { L1Hue, L1IconKey } from "@/data/l1/types";
import { routeExists } from "@/lib/routes";
import styles from "./HubLandingSections.module.css";

function L1Icon({ icon, className }: { icon: L1IconKey; className?: string }) {
  const Comp = l1Icons[icon];
  return <Comp className={className} />;
}

/**
 * One accent, always. Canon retires the six per-sector hues, and this helper
 * previously wrote them as INLINE custom properties — inline wins over any
 * class, so it re-introduced a light gold wash on dark surfaces and defeated
 * .band-dark. It now returns nothing, so --sector-accent* resolves from
 * globals.css. The `hue` fields left in the data are inert.
 */
const cardHueStyle = (): React.CSSProperties => ({});

/* ============ WHAT WE DELIVER ============ */
const whatWeDeliverCards: {
  hue: L1Hue;
  icon: L1IconKey;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
}[] = [
  {
    hue: "orange",
    icon: "scarce",
    eyebrow: "Contract-first bench",
    title: "Specialists in the seat — not sourced in a week.",
    copy: "Every role we place already sits on an assessed bench. Named consultants with delivery track records, screened by the architect leading that practice.",
    bullets: [
      "72h from brief to shortlist",
      "2:1 CV-to-interview ratio",
      "Named consultants — not agency profiles",
    ],
  },
  {
    hue: "blue",
    icon: "workforce",
    eyebrow: "Architect-led screening",
    title: "Screening depth that recruiters can't reproduce.",
    copy: "Every shortlist is depth-tested by architects who have delivered this platform, in this sector, at this scale. Certifications don't cut it — evidence does.",
    bullets: [
      "Practice leads screen every candidate",
      "Sector-specific context tests",
      "Reference-verified track records",
    ],
  },
  {
    hue: "teal",
    icon: "spark",
    eyebrow: "Multi-market flexibility",
    title: "Middle East · Europe · India — contract, EOR, perm or delivery.",
    copy: "Cross-market bench lets us place fast in the region that's constrained. Four commercial models decide who carries the contract, the visa and the notice period.",
    bullets: [
      "Active bench across 3 markets",
      "Contract · EOR · Perm · Managed",
      "IR35, VAT and compliance built in",
    ],
  },
];

export function HubWhatWeDeliver({ label }: { label: string }) {
  return (
    <section className={styles.wwd}>
      <div className={styles.wrap}>
        <div className={styles.wwdHead}>
          <div className={styles.eyebrow}>What we deliver</div>
          <h2 className={styles.h2}>
            Three things every {label.toLowerCase()} programme buys from us —{" "}
            <span className={styles.emphasis}>
              speed, screening depth, and coverage.
            </span>
          </h2>
          <p className={styles.sub}>
            The Yallo Talent bench is engineered around three commitments. Every
            programme we support gets all three — from the first brief.
          </p>
        </div>
        <div className={styles.wwdGrid}>
          {whatWeDeliverCards.map((c, i) => (
            <article
              key={c.title}
              className={styles.wwdCard}
              style={cardHueStyle()}
            >
              <div className={styles.glow} aria-hidden="true" />
              <div className={styles.wwdCardInner}>
                <span className={styles.wwdIcon}>
                  <L1Icon icon={c.icon} className={styles.wwdIconSvg} />
                </span>
                <div className={styles.wwdEyebrow}>{c.eyebrow}</div>
                <h3 className={styles.wwdTitle}>{c.title}</h3>
                <p className={styles.wwdCopy}>{c.copy}</p>
                <ul className={styles.wwdBullets}>
                  {c.bullets.map((b) => (
                    <li key={b} className={styles.wwdBullet}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <span className={styles.wwdBadge} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ HOW WE WORK ============ */
const howWeWorkSteps: {
  n: string;
  title: string;
  copy: string;
  hue: L1Hue;
}[] = [
  {
    n: "01",
    title: "Send us the brief",
    copy: "Role, platform, timeline, engagement model. No CVs on speculation — we start from what your programme actually needs.",
    hue: "orange",
  },
  {
    n: "02",
    title: "Architect-led screening",
    copy: "Specialists who have run your kind of delivery assess every candidate for implementation depth. Not certificates. Not keywords.",
    hue: "blue",
  },
  {
    n: "03",
    title: "Shortlist in 72 hours",
    copy: "Three to five architect-screened candidates in your inbox with rate, notice, engagement model and evidence attached.",
    hue: "teal",
  },
  {
    n: "04",
    title: "Deploy the model that fits",
    copy: "Contract, EOR, Permanent or Managed Delivery — matched to who needs to carry the contract and the visa.",
    hue: "violet",
  },
];

export function HubHowWeWork() {
  return (
    <section className={styles.hww}>
      <div className={styles.wrap}>
        <div className={styles.hwwHead}>
          <div className={styles.eyebrow}>How we work</div>
          <h2 className={styles.h2}>
            Four steps from brief to bench —{" "}
            <span className={styles.emphasis}>
              every programme, same rhythm.
            </span>
          </h2>
          <p className={styles.sub}>
            Yallo Talent is a contract-first bench built on architect-led
            screening. Every engagement follows the same disciplined operating
            rhythm — regardless of sector, platform or model.
          </p>
        </div>
        <div className={styles.hwwGrid}>
          {howWeWorkSteps.map((s) => (
            <div key={s.n} className={styles.hwwStep} style={cardHueStyle()}>
              <div className={styles.glow} aria-hidden="true" />
              <div className={styles.hwwStepInner}>
                <div className={styles.hwwStepNum}>{s.n}</div>
                <h3 className={styles.hwwStepTitle}>{s.title}</h3>
                <p className={styles.hwwStepCopy}>{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ ARCHITECTS ============ */
const architects: {
  name: string;
  role: string;
  bio: string;
  hue: L1Hue;
}[] = [
  {
    name: "Sumeet Goenka",
    role: "Founder & CEO",
    bio: "Two decades running enterprise programmes across Richemont, Landmark Group and Alshaya EMEA. Ran the deliveries — now runs the team that staffs them.",
    hue: "orange",
  },
  {
    name: "SAP practice lead",
    role: "Architect · SAP",
    bio: "20+ years of SAP delivery across retail and financial services. Screens every SAP CX, Commerce, S/4HANA and IBP candidate.",
    hue: "blue",
  },
  {
    name: "Oracle practice lead",
    role: "Architect · Oracle",
    bio: "Ex-Oracle Fusion delivery leader. Depth-tests every Oracle Retail, FLEXCUBE, OTM and Xstore candidate for functional and technical fit.",
    hue: "green",
  },
  {
    name: "Cloud & Data practice lead",
    role: "Architect · Cloud & Data",
    bio: "Azure and AWS platform builder. Runs screening for cloud, data engineering and DevOps roles across all six sectors.",
    hue: "teal",
  },
];

export function HubArchitects() {
  return (
    <section className={styles.arch}>
      <div className={styles.wrap}>
        <div className={styles.archHead}>
          <div className={styles.eyebrow}>Screened by architects</div>
          <h2 className={styles.h2}>
            The people who screen your shortlist —{" "}
            <span className={styles.emphasis}>
              have run enterprise programmes at scale.
            </span>
          </h2>
          <p className={styles.sub}>
            Yallo Talent is architect-led, not sourcer-led. Every practice lead
            has decades of delivery under them. They review every candidate
            personally before the shortlist leaves the building — the reason our
            72h SLA holds up.
          </p>
        </div>
        <div className={styles.archGrid}>
          {architects.map((a) => (
            <article
              key={a.name}
              className={styles.archCard}
              style={cardHueStyle()}
            >
              <div className={styles.glow} aria-hidden="true" />
              <div className={styles.archCardInner}>
                <div className={styles.archInitials} aria-hidden="true">
                  {a.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className={styles.archRole}>{a.role}</div>
                <div className={styles.archName}>{a.name}</div>
                <p className={styles.archBio}>{a.bio}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.archFoot}>
          <Link href="/leadership" className={styles.archFootLink}>
            Meet the whole team
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ CROSS-CONNECTED RAILS ============ */
export function HubCrossConnected() {
  return (
    <section className={styles.cross}>
      <div className={styles.wrap}>
        <div className={styles.crossHead}>
          <div className={styles.eyebrow}>Also connected</div>
          <h2 className={styles.h2}>
            Same bench, three ways to browse it —{" "}
            <span className={styles.emphasis}>
              by industry, platform or capability.
            </span>
          </h2>
        </div>
        <div className={styles.crossRails}>
          <div className={styles.crossRail}>
            <div className={styles.crossRailLabel}>Platforms we staff</div>
            <div className={styles.crossChips}>
              {[
                { slug: "sap", label: "SAP", hue: "blue" as L1Hue },
                { slug: "oracle", label: "Oracle", hue: "orange" as L1Hue },
                {
                  slug: "salesforce",
                  label: "Salesforce",
                  hue: "teal" as L1Hue,
                },
                {
                  slug: "microsoft",
                  label: "Microsoft",
                  hue: "violet" as L1Hue,
                },
                {
                  slug: "blue-yonder",
                  label: "Blue Yonder",
                  hue: "green" as L1Hue,
                },
                { slug: "workday", label: "Workday", hue: "rose" as L1Hue },
              ]
                // Only platforms with a page. Microsoft and Workday have no
                // module data yet and render nowhere rather than 404.
                .filter((p) => routeExists(`/platforms/${p.slug}`))
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/platforms/${p.slug}`}
                    className={styles.crossChip}
                    style={cardHueStyle()}
                  >
                    <span className={styles.crossChipLabel}>{p.label}</span>
                    <span className={styles.crossChipArr} aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
            </div>
          </div>
          <div className={styles.crossRail}>
            <div className={styles.crossRailLabel}>Capabilities we deliver</div>
            <div className={styles.crossChips}>
              {[
                {
                  slug: "data-analytics",
                  label: "Data & Analytics",
                  hue: "violet" as L1Hue,
                },
                {
                  slug: "devops-platform-engineering",
                  label: "DevOps & Platform Engineering",
                  hue: "blue" as L1Hue,
                },
                {
                  slug: "cloud-infrastructure",
                  label: "Cloud & Infrastructure",
                  hue: "teal" as L1Hue,
                },
                {
                  slug: "cybersecurity",
                  label: "Cybersecurity",
                  hue: "rose" as L1Hue,
                },
                {
                  slug: "integration-middleware",
                  label: "Integration & Middleware",
                  hue: "green" as L1Hue,
                },
                {
                  slug: "testing-quality-engineering",
                  label: "Testing & Quality Engineering",
                  hue: "orange" as L1Hue,
                },
              ]
                // Only disciplines with a page. The others are real and the nav
                // names them non-interactively.
                .filter((c) => routeExists(`/capabilities/${c.slug}`))
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/capabilities/${c.slug}`}
                    className={styles.crossChip}
                    style={cardHueStyle()}
                  >
                    <span className={styles.crossChipLabel}>{c.label}</span>
                    <span className={styles.crossChipArr} aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
