"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PetalPlate } from "@/components/ui/PetalPlate";
import { engageCopy, engagementModels } from "@/data/home/engage";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";
import { SectionHead } from "./SectionHead";

/**
 * Four models, contract leading. Vertical master-detail.
 *
 * A selector rail on the left, one detail panel on the right. This replaced a
 * stacked accordion, which made the four models a list of four things to open
 * rather than one choice with four answers — the reader had to open each in turn
 * to compare, and the media pane only ever existed for whichever was open.
 *
 * ONE DOM at both widths, and the layout does the responsive work rather than a
 * hydration switch. Source order is tab, panel, tab, panel — so at mobile the
 * natural flow already IS the stacked accordion the spec asks for, each panel
 * directly under the row that opens it. At desktop the grid lifts every tab into
 * column one and the active panel into column two. Rendering two trees would
 * have duplicated the content for screen readers, and a matchMedia switch would
 * have shifted layout on hydration.
 *
 * Semantics are the EXCLUSIVE DISCLOSURE pattern, not tabs. Tabs were the first
 * attempt and axe rejected them as critical `aria-required-children`: a
 * `role="tablist"` may contain only tabs, and this DOM deliberately interleaves
 * each panel with its own button so mobile gets the accordion for free. Rather
 * than split the DOM to satisfy the role, the roles follow the DOM — which is
 * also the more truthful description, because on mobile this genuinely IS an
 * accordion. So: `aria-expanded` and `aria-controls` per button, a `<section>`
 * per panel carrying the region landmark natively, `hidden` on the closed ones so they add no focus stops, and one
 * open at a time. Every button stays tabbable, as an accordion's should be;
 * Up/Down/Home/End remain as a convenience for the desktop rail.
 *
 * The previous version was four independent <details>, which announced as four
 * unrelated toggles with no stated relationship to the media pane they
 * controlled.
 *
 * Each model keeps its drawn media pane — a PetalPlate seeded on the model's
 * route, hued by POSITION (.amb-N) per the ambient rhythm rule — and one metric
 * callout drawn only from canon §6/§7 terms.
 */
export function Engage() {
  const leadIndex = Math.max(
    0,
    engagementModels.findIndex((m) => m.lead),
  );
  const [active, setActive] = useState(leadIndex);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (i: number) => {
    const next = (i + engagementModels.length) % engagementModels.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    // Vertical orientation, so Up and Down move. Left and Right deliberately do
    // not: at mobile this same control reads as a stacked list.
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusTab(i + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusTab(i - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(engagementModels.length - 1);
        break;
      default:
    }
  };

  return (
    <section className={`${styles.section} ${styles.g2}`} id="engage">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={engageCopy.eyebrow}
          heading={engageCopy.heading}
          lede={engageCopy.lede}
          id="engage-heading"
        />

        <div className={styles.engageSplit}>
          {engagementModels.map((m, i) => {
            const selected = i === active;
            return (
              /* Tab and panel stay adjacent in source, which is what gives the
                 mobile accordion for free. */
              <div key={m.name} className={styles.engagePair}>
                <button
                  type="button"
                  id={`engage-tab-${i}`}
                  aria-expanded={selected}
                  aria-controls={`engage-panel-${i}`}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  className={`${styles.engageTab} ${selected ? styles.engageTabOn : ""}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className={styles.modelNum}>{m.num}</span>
                  <span className={styles.engageTabText}>
                    <span className={styles.modelName}>{m.name}</span>
                    <span className={styles.modelPositioning}>
                      {m.positioning}
                    </span>
                  </span>
                  {m.lead ? (
                    <span className={styles.leadFlag}>Lead</span>
                  ) : null}
                </button>

                {/* <section>, not a div with role="region" — the element carries
                    the landmark natively. Only the open panel is exposed, since
                    the rest are `hidden`, so this adds one landmark and not
                    four. */}
                <section
                  id={`engage-panel-${i}`}
                  aria-labelledby={`engage-tab-${i}`}
                  hidden={!selected}
                  className={`${styles.engagePanel} amb-${i + 1}`}
                >
                  <div className={styles.modelMedia}>
                    <PetalPlate
                      seed={m.href}
                      ratio={0.72}
                      className={styles.modelPlate}
                    />
                  </div>
                  <div className={styles.modelContent}>
                    <p className={styles.modelMetric}>
                      <span className={styles.modelMetricValue}>
                        {m.metric.value}
                      </span>
                      <span className={styles.modelMetricLabel}>
                        {m.metric.label}
                      </span>
                    </p>
                    <p className={styles.rightForLabel}>Right for</p>
                    <ul className={styles.chips}>
                      {m.rightFor.map((c) => (
                        <li key={c} className="role-pill">
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <Link className={styles.btnSecondary} href={m.href}>
                        See how {m.name} works
                        <ArrowGlyph />
                      </Link>
                    </p>
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
