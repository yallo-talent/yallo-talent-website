"use client";

import Link from "next/link";
import { type CSSProperties, useState } from "react";
import type { RoleFamilySlug } from "@/data/ai-talent/stacks";
import styles from "./AiEstateDiagram.module.css";

/**
 * The estate band's rendering and its one interaction.
 *
 * WHY THIS IS A SEPARATE FILE FROM `AiEstateDiagram`. Every derivation — the
 * platform desks from `platformsIndex`, the tools per zone, the families per
 * zone — happens on the server in that file and arrives here as plain data.
 * This component holds markup and a single `useState`, so the client bundle
 * carries the interaction and none of the taxonomy.
 *
 * THE INTERACTION, per §3.4. Focusing or hovering a role chip lights the tools
 * that family is screened against, across every layer and both rails. That is
 * the role-to-tool leg of the three-way map made legible without a fourth band.
 *
 * Its three conditions, and how each is met:
 *
 *   Keyboard reachable. The chips are links to the family's own L2, so they are
 *   in the tab order already; `onFocus`/`onBlur` light the same tools `onMouseEnter`
 *   does. Nothing here is mouse-only.
 *
 *   Paired with a non-motion cue, per canon §5's A5. There is no transform, no
 *   shadow and no transition on any lit element — the cue is a ground shift and
 *   a gold hairline, which survive `prefers-reduced-motion` because they never
 *   depended on motion.
 *
 *   Every fact readable with the interaction never triggered. Lighting only
 *   ADDS emphasis. No tool is dimmed, hidden or moved when another family is
 *   active, so a reader who never hovers anything sees the complete estate at
 *   full legibility. It is an affordance over the data, never the route to it —
 *   which is also why the accessibility tree does not change on hover.
 *
 * Gold on the lit state is deliberate and inside canon rather than an exception
 * to §3.2's "role chips are the only gold". That clause governs the RESTING
 * band, where everything being gold-outlined is what stopped the roles reading
 * as the product. Canon §5 is the stronger constraint here: gold is the only
 * colour that is ever interactive, so a non-gold interaction highlight would
 * breach it. The lit tools wear the chip's own colour because they are showing
 * that chip's reach.
 */

export interface ToolView {
  name: string;
  /** Families screened against this tool. Drives the lit test. */
  families: RoleFamilySlug[];
}

export interface TierView {
  tier: "bought" | "engineered";
  entries: ToolView[];
}

export interface ChipView {
  slug: RoleFamilySlug;
  label: string;
  href: string;
}

export interface PlatformDeskView {
  slug: string;
  label: string;
  href: string;
  published: boolean;
}

export interface ZoneView {
  id: string;
  name: string;
  note: string;
  tiers: TierView[];
  chips: ChipView[];
  /** Named items that are not tools — the governance frameworks. */
  items?: string[];
  /** Layer 01 only, derived from `platformsIndex`. */
  desks?: PlatformDeskView[];
  /** L2 only: false means the role family does not work at this zone. */
  lit: boolean;
}

export interface EstateModel {
  layers: ZoneView[];
  railLeft: ZoneView;
  railRight: ZoneView;
  assertion: string;
  /** Set on an L2. The chip for this family renders as current, not a link. */
  family: RoleFamilySlug | null;
}

/** The label above the engineered line. Bought needs none: it leads. */
const SECOND_LINE = "Also screened against";

