import {
  renderBlock,
  type TiptapNode,
} from "@/components/blocks/editorial/TiptapBody";
import { PetalPlate } from "@/components/ui/PetalPlate";
import styles from "./CaseStudyDetail.module.css";
import { parseMovements } from "./movement-parser";

/**
 * Block 3. The four movements: fixed mono label, an optional subhead lifted
 * verbatim from the published source's own H3, then the section's own body.
 * A movement with no matching source section does not render — see
 * `movement-parser.ts` for the parsing rule and why "WHAT YALLO DID" became
 * "THE APPROACH".
 *
 * ROUND 25: THE BODY IS A TIPTAP DOCUMENT, rendered through the allow-list in
 * `TiptapBody.tsx`, where it was an MDX string rendered through `MDXRemote`.
 * Canon A1 moved these bodies into the database. Nothing else about this
 * component changed, and that was the point: `scripts/verify-import.mjs`
 * compares this template's output against what production serves, byte for
 * byte, so any liberty taken here would have shown up as a divergence rather
 * than as an improvement.
 */
export function Movements({
  body,
  slug,
}: {
  body: { content?: TiptapNode[] } | null;
  slug: string;
}) {
  const movements = parseMovements(body);
  if (movements.length === 0) return null;

  return (
    <section className={styles.movements}>
      <div className={`${styles.wrap} ${styles.measure}`}>
        {movements.map((m, i) => (
          <div key={m.key} className={styles.movement}>
            <span className={styles.movementLabel}>{m.label}</span>
            {m.subhead && (
              <h2 className={styles.movementSubhead}>{m.subhead}</h2>
            )}
            <div className={styles.movementBody}>
              {m.body.map((n, j) => renderBlock(n, `${m.key}-${j}`))}
            </div>
            {i === 1 && (
              <div className={styles.interlude} aria-hidden="true">
                <PetalPlate seed={`${slug}-interlude`} ratio={0.16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
