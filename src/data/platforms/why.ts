import type { WhyPoint } from "@/components/blocks/platform/WhyRail";
import { publishedFigure } from "@/data/metrics";
import type { PlatformCoverage } from "@/data/platforms/derive";
import { ENTITY_CITIES_SENTENCE, ENTITY_LABEL } from "@/lib/entities";

/**
 * The four points every platform page opens with.
 *
 * Three are derived from that platform's own coverage — module count, role
 * count, the sectors it actually appears in — so a platform can never claim
 * depth the data does not hold. The fourth is a canon §6 metric, which is the
 * only kind of figure permitted here: no legacy delivery outcomes, no
 * unsourced percentages.
 *
 * The argument, in order: the wedge (module depth), the screen (how the people
 * are chosen), the commercial terms, and the speed.
 */
export function whyPoints(cov: PlatformCoverage): WhyPoint[] {
  const sectorNames = cov.sectors.map((s) => s.label);
  const sectorLine =
    sectorNames.length > 1
      ? `${sectorNames.slice(0, -1).join(", ")} and ${sectorNames.at(-1)}`
      : sectorNames[0];

  return [
    {
      kicker: "Depth, not a line item",
      title: `${cov.name} by module, not as one entry on a list`,
      body: `Most firms in this market organise by profession and treat enterprise platforms as a single line. We publish the modules and the roles inside each one, so you can see whether the depth is real before you brief us.`,
      figure: {
        value: `${cov.moduleCount}`,
        label: `${cov.name} modules covered`,
      },
    },
    {
      kicker: "Screened by specialists",
      title: "Read by someone who has run the programme",
      body: "A specialist desk screens for implementation depth and delivery risk, never keyword match, and the reasons the others were rejected come attached to the shortlist.",
      figure: publishedFigure("CVs per interview"),
    },
    {
      kicker: "Terms in writing",
      title: "Four ways to contract, one screening standard",
      body: "Contract, Permanent, Employer of Record or Managed Delivery. The work is the same; what changes is who carries the contract, the visa and the notice period.",
      figure: publishedFigure("Contracts renewed"),
    },
    {
      kicker: "In region, at pace",
      title: sectorLine
        ? `Placed into ${sectorLine} programmes`
        : "Placed across the Middle East, Europe and India",
      body: `${ENTITY_LABEL} across ${ENTITY_CITIES_SENTENCE}, so a specialist can start on your paper or ours without an entity of your own.`,
      figure: publishedFigure("Brief to shortlist"),
    },
  ];
}
