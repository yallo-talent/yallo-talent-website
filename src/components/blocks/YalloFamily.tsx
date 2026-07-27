import styles from "./YalloFamily.module.css";

interface FamilyCard {
  cat: string;
  title: string;
  badge: { label: string; kind: "here" | "soon" };
  desc: string;
  linkLabel: string;
  href?: string;
  external?: boolean;
  icon: React.ReactNode;
}

const family: FamilyCard[] = [
  {
    cat: "Talent",
    title: "Yallo Talent",
    badge: { label: "You're here", kind: "here" },
    desc: "Specialist enterprise tech talent — permanent, contract, EOR and subcontracting across the GCC, India and the UK.",
    linkLabel: "Enterprise tech talent",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    cat: "AI Advisory & Build",
    title: "saasinator",
    badge: { label: "Launching soon", kind: "soon" },
    desc: "Enterprise AI, designed, built and run — from strategy to production. Advisory, delivery and managed AI services, brief to deploy.",
    linkLabel: "Explore saasinator",
    href: "https://saasinator.ai",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    cat: "AI Enablement",
    title: "Yallo AI Academy",
    badge: { label: "Launching soon", kind: "soon" },
    desc: "Build the AI capability of your leaders and teams — practical, role-based enablement designed by people who have run it.",
    linkLabel: "Explore the Academy",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10.5L12 5 2 10.5l10 5.5 10-5.5z" />
        <path d="M6 13v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
        <path d="M22 10.5v5" />
      </svg>
    ),
  },
];

export function YalloFamily() {
  return (
    <section id="yallo-family" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.hdr}>
          <span className={styles.eye}>The Yallo Family</span>
          <h2 className={styles.h}>When the challenge goes beyond hiring.</h2>
          <p className={styles.sub}>
            Yallo Talent is one arm of the Yallo group. When you need more than
            people, our sister companies pick up where talent leaves off —
            advisory and build, and AI enablement.
          </p>
        </header>

        <div className={styles.grid}>
          {family.map((c) => {
            const linkContent = (
              <>
                {c.linkLabel}
                {c.href && (
                  <span className={styles.linkArr} aria-hidden="true">
                    →
                  </span>
                )}
              </>
            );
            return (
              <article key={c.title} className={styles.card}>
                <div className={styles.iconBox}>{c.icon}</div>
                <div className={styles.cat}>{c.cat}</div>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{c.title}</span>
                  <span
                    className={`${styles.badge} ${c.badge.kind === "here" ? styles.badgeHere : styles.badgeSoon}`}
                  >
                    {c.badge.label}
                  </span>
                </div>
                <p className={styles.desc}>{c.desc}</p>
                <div className={styles.footer}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className={styles.link}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                    >
                      {linkContent}
                    </a>
                  ) : (
                    <span className={styles.link}>{linkContent}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
