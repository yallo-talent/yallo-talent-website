import Link from "next/link";
import { publishedPaths } from "@/lib/published-routes";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";

/**
 * A call to action whose interactivity is DERIVED from whether its destination
 * is published, not from a boolean somebody has to remember to flip.
 *
 * WHY THIS EXISTS. Three cards on the homepage — the Blueprint, the Atlas and
 * the AI practice — rendered as grey text reading "…, in preparation" while all
 * three destinations were live, published, in the sitemap and in llms.txt. The
 * copy was true when it was written: `IntelligenceAsset.published` was seeded
 * `false` in the same commit that shipped the cards, and the routes arrived
 * later in a different one. Nothing connected the two, so the homepage went on
 * telling every visitor that three published assets did not exist yet.
 *
 * That is the same class of defect this repository has paid for repeatedly and
 * fixed the same way each time: a fact written down twice, where only one copy
 * gets updated. `publishedPaths()` is the single enumeration sitemap.ts, the OG
 * route and llms.txt already share; a card reads it too, and the flag cannot go
 * stale because there is no longer a flag.
 *
 * The in-preparation state is kept, deliberately. An asset genuinely not built
 * yet should say so rather than link nowhere, which is what `.unbuilt` and
 * `.unbuiltFlag` were for. It is now reached by the destination being absent
 * from the published set, which is the condition it always claimed to describe.
 */
export function AssetCta({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  /* Path-only comparison, and the published set is path-only by construction.
     A href carrying a hash or a query is matched on its path so an anchor into
     a live page is not read as an unpublished route. */
  const path = href.split(/[?#]/)[0] ?? href;
  const live = publishedPaths().includes(path);

  if (!live) {
    return <span className={styles.unbuiltFlag}>{label}, in preparation</span>;
  }

  return (
    <Link
      className={
        className ? `${styles.btnSecondary} ${className}` : styles.btnSecondary
      }
      href={href}
    >
      {label}
      <ArrowGlyph />
    </Link>
  );
}
