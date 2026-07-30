"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PetalPlate } from "@/components/ui/PetalPlate";
import { engageCopy, engagementModels } from "@/data/home/engage";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";
import { SectionHead } from "./SectionHead";

/**
 * Four models, contract leading. Exclusive accordion with a media pane.
 *
 * Native details/summary with the `name` attribute, which gives single-open
 * behaviour without JS in current engines; the effect below is the fallback
 * for engines that ignore it. Contract is open by default because it is the
 * lead motion.
 *
 * Each model carries a drawn media pane — a PetalPlate seeded on the model's
 * route, hued by POSITION (.amb-N), per the ambient rhythm rule — and one
 * metric callout drawn only from canon §6/§7 terms.
 */
export function Engage() {
  const host = useRef<HTMLDivElement>(null);

  // Fallback exclusivity for engines without <details name>.
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const all = [...root.querySelectorAll("details")];
    const onToggle = (e: Event) => {
      const opened = e.target as HTMLDetailsElement;
      if (!opened.open) return;
      for (const d of all) if (d !== opened && d.open) d.open = false;
    };
    for (const d of all) d.addEventListener("toggle", onToggle);
    return () => {
      for (const d of all) d.removeEventListener("toggle", onToggle);
    };
  }, []);

  return (
    <section className={`${styles.section} ${styles.g2}`} id="engage">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={engageCopy.eyebrow}
          heading={engageCopy.heading}
          lede={engageCopy.lede}
          id="engage-heading"
        />

        <div className={styles.accordion} ref={host}>
          {engagementModels.map((m, i) => (
            <details
              key={m.name}
              className={`${styles.model} amb-${i + 1}`}
              open={m.lead}
              name="engage"
            >
              <summary className={styles.modelSummary}>
                <span className={styles.modelNum}>{m.num}</span>
                <span>
                  <span className={styles.modelName}>{m.name}</span>
                  <span className={styles.modelPositioning}>
                    {m.positioning}
                  </span>
                </span>
                {m.lead ? <span className={styles.leadFlag}>Lead</span> : null}
                <span className={styles.chevron} aria-hidden="true" />
              </summary>

              <div className={styles.modelBody}>
                <div className={styles.modelMedia}>
                  <PetalPlate
                    seed={m.href}
                    ratio={0.72}
                    className={styles.modelPlate}
                  />
                  <p className={styles.modelMetric}>
                    <span className={styles.modelMetricValue}>
                      {m.metric.value}
                    </span>
                    <span className={styles.modelMetricLabel}>
                      {m.metric.label}
                    </span>
                  </p>
                </div>
                <div className={styles.modelContent}>
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
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
