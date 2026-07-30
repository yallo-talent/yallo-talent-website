import { logoRail } from "@/data/home/hero";
import { type Client, getConsentedClients } from "@/lib/clients";
import styles from "./Home.module.css";
import { LogoImage } from "./LogoImage";

/**
 * One continuous monochrome moving rail — canon §8 as amended 30 Jul.
 *
 * The enterprise/integrator split survives as data and one caption line, never
 * as two walls. Every mark renders through the uniform monochrome treatment
 * (`--mark-mono`, silhouette per theme) at 72% opacity, never on a white card.
 * Only names carrying consent render; the loader filters at read time. A
 * consented client with no logo file renders as a wordmark rather than being
 * substituted or dropped.
 *
 * Motion: one slow translateX loop over a duplicated track. Pauses on hover.
 * Under `prefers-reduced-motion` the duplicate is hidden and the track wraps
 * into a static wall — no motion, nothing lost.
 */
export function LogoRail() {
  const clients: Client[] = [
    ...getConsentedClients("enterprise"),
    ...getConsentedClients("integrators"),
  ];

  return (
    <section className={styles.rail} aria-label="Clients and integrators">
      <div className={styles.wrap}>
        <p className={styles.railLabel}>{logoRail.mergedLabel}</p>
      </div>
      <div className={styles.railViewport}>
        <ul className={styles.railTrack}>
          <LogoItems clients={clients} />
          {/* The loop's second half. Hidden from AT and from reduced motion. */}
          <LogoItems clients={clients} ariaHidden />
        </ul>
      </div>
      <div className={styles.wrap}>
        <p className={styles.railCaption}>{logoRail.integratorCaption}</p>
      </div>
    </section>
  );
}

function LogoItems({
  clients,
  ariaHidden,
}: {
  clients: Client[];
  ariaHidden?: boolean;
}) {
  return (
    <>
      {clients.map((c) => (
        <li
          key={`${c.name}${ariaHidden ? "-dup" : ""}`}
          className={`${styles.logo}${ariaHidden ? ` ${styles.logoDup}` : ""}`}
          aria-hidden={ariaHidden || undefined}
        >
          {c.logo ? (
            /* The FIRST track is eager and the duplicate is not, which is the
               only combination that satisfies both gates. Lazy on the first
               track meant marks on a horizontally-translated marquee never
               entered the viewport and so never loaded at all. Eager on BOTH
               put 36 images in front of the `load` event and timed out CI's
               reduced-motion navigation at 30s. The duplicate is aria-hidden
               decoration sharing the same URLs, so it paints from cache without
               ever blocking load. */
            <LogoImage
              src={c.logo}
              width={120}
              height={30}
              eager={!ariaHidden}
            />
          ) : (
            <span className={styles.wordmark}>{c.name}</span>
          )}
        </li>
      ))}
    </>
  );
}
