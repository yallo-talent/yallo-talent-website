import { HeroSlider } from "@/components/blocks/HeroSlider";
import { HowItWorks } from "@/components/blocks/HowItWorks";
import { TheProblem } from "@/components/blocks/TheProblem";
import { WhatWeDo } from "@/components/blocks/WhatWeDo";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <TheProblem />
      <HowItWorks />
      <WhatWeDo />
    </>
  );
}
