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

export function LegalPageShell({ data }: Props) {
  return (
    <div className={editorial.page}>
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
                  Questions about this notice? Email{" "}
                  <a href="mailto:privacy@yallo.co">privacy@yallo.co</a>.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
