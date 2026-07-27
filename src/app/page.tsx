import { HeroSlider } from "@/components/blocks/HeroSlider";
import { HowItWorks } from "@/components/blocks/HowItWorks";
import { PlatformTalent } from "@/components/blocks/PlatformTalent";
import { TheProblem } from "@/components/blocks/TheProblem";
import { WhatWeDo } from "@/components/blocks/WhatWeDo";
import { WhereWePlace } from "@/components/blocks/WhereWePlace";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <TheProblem />
      <HowItWorks />
      <WhatWeDo />
      <WhereWePlace />
      <PlatformTalent />
    </>
  );
}
