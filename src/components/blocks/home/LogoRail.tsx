import { logoRail } from "@/data/home/hero";
import { type Client, getConsentedClients, hasLogoAsset } from "@/lib/clients";
import { markScales } from "@/lib/mark-scale";
import { ClientMark } from "../ClientMark";
import styles from "./Home.module.css";
import { RailViewport } from "./RailViewport";

/**
 * One continuous monochrome moving rail — canon §8 as amended 30 Jul.
 *
 * The enterprise/integrator split survives as data and one caption line, never
 * as two walls. Only names carrying consent render; the loader filters at read
 * time.
 *
 * SINGLE INK, not a filtered tile. Every mark is a true-alpha silhouette emitted
 * by scripts/build-logos.mjs, painted in one theme ink token at one opacity
 * inside a uniform cell at one cap height. It used to be a flattened tile shown
 * through `grayscale()` plus a per-theme `mix-blend-mode`, which is the only
 * thing that could work against a baked background — and it could not give one
 * tone: it left visible plates on any mark whose own ground was off-white or
 * dark, which is what read as "illegible dark blobs".
 *
 * A mark whose source will not key to one clean ink, or which cannot reach a
 * readable cap height in the cell, is NOT shipped as an image at all: the build
 * gate measures both and declines. Sephora, Wickes and Radwell are in that state
 * today.
 *
 * THIS RAIL DROPS THEM RATHER THAN SETTING THEIR NAME. Canon §8's name fallback
 * is right on a card, where the name sits in a text block that already carries
 * words. Here it is wrong: a row of silhouettes with three words threaded
 * through it reads as three marks that failed to load, and the rail's whole
 * claim is that these are marks. Consent is not the issue and `consentOnFile`
 * stays true for all three; only the asset is absent, and one transparent file
 * each puts them back with no code change. The other surfaces keep the name.
 *
 * Motion: one slow translateX loop over a duplicated track, paused on hover, on
 * focus-within, by a discreet control, and by prefers-reduced-motion. Marks are
 * area-matched rather than height-matched, so no mark dominates the row.
 */
export function LogoRail() {
  const clients: Client[] = [
    ...getConsentedClients("enterprise"),
    ...getConsentedClients("integrators"),
  ].filter((c) => hasLogoAsset(c.logo));

  /* The whole rail's mark set, so every mark is normalised against the same
     median. Ink-area normalisation is a property of the set: a mark has no
     correct size until you know what it sits beside. */
  const set = clients
    .map((c) => c.logo)
    .filter((logo): logo is string => Boolean(logo));

  /* Round 14: the viewport's own height used to come free from `.logo`'s
     68px cell — fine until a padded asset's full image box (Wipro, 56.4%
     padding, solves to 94px here) needed more room than the cell and
     `overflow: hidden` clipped real ink off the bottom. Deriving the
     viewport's height from the same computation that sizes every mark means
     a future padded asset is automatically safe rather than a magic number
     someone has to remember to raise. */
  const maxMarkHeight = Math.max(
    68,
    ...[...markScales(set, "rail").values()].map((s) => s.height),
  );

  return (
    <section
      className={styles.rail}
      aria-label="Clients and integrators"
      style={{ "--rail-max-h": `${maxMarkHeight}px` } as React.CSSProperties}
    >
      {/* Round 14: no `.wrap` here — the label is full-width, left-aligned to
          the page edge via its own padding, matching the edge-to-edge track
          beneath it rather than the narrower centred content column. */}
      <p className={styles.railLabel}>{logoRail.mergedLabel}</p>
      {/* Two identical tracks: the loop translates by exactly half its width, so
          the seam never shows. The second is aria-hidden decoration. */}
      <RailViewport>
        <LogoItems clients={clients} />
        <LogoItems clients={clients} ariaHidden />
      </RailViewport>
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
  /* The whole rail's mark set, so every mark is normalised against the same
     median. Ink-area normalisation is a property of the set: a mark has no
     correct size until you know what it sits beside. Every client reaching here
     has an asset, filtered in LogoRail above. */
  const set = clients
    .map((c) => c.logo)
    .filter((logo): logo is string => Boolean(logo));

  return (
    <>
      {clients.map((c) => (
        <li
          key={`${c.name}${ariaHidden ? "-dup" : ""}`}
          className={`${styles.logo}${ariaHidden ? ` ${styles.logoDup}` : ""}`}
          aria-hidden={ariaHidden || undefined}
        >
          {/* The FIRST track is eager and the duplicate is not, which is the
              only combination that satisfies both gates. Lazy on the first
              track meant marks on a horizontally-translated marquee never
              entered the viewport and so never loaded at all. Eager on BOTH
              put 36 images in front of the `load` event and timed out CI's
              reduced-motion navigation at 30s. The duplicate is aria-hidden
              decoration sharing the same URLs, so it paints from cache without
              ever blocking load. */}
          <ClientMark
            src={c.logo}
            name={c.name}
            surface="rail"
            set={set}
            decorative={ariaHidden}
            eager={!ariaHidden}
          />
        </li>
      ))}
    </>
  );
}
