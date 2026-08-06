import type { ResearchChart } from "@/data/research";
import styles from "./Research.module.css";

/**
 * The only chart type in the research family.
 *
 * IT IS A TABLE. The bars are drawn on the rows of a real `<table>` with a
 * real `<caption>`, so a screen reader gets the label and the figure as data
 * and a sighted reader gets the comparison. An SVG chart would need every one
 * of those figures restated in a description, which is a second copy of every
 * number on the page — the defect this whole family is built to avoid.
 *
 * NO PIE, NO STACK, AND NO WAY TO ASK FOR ONE. The skill counts overlap and
 * two bars may legitimately sum past 100%, so any chart type that asserts a
 * whole would be false. `ResearchChart` models no such variant, and the note
 * saying the bars are not parts of a whole is a required field rather than an
 * optional caveat.
 *
 * The bar width is an inline `--bar` custom property rather than an inline
 * colour: the width is data and genuinely varies per row, while the colour
 * comes from the chart's tone and resolves to Layer 1 tokens in the
 * stylesheet. Nothing here carries a hex value.
 */
export function ResearchBars({ chart }: { chart: ResearchChart }) {
  return (
    <figure className={styles.chart} data-tone={chart.tone}>
      <table className={styles.chartTable}>
        <caption className={styles.chartCaption}>{chart.caption}</caption>
        <tbody>
          {chart.bars.map((bar) => {
            /* Clamped so a value above the stated maximum cannot paint past
               the track and silently misrepresent itself. */
            const ratio = Math.max(0, Math.min(1, bar.value / chart.max));
            return (
              <tr
                key={bar.label}
                className={bar.emphasis ? styles.barRowKey : styles.barRow}
              >
                <th scope="row" className={styles.barLabel}>
                  {bar.label}
                </th>
                <td className={styles.barCell}>
                  <span
                    className={styles.barTrack}
                    /* `data-zero` rather than matching "0%" inside the style
                       attribute: React may serialise the custom property with
                       or without a space, so a selector on the attribute text
                       is a guess about a formatter. */
                    data-zero={bar.value === 0 ? "" : undefined}
                    style={
                      { "--bar": `${ratio * 100}%` } as React.CSSProperties
                    }
                  >
                    <span className={styles.barFill} aria-hidden="true" />
                  </span>
                </td>
                <td className={styles.barValue}>{bar.display}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <figcaption className={styles.chartNote}>{chart.note}</figcaption>
    </figure>
  );
}
