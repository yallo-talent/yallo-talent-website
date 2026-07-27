import Link from "next/link";
import styles from "./WhereWePlace.module.css";

interface Sector {
  slug: string;
  name: string;
  category: string;
  desc: string;
  roles: [string, string, string];
  hot: boolean;
  variant: 1 | 2 | 3 | 4 | 5 | 6;
}

const sectors: Sector[] = [
  {
    slug: "retail",
    name: "Retail & Consumer",
    category: "Retail & Commerce",
    desc: "Commerce, POS and supply-chain transformation across the GCC and UK.",
    roles: ["Commerce & POS", "Supply chain", "Data & personalisation"],
    hot: false,
    variant: 1,
  },
  {
    slug: "finance",
    name: "Banking & Financial Services",
    category: "Financial Services",
    desc: "Core banking, payments, risk and data programmes across the GCC.",
    roles: [
      "Core banking & payments",
      "Risk, data & regulatory",
      "Cloud platform engineering",
    ],
    hot: true,
    variant: 2,
  },
  {
    slug: "government",
    name: "Public Sector",
    category: "Government",
    desc: "Government digital and smart services across the GCC and UK.",
    roles: [
      "Digital government delivery",
      "Data & platform",
      "Cybersecurity & GRC",
    ],
    hot: true,
    variant: 3,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Logistics",
    category: "Industry & Supply Chain",
    desc: "ERP, Industry 4.0, warehouse and transport transformation.",
    roles: [
      "ERP & supply chain",
      "WMS & TMS specialists",
      "Plant & OT systems",
    ],
    hot: true,
    variant: 4,
  },
  {
    slug: "healthcare",
    name: "Healthcare & Life Sciences",
    category: "Health & Life Sci",
    desc: "Clinical systems and compliance-grade delivery across GCC and UK.",
    roles: [
      "Clinical & EMR systems",
      "Data platforms",
      "Security & compliance",
    ],
    hot: false,
    variant: 5,
  },
  {
    slug: "telco",
    name: "Telco & Media",
    category: "Telecommunications",
    desc: "OSS/BSS, network and data engineering across telco transformation.",
    roles: ["OSS / BSS", "Network engineering", "Data engineering"],
    hot: false,
    variant: 6,
  },
];

export function WhereWePlace() {
  return (
    <section id="where-we-place" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.dot} aria-hidden="true" />
            <span>Where we place</span>
          </div>
          <h2 className={styles.h}>
            The sectors hiring —<br />
            and the skills they need.
          </h2>
          <p className={styles.sub}>
            Banking, public sector, manufacturing and logistics are hiring hard
            right now. Click any sector to explore the roles in demand.
          </p>
        </header>

        <div className={styles.grid}>
          {sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/industries/${sector.slug}`}
              className={`${styles.card} ${styles[`variant${sector.variant}`]}`}
              aria-label={`View ${sector.name} contractors`}
            >
              <div className={styles.overlay} />
              <div className={styles.bar} aria-hidden="true" />
              <div className={styles.body}>
                <div className={styles.top}>
                  <span className={styles.cat}>{sector.category}</span>
                  {sector.hot && (
                    <span className={styles.hotBadge}>Hiring now</span>
                  )}
                </div>
                <div className={styles.middle}>
                  <h3 className={styles.name}>{sector.name}</h3>
                  <p className={styles.desc}>{sector.desc}</p>
                </div>
                <ul className={styles.roles}>
                  {sector.roles.map((role) => (
                    <li key={role} className={styles.role}>
                      {role}
                    </li>
                  ))}
                </ul>
                <div className={styles.foot}>
                  <span className={styles.footCta}>
                    Explore sector
                    <span className={styles.arr} aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
