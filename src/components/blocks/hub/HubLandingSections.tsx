"use client";

import Link from "next/link";
import { l1Icons } from "@/components/blocks/l1/l1-icons";
import { capabilitiesIndex, platformsIndex } from "@/data/l1/index";
import type { L1IconKey } from "@/data/l1/types";
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

/* ============ WHAT WE DELIVER ============ */
const whatWeDeliverCards: {
  icon: L1IconKey;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
}[] = [
  {
    icon: "scarce",
    eyebrow: "Contract-first bench",
    title: "Specialists in the seat, not sourced in a week.",
    copy: "Every role we place already sits on an assessed bench. Named consultants with delivery track records, screened by the specialist leading that practice.",
    bullets: [
      "72h from brief to shortlist",
      "2:1 CV-to-interview ratio",
      "Named consultants, not agency profiles",
    ],
  },
  {
    icon: "workforce",
    eyebrow: "Specialist-led screening",
    title: "Screening depth that recruiters can't reproduce.",
    copy: "Every shortlist is depth-tested by specialists who have delivered this platform, in this sector, at this scale. Certifications don't cut it: evidence does.",
    bullets: [
      "Practice leads screen every candidate",
      "Sector-specific context tests",
      "Reference-verified track records",
    ],
  },
  {
    icon: "spark",
    eyebrow: "Multi-market flexibility",
    title: "Middle East · Europe · India: contract, EOR, perm or delivery.",
    copy: "Cross-market bench lets us place fast in the region that's constrained. Four commercial models decide who carries the contract, the visa and the notice period.",
    bullets: [
      /* R17 — same unevidenced claim as the L1 shell. See that comment. */
      "Four entities: London · Dubai · Riyadh · Bengaluru",
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
            Three things every {label.toLowerCase()} programme buys from us,{" "}
            <span className={styles.emphasis}>
              speed, screening depth, and coverage.
            </span>
          </h2>
          <p className={styles.sub}>
            The Yallo Talent bench is engineered around three commitments. Every
            programme we support gets all three, from the first brief.
          </p>
        </div>
        <div className={styles.wwdGrid}>
          {whatWeDeliverCards.map((c, i) => (
            <article key={c.title} className={styles.wwdCard}>
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
}[] = [
  {
    n: "01",
    title: "Send us the brief",
    copy: "Role, platform, timeline, engagement model. No CVs on speculation. We start from what your programme actually needs.",
  },
  {
    n: "02",
    title: "Specialist-led screening",
    copy: "Specialists who have run your kind of delivery assess every candidate for implementation depth. Not certificates. Not keywords.",
  },
  {
    n: "03",
    title: "Shortlist in 72 hours",
    copy: "Three to five specialist-screened candidates in your inbox with rate, notice, engagement model and evidence attached.",
  },
  {
    n: "04",
    title: "Deploy the model that fits",
    copy: "Contract, EOR, Permanent or Managed Delivery: matched to who needs to carry the contract and the visa.",
  },
];

export function HubHowWeWork() {
  return (
    <section className={styles.hww}>
      <div className={styles.wrap}>
        <div className={styles.hwwHead}>
          <div className={styles.eyebrow}>How we work</div>
          <h2 className={styles.h2}>
            Four steps from brief to bench:{" "}
            <span className={styles.emphasis}>
              every programme, same rhythm.
            </span>
          </h2>
          <p className={styles.sub}>
            Yallo Talent is a contract-first bench built on specialist-led
            screening. Every engagement follows the same disciplined operating
            rhythm, regardless of sector, platform or model.
          </p>
        </div>
        <div className={styles.hwwGrid}>
          {howWeWorkSteps.map((s) => (
            <div key={s.n} className={styles.hwwStep}>
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
}[] = [
  {
    name: "Sumeet Goenka",
    role: "Founder & CEO",
    bio: "Two decades running enterprise programmes across Richemont, Landmark Group and Alshaya EMEA. Ran the deliveries, now runs the team that staffs them.",
  },
  {
    name: "SAP practice lead",
    role: "Architect · SAP",
    bio: "20+ years of SAP delivery across retail and financial services. Screens every SAP CX, Commerce, S/4HANA and IBP candidate.",
  },
  {
    name: "Oracle practice lead",
    role: "Architect · Oracle",
    bio: "Ex-Oracle Fusion delivery leader. Depth-tests every Oracle Retail, FLEXCUBE, OTM and Xstore candidate for functional and technical fit.",
  },
  {
    name: "Cloud & Data practice lead",
    role: "Architect · Cloud & Data",
    bio: "Azure and AWS platform builder. Runs screening for cloud, data engineering and DevOps roles across all six sectors.",
  },
];

export function HubArchitects() {
  return (
    <section className={styles.arch}>
      <div className={styles.wrap}>
        <div className={styles.archHead}>
          <div className={styles.eyebrow}>Screened by architects</div>
          <h2 className={styles.h2}>
            Screened by specialists who{" "}
            <span className={styles.emphasis}>
              have run enterprise programmes at scale.
            </span>
          </h2>
          <p className={styles.sub}>
            Yallo Talent is specialist-led, not sourcer-led. Every practice lead
            has decades of delivery under them. They review every candidate
            personally before the shortlist leaves the building, the reason our
            72h SLA holds up.
          </p>
        </div>
        <div className={styles.archGrid}>
          {architects.map((a) => (
            <article key={a.name} className={styles.archCard}>
              <div className={styles.glow} aria-hidden="true" />
              <div className={styles.archCardInner}>
                {/* No monogram tile. The same two-letter initials block was
                    deleted from the L1 in an earlier round — canon §8 has no
                    place for it and it fails contrast as a tinted tile — but the
                    hub kept its own copy, so the deletion never reached here.
                    axe flagged it on /industries once B3 brought the page under
                    test. */}
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
            Same bench, three ways to browse it:{" "}
            <span className={styles.emphasis}>
              by industry, platform or capability.
            </span>
          </h2>
        </div>
        <div className={styles.crossRails}>
          <div className={styles.crossRail}>
            <div className={styles.crossRailLabel}>Platforms we staff</div>
            <div className={styles.crossChips}>
              {platformsIndex
                /* DERIVED, and it was carrying two live defects at once, which
                   is what a hand-written copy of a taxonomy looks like after a
                   ratification it did not hear about.
                   It was missing Informatica, ratified as the seventh platform
                   on 1 Aug (R-INF1), so this rail showed six platforms where the
                   mega menu showed seven. And it ran Salesforce before
                   Microsoft, against canon §3's order, which the menu had right.
                   Neither was visible from inside this file. Both are gone by
                   construction now: the order is the index's and so is every
                   name. */
                .map((p) => ({ slug: p.slug, label: p.label }))
                // Only platforms with a page: below the module-coverage floor
                // the honest answer is no page, so the chip renders nowhere
                // rather than linking to a 404.
                .filter((p) => routeExists(`/platforms/${p.slug}`))
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/platforms/${p.slug}`}
                    className={styles.crossChip}
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
              {capabilitiesIndex
                /* Derived from the taxonomy, not retyped. This was a
                   hand-written array of six disciplines with their own labels —
                   the fourth copy of the same list, after the taxonomy index,
                   the hub page and the nav. It had already drifted twice: it
                   still called this desk "Cybersecurity" after the rename to
                   "Cybersecurity & Risk", and it never gained AI Talent at all,
                   so the seventh discipline was missing from every rail this
                   component renders. */
                .map((c) => ({ slug: c.slug, label: c.label, href: c.href }))
                // Only disciplines with a page. The others are real and the nav
                // names them non-interactively.
                .filter((c) => c.href || routeExists(`/capabilities/${c.slug}`))
                .map((c) => (
                  <Link
                    key={c.slug}
                    /* `c.href` where the canonical route is not
                       /capabilities/{slug}. AI Talent lives at /ai-talent, and
                       linking it through the redirect would put a 301 hop on
                       every one of these rails. */
                    href={c.href ?? `/capabilities/${c.slug}`}
                    className={styles.crossChip}
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
