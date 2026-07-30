import Link from "next/link";
import styles from "./Footer.module.css";
import { YalloFlower } from "./YalloFlower";

const serviceLinks = [
  { label: "Contract Workforce", href: "/contract" },
  { label: "Permanent Hiring", href: "/permanent" },
  { label: "EOR", href: "/eor" },
  { label: "Managed Delivery", href: "/managed-delivery" },
];

const industryLinks = [
  { label: "Retail & Consumer", href: "/industries/retail" },
  { label: "Financial Services", href: "/industries/finance" },
  { label: "Manufacturing", href: "/industries/manufacturing" },
  { label: "Healthcare", href: "/industries/healthcare" },
  { label: "Government", href: "/industries/government" },
  { label: "Telco", href: "/industries/telco" },
];

const quickLinks = [
  { label: "About Yallo", href: "/about" },
  { label: "Why Yallo", href: "/why-yallo" },
  { label: "Leadership", href: "/leadership" },
  { label: "Insights", href: "/insights" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Jobs", href: "/jobs" },
];

const yalloFamily = [
  { label: "Yallo Talent", href: "https://talent.yallo.co", live: true },
  { label: "saasinator AI", href: "https://saasinator.ai", live: true },
  { label: "Yallo AI Academy", href: "#", live: false },
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
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <div className={styles.brand}>
              <YalloFlower size={44} className={styles.brandFlower} />
              <span className={styles.brandText}>
                <span className={styles.brandMark}>Yallo</span>
                <span className={styles.brandSuffix}>Talent</span>
              </span>
            </div>
            <p className={styles.brandCopy}>
              Enterprise platform talent across the Middle East and Europe.
              Specialist-screened shortlists in 72 hours.
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
              <div className="eyebrow">Yallo family</div>
              <ul className={styles.linkList}>
                {yalloFamily.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={styles.link}
                      aria-disabled={!item.live}
                    >
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
