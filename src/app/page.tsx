import { AITalent } from "@/components/blocks/home/AITalent";
import { Close } from "@/components/blocks/home/Close";
import { Commitment } from "@/components/blocks/home/Commitment";
import { Engage } from "@/components/blocks/home/Engage";
import { Evidence } from "@/components/blocks/home/Evidence";
import { Hero } from "@/components/blocks/home/Hero";
import { Intelligence } from "@/components/blocks/home/Intelligence";
import { LogoRail } from "@/components/blocks/home/LogoRail";
import { Metrics } from "@/components/blocks/home/Metrics";
import { RoleCoverage } from "@/components/blocks/home/RoleCoverage";
import { TheGap } from "@/components/blocks/home/TheGap";
import { TheScreen } from "@/components/blocks/home/TheScreen";
import { WherePlace } from "@/components/blocks/home/WherePlace";

/**
 * Homepage — the funnel from the Phase 1 benchmark §7.
 *
 * WHY (Hero, TheGap) → PROOF (Metrics) → HOW (TheScreen, RoleCoverage,
 * Commitment) → WHAT (Engage, WherePlace, AITalent) → PROOF (Evidence,
 * Intelligence) → CTA (Close), with three contextual asks rather than one at
 * the bottom.
 *
 * Two inverted bands and no more: WherePlace and AITalent, both data surfaces.
 * Ground alternates paper → paper-2 → paper-warm between the light sections so
 * blocks separate tonally without borders.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <LogoRail />
      <TheGap />
      <Metrics />
      <TheScreen />
      <RoleCoverage />
      <Commitment />
      <Engage />
      <WherePlace />
      <AITalent />
      <Evidence />
      <Intelligence />
      <Close />
    </>
  );
}
