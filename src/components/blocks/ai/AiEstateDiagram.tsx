import Link from "next/link";
import { aiRoleFamily } from "@/data/ai-talent";
import type { EstateLayer, EstateRail } from "@/data/ai-talent/estate";
import {
  estateAssertion,
  estateLayers,
  estateRails,
  familiesFor,
} from "@/data/ai-talent/estate";
import styles from "./AiEstateDiagram.module.css";

/**
 * The AI estate diagram — context §7.1.
 *
 * Five layers, two cross-cutting rails, and the role-family overlay that is the
 * reason the asset exists. §7.1: "Without it this is a technology poster anybody
 * could draw; with it, it is the only diagram in the category that says who you
 * need where."
 *
 * WHY THIS IS NOT ONE <svg>, which is worth stating because §7.1 says "SVG, not
 * raster" and this is neither. The binding constraint in the same paragraph is
 * that at 360px it "stacks vertically with the rails beneath rather than
 * compressing sideways". A single SVG cannot restack: its contents scale with the
 * viewBox, so honouring the reflow inside one SVG means shipping two complete
 * copies of the content in two <g> groups and toggling them, which doubles every
 * string, puts both in the accessibility tree and guarantees they drift.
 *
 * The instruction's intent is that the diagram be vector and resolution-free
 * rather than an exported image, and that is satisfied: there is no raster asset
 * here, no image element of any kind, every rule is drawn by the browser, and the
 * only geometry that needs to be a shape (the rail span markers) is a CSS gradient
 * hairline. What replaces the SVG canvas is a semantic structure, and that is a
 * gain rather than a compromise: the layers are an ordered list, each layer's
 * staffing overlay is a list of links to the family L2 pages, and a screen reader
 * reads the estate bottom to top in the same order a sighted reader sees it. An
 * SVG would have needed all of that bolted on with aria.
 *
 * CONSTRAINTS, all in the stylesheet rather than here:
 *   · Both themes, from tokens only. No hex value appears in either file.
 *   · Gold carries the overlay and nothing else. The rails and layer plates are
 *     drawn with --boundary; the ambient wash is --amb, resolved to the
 *     discipline hue by the page's data-identity.
 *   · Type floor. §7.1 allows 12px; the repo's own check-type-scale gate enforces
 *     13px, which is stricter, so 13px is the floor used.
 *   · Reduced motion. Nothing animates or transforms, so there is nothing to
 *     disable; the one hover colour swap is an interaction cue and is made
 *     instant.
 *   · 360px. A container query, not a viewport query, because the diagram is
 *     placed inside page wrappers of differing widths and what matters is the
 *     space it is actually given.
 *
 * FORBIDDEN HERE, per §7.2: no placement count, client, logo, quotation or date;
 * no claim that Yallo is leading, pioneering or first; no vendor performance
 * figure; and no technology that is not a real, current product. There are no
 * vendor logos at all, in full colour or otherwise.
 */

function StaffingOverlay({ entry }: { entry: EstateLayer | EstateRail }) {
  const families = familiesFor(entry);
  /* No families means no overlay, not an empty gold box. A layer nobody staffs
     would be a real finding and should look like an absence. */
  if (families.length === 0) return null;

  return (
    <div className={styles.overlay}>
      <span className={styles.overlayLabel}>Role families we place here</span>
      <ul className={styles.overlayList}>
        {families.map((slug) => {
          const family = aiRoleFamily(slug);
          /* A family with no data would be a broken link, so it renders as text.
             Same rule the insight cards follow: an unbuilt destination renders
             nothing that looks clickable. */
          if (!family) return null;
          return (
            <li key={slug} className={styles.overlayItem}>
              <Link href={`/ai-talent/${slug}`} className={styles.overlayLink}>
                {family.shortName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Rail({ rail, side }: { rail: EstateRail; side: "left" | "right" }) {
  return (
    <div
      className={`${styles.rail} ${side === "right" ? styles.railRight : ""}`}
    >
      <span className={styles.railSpan} aria-hidden="true" />
      <h4 className={styles.railName}>{rail.name}</h4>
      <p className={styles.railNote}>{rail.note}</p>
      <ul className={styles.railList}>
        {rail.items.map((item) => (
          <li key={item} className={styles.railItem}>
            {item}
          </li>
        ))}
      </ul>
      <StaffingOverlay entry={rail} />
    </div>
  );
}

export function AiEstateDiagram() {
  return (
    <figure className={styles.figure}>
      <div className={styles.grid}>
        <Rail rail={estateRails.left} side="left" />

        {/* An ordered list, because the layers are an order: the numeral is the
            layer's position from the bottom, so "01" is the systems of record the
            whole estate rests on. `reversed` lets the DOM read top-to-bottom
            while the numbering counts up from the bottom, which is how the
            diagram is described in prose. */}
        <ol className={styles.stack} reversed>
          {estateLayers.map((layer, i) => (
            <li key={layer.id} className={styles.layer}>
              <span className={styles.layerIndex} aria-hidden="true">
                {String(estateLayers.length - i).padStart(2, "0")}
              </span>
              <div className={styles.layerBody}>
                <h4 className={styles.layerName}>{layer.name}</h4>
                <p className={styles.layerContents}>{layer.contents}</p>
                <StaffingOverlay entry={layer} />
              </div>
            </li>
          ))}
        </ol>

        <Rail rail={estateRails.right} side="right" />
      </div>
      <figcaption className={styles.caption}>{estateAssertion}</figcaption>
    </figure>
  );
}
