import Link from "next/link";
import styles from "./Footer.module.css";

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
  { label: "Job seekers", href: "/jobs" },
];

const yalloFamily = [
  { label: "Yallo Talent", href: "https://talent.yallo.co", live: true },
  { label: "saasinator AI", href: "#", live: false },
  { label: "Yallo AI Academy", href: "#", live: false },
];

const offices = [
  {
    city: "London",
    country: "United Kingdom",
    line: "Serving the UK enterprise market",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    line: "Serving the Middle East region",
  },
  {
    city: "Bengaluru",
    country: "India",
    line: "Serving India and delivery hubs",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <div className={styles.brand}>
              <span className={styles.brandMark}>Yallo</span>
              <span className={styles.brandSuffix}>Talent</span>
            </div>
            <p className={styles.brandCopy}>
              Contract-first workforce for enterprise platform programmes.
              Architect-screened contractors delivered in 72 hours across UK ·
              ME · India.
            </p>
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
                      {!item.live && (
                        <span className={styles.soon}>Launching soon</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.officeStrip}>
          {offices.map((office) => (
            <div key={office.city} className={styles.officeCard}>
              <div className={styles.officeCity}>{office.city}</div>
              <div className={styles.officeCountry}>{office.country}</div>
              <div className={styles.officeLine}>{office.line}</div>
            </div>
          ))}
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