function Tools({
  tiers,
  active,
}: {
  tiers: TierView[];
  active: RoleFamilySlug | null;
}) {
  if (tiers.length === 0) return null;
  return (
    <div className={styles.tools}>
      {tiers.map((t) => (
        <div key={t.tier} className={styles.tier}>
          {t.tier === "engineered" && (
            <p className={styles.tierLabel}>{SECOND_LINE}</p>
          )}
          <ul
            className={
              t.tier === "bought" ? styles.toolListLead : styles.toolListSecond
            }
          >
            {t.entries.map((e) => (
              <li
                key={e.name}
                className={styles.tool}
                data-lit={
                  active !== null && e.families.includes(active)
                    ? "true"
                    : undefined
                }
              >
                {e.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Chips({
  chips,
  current,
  onActive,
}: {
  chips: ChipView[];
  current: RoleFamilySlug | null;
  onActive: (slug: RoleFamilySlug | null) => void;
}) {
  if (chips.length === 0) return null;
  return (
    <div className={styles.overlay}>
      <span className={styles.overlayLabel}>Role families we place here</span>
      <ul className={styles.chipList}>
        {chips.map((c) => {
          /* On an L2 the page's own family is not a link to the page you are
             already on. It still lights its tools, so the affordance is not
             lost — it just stops being navigation. */
          const isCurrent = c.slug === current;
          const handlers = {
            onMouseEnter: () => onActive(c.slug),
            onMouseLeave: () => onActive(null),
            onFocus: () => onActive(c.slug),
            onBlur: () => onActive(null),
          };
          return (
            <li key={c.slug}>
              {isCurrent ? (
                /* A button rather than a span with a tabIndex. It is genuinely
                   interactive — the click lights this family's tools, which is
                   the only way a touch user reaches the affordance at all, since
                   there is no hover and focus follows the tap. */
                <button
                  type="button"
                  className={styles.chip}
                  data-current="true"
                  aria-current="page"
                  onClick={() => onActive(c.slug)}
                  {...handlers}
                >
                  {c.label}
                </button>
              ) : (
                <Link className={styles.chip} href={c.href} {...handlers}>
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Zone({
  zone,
  index,
  total,
  active,
  current,
  onActive,
}: {
  zone: ZoneView;
  /** Undefined on a rail: a rail has no layer numeral. */
  index?: number;
  total?: number;
  active: RoleFamilySlug | null;
  current: RoleFamilySlug | null;
  onActive: (slug: RoleFamilySlug | null) => void;
}) {
  const numeral =
    index !== undefined && total !== undefined
      ? String(total - index).padStart(2, "0")
      : null;

  return (
    <>
      {numeral && (
        <span className={styles.layerIndex} aria-hidden="true">
          {numeral}
        </span>
      )}
      <div className={styles.zoneBody}>
        <h4 className={styles.zoneName}>{zone.name}</h4>
        <p className={styles.zoneNote}>{zone.note}</p>

        {/* Layer 01. The names ARE the links: this is the join to the platform
            desks, so making it a row of buttons somewhere else was one indirection
            too many. An unpublished desk renders as text, never as a dead link. */}
        {zone.desks && (
          <ul className={styles.deskList}>
            {zone.desks.map((d) => (
              <li key={d.slug}>
                {d.published ? (
                  <Link className={styles.desk} href={d.href}>
                    {d.label}
                  </Link>
                ) : (
                  <span className={styles.desk}>{d.label}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* The governance frameworks. Named, never interpreted. */}
        {zone.items && (
          <ul className={styles.toolListLead}>
            {zone.items.map((i) => (
              <li key={i} className={styles.tool}>
                {i}
              </li>
            ))}
          </ul>
        )}

        <Tools tiers={zone.tiers} active={active} />
        <Chips chips={zone.chips} current={current} onActive={onActive} />
      </div>
    </>
  );
}

export function AiEstateBand({ model }: { model: EstateModel }) {
  const [active, setActive] = useState<RoleFamilySlug | null>(null);

  return (
    <figure className={styles.figure}>
      {/* The layer count reaches the stylesheet as a custom property so the
          rails can span an explicit row track set. Writing `repeat(5, ...)` in
          the CSS would silently break the span the day a sixth layer is
          ratified, and the span is the band's whole argument for the rails. */}
      <div
        className={styles.grid}
        style={{ "--layers": model.layers.length } as CSSProperties}
      >
        <div
          className={`${styles.rail} ${styles.railLeft} amb-1`}
          data-dim={model.railLeft.lit ? undefined : "true"}
        >
          <span className={styles.railSpan} aria-hidden="true" />
          <Zone
            zone={model.railLeft}
            active={active}
            current={model.family}
            onActive={setActive}
          />
        </div>

        {model.layers.map((zone, i) => (
          <div
            key={zone.id}
            className={`${styles.layer} amb-1`}
            /* --tone is the ladder step: half the governed ambient alpha at the
               top, the full governed alpha at the bottom, because layer 01 is
               the argument the whole stack rests on. `.amb-1` supplies the HUE —
               mulberry, via the page's data-identity — so no colour is named
               here. The stylesheet records why the positional ladder could not
               supply the step and why 1.0 is the ceiling. */
            style={{ "--tone": 0.5 + i * 0.125 } as CSSProperties}
            data-dim={zone.lit ? undefined : "true"}
          >
            <Zone
              zone={zone}
              index={i}
              total={model.layers.length}
              active={active}
              current={model.family}
              onActive={setActive}
            />
          </div>
        ))}

        <div
          className={`${styles.rail} ${styles.railRight} amb-1`}
          data-dim={model.railRight.lit ? undefined : "true"}
        >
          <span className={styles.railSpan} aria-hidden="true" />
          <Zone
            zone={model.railRight}
            active={active}
            current={model.family}
            onActive={setActive}
          />
        </div>
      </div>
      <figcaption className={styles.caption}>{model.assertion}</figcaption>
    </figure>
  );
}
