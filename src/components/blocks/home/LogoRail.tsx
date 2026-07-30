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
            /* Eager, deliberately. These marks sit high on the page and the
               track is a horizontal marquee: a lazily-loaded mark on the
               duplicated half never enters the viewport by vertical scrolling,
               so it never loads at all — which the served-markup gate correctly
               failed on. Eighteen small marks, and the duplicate half reuses
               the same URLs from cache. */
            <LogoImage src={c.logo} width={120} height={30} priority />
          ) : (
            <span className={styles.wordmark}>{c.name}</span>
          )}
        </li>
      ))}
    </>
  );
}
