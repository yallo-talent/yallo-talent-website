import Link from "next/link";
import { sectorNavEntries } from "@/lib/sectors";
import styles from "./Footer.module.css";
import { FOOTER_ID } from "./floating-affordances";
import { Lockup } from "./Lockup";
import { type ExternalLink, jobSeekersLink } from "./nav-config";

interface FooterLink {
  label: string;
  href: string;
  /** Present only on links that leave the site. See nav-config.ts. */
  anchorProps?: ExternalLink["anchorProps"];
}

const serviceLinks = [
  { label: "Contract Workforce", href: "/contract" },
  { label: "Permanent Hiring", href: "/permanent" },
  { label: "EOR", href: "/eor" },
  { label: "Managed Delivery", href: "/managed-delivery" },
];

/**
 * Derived, like the mega menu and the sector rail. This list was a fourth copy
 * of the sector taxonomy and it had drifted into its own register — "Retail &
 * Consumer" in full beside "Financial Services", "Telco" and "Government" — so
 * the footer named three sectors differently from every other surface.
 *
 * Unpublished sectors are filtered rather than rendered as inert text: a footer
 * is a link list, and canon bans a coming-soon state. A sector appears here on
 * the commit that gives it a page.
 */
const industryLinks = sectorNavEntries()
  .filter((s) => s.published)
  .map(({ label, href }) => ({ label, href }));

/* Jobs is the imported constant, not a sixth `{ label, href }` literal. It WAS
   one — a hand-copied "/jobs" that no nav change could ever have reached — which
   is why the same address rendered in the same tab here after both NavBar
   consumers had been fixed. Anything carrying `anchorProps` renders as a plain
   external anchor in FooterColumn below. */
const quickLinks: FooterLink[] = [
  { label: "About Yallo", href: "/about" },
  { label: "Why Yallo", href: "/why-yallo" },
  { label: "Leadership", href: "/leadership" },
  { label: "Insights", href: "/insights" },
  { label: "Case studies", href: "/case-studies" },
  jobSeekersLink,
];

/* Yallo AI Academy was withdrawn in round 12 (§4.4) because academy.yallo.co
   did not exist and a link to nothing is worse than no link. Sumeet reinstated
   it in round 23: the host is now the Academy's address from first launch, per
   the ratified domain architecture, and the group's own footer is where its
   business lines are named. Measured 8 Aug 2026 at 18:48 GST the host answered
   503; the ruling stands and the measurement is recorded in the relay rather
   than hedged here, because a footer is not the place to publish a caveat about
   an origin that is still being stood up. */
const yalloFamily = [
  { label: "Yallo Talent", href: "https://yallo.co" },
  { label: "saasinator AI", href: "https://saasinator.ai" },
  { label: "Yallo AI Academy", href: "https://academy.yallo.co" },
];

const offices = [
  { city: "London", country: "United Kingdom" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Riyadh", country: "Saudi Arabia" },
  { city: "Bengaluru", country: "India" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    /* band-dark: the footer ground is permanently dark in both themes, but the
       global .eyebrow class reads --accent-label, which resolves to gold-ink in
       the light theme — 3.16:1 on near-black, a real AA failure that the token
       contrast gate cannot see because the pair is only formed at render.
       band-dark restates the semantic layer so descendants resolve against the
       ground they actually sit on.

       FOOTER_ID is the handle the assistant launcher watches so it can stand
       down rather than cover a footer link. Owned in floating-affordances.ts
       alongside the other two, never typed as a literal anywhere. */
    <footer id={FOOTER_ID} className={`${styles.footer} band-dark`}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <div className={styles.brand}>
              <Lockup />
            </div>
            <p className={styles.brandCopy}>
              Enterprise platform talent across the Middle East, Europe and
              India. Specialist-screened shortlists in 72 hours.
            </p>
            <div className={styles.locations}>
              <div className={styles.locationsLabel}>Locations</div>
              <ul className={styles.locationList}>
                {offices.map((o) => (
                  <li key={o.city} className={styles.locationItem}>
                    <span className={styles.locationDot} aria-hidden="true" />
                    <span className={styles.locationCity}>{o.city}</span>
                    <span className={styles.locationCountry}>{o.country}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.linkGrid}>
            <FooterColumn heading="Services" links={serviceLinks} />
            <FooterColumn heading="Industries" links={industryLinks} />
            <FooterColumn heading="Company" links={quickLinks} />
            <div className={styles.linkCol}>
              <div className="eyebrow">Group companies</div>
              <ul className={styles.linkList}>
                {yalloFamily.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {year} Yallo Group. All rights reserved.
          </div>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className={styles.legalLink}>
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/cookies" className={styles.legalLink}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  heading: string;
  links: FooterLink[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div className={styles.linkCol}>
      <div className="eyebrow">{heading}</div>
      <ul className={styles.linkList}>
        {links.map((item) => (
          <li key={item.href}>
            {/* A plain <a> for anything that leaves: the router owns /jobs as a
                real route in this app and next/link would render it rather than
                let the browser go where production actually points. */}
            {item.anchorProps ? (
              <a {...item.anchorProps} className={styles.link}>
                {item.label}
                <span className={styles.externalMark} aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
