import { MDXRemote } from "next-mdx-remote/rsc";
import { PetalPlate } from "@/components/ui/PetalPlate";
import styles from "./CaseStudyDetail.module.css";
import { parseMovements } from "./movement-parser";

/**
 * Block 3. The four movements: fixed mono label, an optional subhead lifted
 * verbatim from the published source's own H3, then the section's own body.
 * A movement with no matching source section does not render — see
 * `movements.ts` for the parsing rule and why "WHAT YALLO DID" became
 * "THE APPROACH".
 */
export function Movements({ body, slug }: { body: string; slug: string }) {
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
              <MDXRemote source={m.body} />
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
