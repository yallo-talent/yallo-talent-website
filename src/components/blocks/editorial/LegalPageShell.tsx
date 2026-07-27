import Link from "next/link";
import editorial from "./EditorialLayout.module.css";
import styles from "./LegalPageShell.module.css";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPageData {
  title: string;
  lastUpdated: string;
  lede: string;
  sections: LegalSection[];
}

interface Props {
  data: LegalPageData;
}

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-teal-500)",
  "--sector-accent-08": "var(--hue-teal-08)",
  "--sector-accent-20": "var(--hue-teal-20)",
  "--sector-accent-35": "var(--hue-teal-35)",
} as React.CSSProperties;

export function LegalPageShell({ data }: Props) {
  return (
    <div className={editorial.page} style={hueStyle}>
      <section className={editorial.hero}>
        <div className={editorial.heroBg} aria-hidden="true">
          <div className={editorial.heroBgA} />
          <div className={editorial.heroBgB} />
          <div className={editorial.heroGrid} />
        </div>
        <div className={editorial.heroInner}>
          <div className={editorial.eyebrow}>
            <span className={editorial.eyebrowDot} aria-hidden="true" />
            Legal
          </div>
          <h1 className={editorial.heroTitle}>{data.title}</h1>
          <p className={editorial.heroLede}>{data.lede}</p>
          <div className={styles.meta}>Last updated: {data.lastUpdated}</div>
        </div>
      </section>

      <section className={styles.body}>
        <div className={editorial.wrap}>
          <div className={styles.grid}>
            <aside className={styles.toc} aria-label="On this page">
              <div className={styles.tocTitle}>On this page</div>
              <ol className={styles.tocList}>
                {data.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a href={`#s-${i + 1}`} className={styles.tocLink}>
                      {String(i + 1).padStart(2, "0")} · {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <article className={styles.content}>
              {data.sections.map((s, i) => (
                <section
                  key={s.heading}
                  id={`s-${i + 1}`}
                  className={styles.section}
                >
                  <div className={styles.sectionNum}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className={styles.sectionH}>{s.heading}</h2>
                  {s.body.map((para) => (
                    <p key={para.slice(0, 24)} className={styles.para}>
                      {para}
                    </p>
                  ))}
                </section>
              ))}

              <div className={styles.footer}>
                <p className={styles.para}>
                  Questions? Reach us at <Link href="/brief">get in touch</Link>
                  .
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
