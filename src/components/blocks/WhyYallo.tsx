import styles from "./WhyYallo.module.css";

interface Card {
  n: string;
  title: string;
  desc: string;
  stat?: { n: string; l: string };
  icon: React.ReactNode;
  variant: "tall" | "wide" | "std";
}

const cards: Card[] = [
  {
    n: "01",
    title: "Architect-led screening",
    desc: "Specialists are screened by people who have built enterprise tech — for depth and delivery risk, not keywords.",
    stat: { n: "0", l: "CVs without a brief first" },
    variant: "tall",
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
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Shortlists in 72 hours",
    desc: "A calibrated shortlist within 72 hours of the brief, so your programme does not wait on hiring.",
    variant: "wide",
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Four ways to hire",
    desc: "Permanent, contract, EOR or subcontracting — matched to how you need to hold the risk.",
    variant: "std",
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
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Deep in the region",
    desc: "GCC, India and the UK, with recruiters who know the sectors that are actually hiring.",
    variant: "std",
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
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        <path d="M2.5 12h19M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
];

export function WhyYallo() {
  return (
    <section id="why" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.hdr}>
          <div className={styles.hdrL}>
            <div className={styles.eye}>
              <span className={styles.eyeDot} aria-hidden="true" />
              <span>Why Yallo</span>
            </div>
            <h2 className={styles.h}>
              A hiring partner that thinks like your{" "}
              <span className={styles.gold}>delivery team.</span>
            </h2>
            <p className={styles.sub}>
              Not another recruitment agency. Yallo is architect-led — the same
              operators who ran enterprise programmes across Richemont, Landmark
              and Alshaya EMEA now screen every shortlist.
            </p>
          </div>
          <div className={styles.hdrR}>
            <div className={styles.rule} />
          </div>
        </header>

        <div className={styles.bento}>
          {cards.map((c) => (
            <article
              key={c.n}
              className={`${styles.co} ${styles[c.variant]}`}
              data-n={c.n}
            >
              <div className={styles.card}>
                <div className={styles.glow} aria-hidden="true" />
                <div className={styles.wm} aria-hidden="true">
                  {c.n}
                </div>
                <div className={styles.icon}>{c.icon}</div>
                <h3 className={styles.title}>{c.title}</h3>
                <p className={styles.desc}>{c.desc}</p>
                {c.stat && (
                  <div className={styles.stat}>
                    <span className={styles.statN}>{c.stat.n}</span>
                    <span className={styles.statL}>{c.stat.l}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
