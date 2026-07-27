import Link from "next/link";
import styles from "./PlatformTalent.module.css";

interface Platform {
  slug: string;
  abbr: string;
  name: string;
  desc: string;
  tags: [string, string, string];
}

const platforms: Platform[] = [
  {
    slug: "sap",
    abbr: "SAP",
    name: "SAP",
    desc: "S/4HANA, FICO, MM, SD and integration specialists — functional and technical.",
    tags: ["Functional", "Technical", "Architecture"],
  },
  {
    slug: "oracle",
    abbr: "ORA",
    name: "Oracle",
    desc: "ERP, EPM, HCM and Fusion specialists across the back office.",
    tags: ["Functional", "Technical", "EPM"],
  },
  {
    slug: "microsoft",
    abbr: "MS",
    name: "Microsoft",
    desc: "Dynamics, Azure, Power Platform and M365 engineers and leads.",
    tags: ["Dynamics", "Azure", "Power Platform"],
  },
  {
    slug: "salesforce",
    abbr: "SF",
    name: "Salesforce",
    desc: "Core CRM, Commerce Cloud and integration architects.",
    tags: ["Admin", "Developer", "Architect"],
  },
  {
    slug: "blueyonder",
    abbr: "BY",
    name: "Blue Yonder",
    desc: "SCM, WMS, TMS, Luminate and Merchandise Financial Planning specialists.",
    tags: ["WMS", "TMS", "Luminate"],
  },
  {
    slug: "workday",
    abbr: "WD",
    name: "Workday",
    desc: "HCM, Payroll, Recruiting and Adaptive Planning specialists for enterprise HR.",
    tags: ["HCM", "Payroll", "Adaptive"],
  },
];

export function PlatformTalent() {
  return (
    <section id="platforms" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.dot} aria-hidden="true" />
            <span>Platform talent</span>
          </div>
          <h2 className={styles.h}>
            Specialists for every enterprise platform.
          </h2>
          <p className={styles.sub}>
            SAP, Oracle, Microsoft, Salesforce, Blue Yonder and Workday —
            contractor benches active across UK, Middle East and India.
          </p>
        </header>

        <div className={styles.grid}>
          {platforms.map((p) => (
            <Link
              key={p.slug}
              href={`/platforms/${p.slug}`}
              className={styles.card}
              aria-label={`View ${p.name} contractors`}
            >
              <div className={styles.glow} aria-hidden="true" />
              <div className={styles.top}>
                <span className={styles.badge}>{p.abbr}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </div>
              <div className={styles.name}>{p.name}</div>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
