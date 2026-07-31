import { logoRail } from "@/data/home/hero";
import { type Client, getConsentedClients, hasLogoAsset } from "@/lib/clients";
import styles from "./Home.module.css";
import { RailViewport } from "./RailViewport";
import { LogoImage } from "./LogoImage";

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
 * readable cap height in the cell, is NOT shipped as an image at all — the build
 * gate measures both and declines. Those render as the client's NAME, per canon
 * §8: never a padded box, never a redrawn mark. `hasLogoAsset` is the check,
 * because clients.yaml still names them; only the asset is absent.
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
      <RailViewport caption={logoRail.integratorCaption}>
        <LogoItems clients={clients} />
        {/* The loop's second half. Hidden from AT and from reduced motion. */}
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
  return (
    <>
      {clients.map((c) => (
        <li
          key={`${c.name}${ariaHidden ? "-dup" : ""}`}
          className={`${styles.logo}${ariaHidden ? ` ${styles.logoDup}` : ""}`}
          aria-hidden={ariaHidden || undefined}
        >
          {hasLogoAsset(c.logo) && c.logo ? (
            /* The FIRST track is eager and the duplicate is not, which is the
               only combination that satisfies both gates. Lazy on the first
               track meant marks on a horizontally-translated marquee never
               entered the viewport and so never loaded at all. Eager on BOTH
               put 36 images in front of the `load` event and timed out CI's
               reduced-motion navigation at 30s. The duplicate is aria-hidden
               decoration sharing the same URLs, so it paints from cache without
               ever blocking load. */
            /* 208x37, the box the mark actually occupies — not 120x26, which
               is the geometry the rail had BEFORE it was enlarged. These props
               are not decoration: next/image builds its srcset from the
               declared width, so a stale 120 made the optimiser serve a
               variant sized for a box 42% narrower than the real one, and
               every mark resampled up to fill 208px. The source PNGs were
               never the problem — build-logos.mjs emits them 112px tall and
               they DOWNSCALE 0.66x — the request was.
               Width is the cell's inner max; .logo img keeps width:auto, so
               the intrinsic aspect still governs what is painted. */
            <LogoImage
              src={c.logo}
              /* The name, not an empty string — and empty on the duplicate half
                 only, which is aria-hidden decoration sharing the same URLs. */
              alt={ariaHidden ? "" : c.name}
              width={208}
              height={37}
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
