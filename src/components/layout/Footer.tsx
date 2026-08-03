import Link from "next/link";
import { sectorNavEntries } from "@/lib/sectors";
import styles from "./Footer.module.css";
import { Lockup } from "./Lockup";

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

const quickLinks = [
  { label: "About Yallo", href: "/about" },
  { label: "Why Yallo", href: "/why-yallo" },
  { label: "Leadership", href: "/leadership" },
  { label: "Insights", href: "/insights" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Jobs", href: "/jobs" },
];

/* Yallo AI Academy is withdrawn, not deferred to a date or a "coming soon" —
   round12-scope.md §4.4. It sits on a host that doesn't exist yet
   (academy.yallo.co), so there is nothing to link to and no date that
   wouldn't be quietly wrong within a month. One line to add back once that
   host is real. */
const yalloFamily = [
  { label: "Yallo Talent", href: "https://talent.yallo.co" },
  { label: "saasinator AI", href: "https://saasinator.ai" },
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
       ground they actually sit on. */
    <footer className={`${styles.footer} band-dark`}>
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
  links: { label: string; href: string }[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div className={styles.linkCol}>
      <div className="eyebrow">{heading}</div>
      <ul className={styles.linkList}>
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
