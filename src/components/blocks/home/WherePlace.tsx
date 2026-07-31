import Link from "next/link";
import { placeCopy, platforms, sectors } from "@/data/home/place";
import styles from "./Home.module.css";
import { RoleGlyph } from "./icons";
import { LogoImage } from "./LogoImage";
import { SectionHead } from "./SectionHead";

/**
 * Two axes only — the discipline axis is deliberately absent because
 * RoleCoverage carries it.
 *
 * First of the two inverted bands: this is a data surface, so `.band-invert`
 * flips the semantic layer and the section reads correctly in both themes.
 *
 * Platform routes are unbuilt, so those rows render as non-interactive text
 * rather than linking to a 404.
 */
export function WherePlace() {
  return (
    <section
      className={`${styles.section} ${styles.invert} band-invert amb-1 amb-wash`}
      id="place"
    >
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={placeCopy.eyebrow}
          heading={placeCopy.heading}
          lede={placeCopy.lede}
          id="place-heading"
        />

        <div className={styles.axes}>
          <div>
            <p className={styles.axisLabel}>{placeCopy.platformsLabel}</p>
            <ul className={styles.axisList}>
              {platforms.map((p) => {
                const body = (
                  <div className={styles.axisItem}>
                    {/* R9: a keyed silhouette or the vendor's NAME — never a
                        padded box. The name variant is NOT aria-hidden, because
                        unlike a decorative mark beside a visible label it is the
                        only rendering of that vendor in this cell. */}
                    {p.mark ? (
                      <span className={styles.axisMark} aria-hidden="true">
                        <LogoImage src={p.mark} width={44} height={22} />
                      </span>
                    ) : (
                      <span className={styles.axisMarkName}>{p.name}</span>
                    )}
                    <span>
                      <span className={styles.axisName}>{p.name}</span>
                      <span className={styles.axisModules}>{p.modules}</span>
                    </span>
                  </div>
                );
                return (
                  <li key={p.slug}>
                    {p.published ? (
                      <Link
                        className={styles.axisLink}
                        href={`/platforms/${p.slug}`}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className={styles.unbuilt} aria-disabled="true">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className={styles.axisLabel}>{placeCopy.sectorsLabel}</p>
            <ul className={styles.axisList}>
              {sectors.map((s) => (
                <li key={s.slug}>
                  <Link
                    className={styles.axisLink}
                    href={`/industries/${s.slug}`}
                  >
                    <div className={styles.axisItem}>
                      <span className={styles.axisMarkDrawn} aria-hidden="true">
                        <RoleGlyph name={s.icon} />
                      </span>
                      <span>
                        <span className={styles.axisName}>{s.name}</span>
                        <span className={styles.axisModules}>{s.scope}</span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
