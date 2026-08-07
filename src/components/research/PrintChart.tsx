import type { ResearchFamily } from "@/data/research/dataset";
import styles from "./PrintChart.module.css";

/**
 * The research document's figures, drawn rather than written out in prose.
 *
 * WHY A DOT PLOT AND NOT A BAR CHART, and why the shape is forced rather than
 * chosen. The corpus has two rules about how its numbers may be drawn, stated
 * in the methodology and repeated in context-round21-scope.md §2.1:
 *
 *   1. No chart places two families on one axis. A family's baseline reflects
 *      how wide the title net was, not how large a market is, so the pools are
 *      not comparable to each other. Hence ONE chart per family, and the family
 *      is named on the chart rather than assumed.
 *   2. Overlapping shares are never drawn as parts of a whole. One professional
 *      declares several of these skills, so the shares within a family are
 *      independent and can sum past 100%. A stacked bar or a pie would assert
 *      something false about them. Each skill therefore gets its own row and
 *      its own baseline of zero.
 *
 * What the reader is meant to see is the GAP — the same skill declared at two
 * rates in two markets — so the mark is the distance between two points, with
 * the connecting rule carrying the meaning and the dots carrying the values.
 *
 * NO VALUE IS TYPED. Everything comes off the `ResearchFamily` passed in, which
 * resolves through src/data/research/dataset.ts, which is generated from the
 * extract. Change the extract and the figure moves with the prose, because
 * there is only one number.
 *
 * VECTOR, AND PLAIN SVG. context-round21-scope.md §2.3 requires vector charts
 * in the PDF, which rules out a canvas-based library, and a charting dependency
 * would bring its own type scale and palette into a document whose whole
 * problem was looking like something other than itself.
 */

/**
 * Geometry, in SVG units that are DELIBERATELY about 1:1 with CSS pixels once
 * the figure is laid out on A4. An SVG scaled down would shrink its own type
 * below the floor the type gate enforces on the stylesheet, and the gate reads
 * the declaration rather than the painted result — so the honest fix is to draw
 * at the size it prints at, not to declare 13px and render 10.
 *
 * A4 is 210mm; the sheet's side margins take 32mm and the figure's padding and
 * border about 42px, which leaves roughly 630px of drawing width.
 */
/**
 * Left gutter for skill labels, set from a MEASUREMENT rather than an estimate.
 *
 * Measured in the browser at the document's own 13px body face, the longest
 * label in the corpus is "Commerce Cloud (SFCC+B2B+B2C)" at 223 units, then
 * "Security (Security+Auth+GRC)" at 188. The first draft guessed 196 and the
 * rendered page showed the Commerce Cloud row's dots sitting on top of its own
 * name. 240 clears the longest with a 17-unit gap to the axis.
 *
 * A longer skill label than 228 units would collide again. If the extract grows
 * one, the fix is this number, and the rendered pages are where it shows.
 */
const LABEL_W = 240;
/**
 * Right gutter, holding BOTH values in a fixed column.
 *
 * The first draft labelled the dots themselves, and the rendered pages showed
 * why that fails on this data: on rows where the two markets are within a point
 * of each other the two labels collide, so only one was drawn, and the reader
 * saw a single number with nothing to say which market it belonged to. A fixed
 * column always shows both, always in the same order, and never collides.
 */
const VALUE_W = 96;
const ROW_H = 32;
const TOP = 38;
const WIDTH = 640;

function niceCeiling(max: number): number {
  if (max <= 10) return 10;
  if (max <= 25) return 25;
  if (max <= 50) return 50;
  if (max <= 75) return 75;
  return 100;
}

export function PrintChart({ family }: { family: ResearchFamily }) {
  const skills = family.skills;
  const peak = Math.max(...skills.flatMap((s) => [s.ratioUk, s.gulfMean]));
  const ceiling = niceCeiling(peak);
  const plotW = WIDTH - LABEL_W - VALUE_W;
  const height = TOP + skills.length * ROW_H + 26;
  const x = (pct: number) => LABEL_W + (pct / ceiling) * plotW;
  const ticks = [0, ceiling / 2, ceiling];

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        <span className={styles.family}>{family.family}</span>
        <span className={styles.what}>
          Share of each market&rsquo;s pool declaring the skill
        </span>
      </figcaption>

      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={`${family.family}: the share of the UK pool and of the Gulf pool declaring each named skill.`}
      >
        <title>
          {family.family}: share of the UK pool and of the Gulf pool declaring
          each named skill
        </title>

        {/* Axis. Zero is drawn as a real line because every row's baseline is
            zero — these are independent shares, not segments of a total. */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              y1={TOP - 14}
              x2={x(t)}
              y2={TOP + skills.length * ROW_H - 10}
              className={t === 0 ? styles.axisZero : styles.axisTick}
            />
            <text x={x(t)} y={TOP - 20} className={styles.tickLabel}>
              {t}%
            </text>
          </g>
        ))}

        {skills.map((skill, i) => {
          const y = TOP + i * ROW_H;
          const uk = x(skill.ratioUk);
          const gulf = x(skill.gulfMean);
          return (
            <g key={skill.label}>
              <text x={0} y={y + 4} className={styles.rowLabel}>
                {skill.label}
              </text>
              <line
                x1={Math.min(uk, gulf)}
                y1={y}
                x2={Math.max(uk, gulf)}
                y2={y}
                className={styles.connector}
              />
              {/* Gulf first, UK over it. Where the two markets are within a
                  point of each other the marks overlap, and the outlined UK dot
                  stays legible on top of the filled one where the reverse order
                  hid it completely. */}
              <circle cx={gulf} cy={y} r={5} className={styles.dotGulf} />
              <circle cx={uk} cy={y} r={5} className={styles.dotUk} />
              <text
                x={WIDTH - VALUE_W + 10}
                y={y + 4}
                className={styles.valueLabel}
              >
                {skill.ratioUk.toFixed(1)} / {skill.gulfMean.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>

      <p className={styles.legend}>
        <span className={styles.keyUk} aria-hidden="true" /> United Kingdom
        <span className={styles.keyGap} />
        <span className={styles.keyGulf} aria-hidden="true" /> Gulf
      </p>
      <p className={styles.baseline}>
        Gulf is the unweighted mean of the Saudi Arabian and Emirati shares.
        Values read UK&nbsp;/&nbsp;Gulf, as percentages. Pools measured:{" "}
        {family.baseline.uk.toLocaleString("en-GB")} in the United Kingdom,{" "}
        {family.baseline.saudi.toLocaleString("en-GB")} in Saudi Arabia,{" "}
        {family.baseline.uae.toLocaleString("en-GB")} in the United Arab
        Emirates. Shares are independent and overlap.
      </p>
    </figure>
  );
}
