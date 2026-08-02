import Link from "next/link";
import { placeCopy, platforms, sectors } from "@/data/home/place";
import { sectorRegistry } from "@/data/l1/registry";
import { publishedPlatformSlugs } from "@/data/platforms/derive";
import { derivePlatformList } from "@/lib/platforms";
import { deriveSectorList } from "@/lib/sectors";
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
              {/* Name and order derive from `platformsIndex`, and `published`
                  derives from module coverage rather than from the flag in the
                  data. Decision 9 of context-round5-rulings.md: a hand-declared
                  publication state is the same class of defect as a hand-copied
                  label, and this rail was the live instance. place.ts marked
                  Informatica `published: false` while /platforms/informatica
                  returned 200, so the homepage rendered a real page as unbuilt
                  and hid the seventh platform, while the mega menu linked it
                  correctly on the same screen.
                  The flag left in the data is now inert, the same way the
                  authored sector names beneath it are. The scope line, the mark
                  and the module list stay authored. */}
              {derivePlatformList(platforms, (p) => p.slug).map((p) => {
                const published = publishedPlatformSlugs().includes(p.slug);
                const body = (
                  <div className={styles.axisItem}>
                    {/* R9: a keyed silhouette or the vendor's NAME — never a
                        padded box.

                        BOTH variants are aria-hidden. My previous comment here
                        claimed the name variant "is the only rendering of that
                        vendor in this cell" and that was simply false — read the
                        next element: .axisName renders p.name again, always. So
                        the link announced "Blue Yonder | Blue Yonder | Luminate ·
                        WMS · planning", stuttering the vendor twice before the
                        content, and only for the two vendors whose mark would not
                        key. The visual substitute is a substitute for the MARK,
                        which was already decorative; the label beside it is what
                        carries the name to AT. */}
                    {p.mark ? (
                      <span className={styles.axisMark} aria-hidden="true">
                        <LogoImage src={p.mark} width={44} height={22} />
                      </span>
                    ) : (
                      <span className={styles.axisMarkName} aria-hidden="true">
                        {p.name}
                      </span>
                    )}
                    <span>
                      <span className={styles.axisName}>{p.name}</span>
                      <span className={styles.axisModules}>{p.modules}</span>
                    </span>
                  </div>
                );
                return (
                  <li key={p.slug}>
                    {published ? (
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
              {/* Order and label from the sector index, not from place.ts.
                  This rail carried its own copy of the taxonomy and its own
                  order, which put Manufacturing third where the mega menu puts
                  it second. The scope line and the icon stay authored — they are
                  real per-card content and exist nowhere else. §4.3. */}
              {deriveSectorList(sectors, (s) => s.slug).map((s) => {
                /* `published` DERIVES from the registry as of round 5, the same
                   as the platform column above. Round 4 left it authored here
                   and the flag went stale in the other direction within the
                   round: place.ts marked Telco & Media unpublished while
                   /industries/telco returned 200, so the homepage rendered a
                   live sector as unbuilt and the only place that said so was a
                   greyed-out row nobody would think to click.
                   Found by measuring the rendered page rather than by reading
                   the data, which is the only way this shape of fault surfaces:
                   both files agreed with each other and both were wrong about
                   the site. Decision 9 generalised. */
                const published = s.slug in sectorRegistry;
                /* Same body either way, so the two branches cannot drift. */
                const body = (
                  <div className={styles.axisItem}>
                    <span className={styles.axisMarkDrawn} aria-hidden="true">
                      <RoleGlyph name={s.icon} />
                    </span>
                    <span>
                      <span className={styles.axisName}>{s.name}</span>
                      <span className={styles.axisModules}>{s.scope}</span>
                    </span>
                  </div>
                );
                /* The history, kept because it is the argument for deriving.
                   This rail once linked every sector unconditionally and shipped
                   a live link to /industries/education while that route 404ed.
                   Round 4 fixed it by honouring the authored flag; within the
                   same round the flag was wrong the other way, on Telco. Reading
                   the registry ends both directions at once. */
                return (
                  <li key={s.slug}>
                    {published ? (
                      <Link
                        className={styles.axisLink}
                        href={`/industries/${s.slug}`}
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
        </div>
      </div>
    </section>
  );
}
