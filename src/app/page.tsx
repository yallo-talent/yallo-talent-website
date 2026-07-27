import { BriefCTA } from "@/components/blocks/BriefCTA";
import { CaseStudies } from "@/components/blocks/CaseStudies";
import { HeroSlider } from "@/components/blocks/HeroSlider";
import { HowItWorks } from "@/components/blocks/HowItWorks";
import { LatestInsights } from "@/components/blocks/LatestInsights";
import { Metrics } from "@/components/blocks/Metrics";
import { OurPartners } from "@/components/blocks/OurPartners";
import { PlatformTalent } from "@/components/blocks/PlatformTalent";
import { TalentBridge } from "@/components/blocks/TalentBridge";
import { TheProblem } from "@/components/blocks/TheProblem";
import { WhatWeDo } from "@/components/blocks/WhatWeDo";
import { WhereWePlace } from "@/components/blocks/WhereWePlace";
import { WhyYallo } from "@/components/blocks/WhyYallo";
import { YalloFamily } from "@/components/blocks/YalloFamily";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <TheProblem />
      <HowItWorks />
      <WhatWeDo />
      <WhereWePlace />
      <PlatformTalent />
      <OurPartners />
      <TalentBridge />
      <WhyYallo />
      <CaseStudies />
      <Metrics />
      <LatestInsights />
      <YalloFamily />
      <BriefCTA />
    </>
  );
}
