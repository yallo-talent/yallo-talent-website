import { LogoImage } from "@/components/blocks/home/LogoImage";
import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import styles from "./CaseStudyDetail.module.css";
import { findClientMark, hasLogoAsset } from "./client-lookup";

/**
 * Block 5. Only what the published source says: the client's own mark (or,
 * failing an asset, the register's display name) when the study names the
 * client; an anonymised descriptor when it does not.
 *
 * Uses the site's existing `LogoImage`, not `<ClientMark>` — that component
 * is A's, does not exist yet in this worktree (A's branch merges
 * separately), and context-round7-rulings.md §1.2 is explicit that this
 * session imports it and never writes it. `LogoImage` is the generic,
 * already-shared primitive underneath it; swapping this one call site to
 * `<ClientMark>` once A's branch lands is a one-line change, not a fork.
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

  const match = findClientMark(frontmatter.client);
  const showLogo = match?.logo && hasLogoAsset(match.logo);
  const displayName = match?.name ?? frontmatter.client;

  return (
    <section className={styles.clientSection}>
      <div className={styles.wrap}>
        <div className={styles.clientCard}>
          <span className={styles.clientMark}>
            {showLogo && match?.logo ? (
              <LogoImage
                src={match.logo}
                alt={displayName}
                width={140}
                height={36}
              />
            ) : (
              <span className={styles.clientWordmark}>{displayName}</span>
            )}
          </span>
          <div className={styles.clientText}>
            <p className={styles.clientDesc}>{frontmatter.summary}</p>
            <span className={styles.clientRegion}>{frontmatter.region}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
