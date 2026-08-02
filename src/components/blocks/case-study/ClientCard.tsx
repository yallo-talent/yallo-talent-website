import { ClientMark } from "@/components/blocks/ClientMark";
import { clientDisplayNameFor, clientLogoFor } from "@/data/home/client-logos";
import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import styles from "./CaseStudyDetail.module.css";

/**
 * Block 5. Only what the published source says: the client's own mark (or,
 * failing an asset, the register's display name) when the study names the
 * client; an anonymised descriptor when it does not.
 *
 * The `entity` surface: one mark on a page, so a set of one is its own median
 * and the cap governs. `<ClientMark>` carries the ink treatment, which is what
 * stops a keyed black silhouette rendering invisibly on a near-black card.
 */
export function ClientCard({
  frontmatter,
}: {
  frontmatter: CaseStudyFrontmatter;
}) {
  if (!frontmatter.clientPublic) {
    return (
      <section className={styles.clientSection}>
        <div className={styles.wrap}>
          <div className={styles.clientCard}>
            <div className={styles.clientText}>
              <p className={styles.clientDesc}>
                {frontmatter.region} · {frontmatter.platform}
              </p>
              <span className={styles.clientRegion}>
                Client identity withheld
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.clientSection}>
      <div className={styles.wrap}>
        <div className={styles.clientCard}>
          <ClientMark
            src={clientLogoFor(frontmatter.client)}
            name={clientDisplayNameFor(frontmatter.client)}
            surface="entity"
            className={styles.clientMark}
          />
          <div className={styles.clientText}>
            <p className={styles.clientDesc}>{frontmatter.summary}</p>
            <span className={styles.clientRegion}>{frontmatter.region}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
