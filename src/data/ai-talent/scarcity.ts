/**
 * AI platform-specialist scarcity, isolated deliberately.
 *
 * Blueprint v2 evidence (docs/design/context-programme-staffing-blueprint-v2.md
 * §2): region-wide, under one AI/ML-titled professional in a hundred also
 * carries a named hyperscaler AI-platform skill — the scarcest thing measured
 * across this entire exercise, by a wide margin. Ranked, not republished: no
 * figure, no pool size, no market-research attribution reaches this file.
 *
 * NOT WIRED INTO ANY RENDER YET. Another session owns src/app/**\/ai-talent/
 * and the AI role-family shell, component and diagram files this round —
 * this file is importable but unused on purpose, so that work lands without
 * conflicting with this one.
 */

export type ScarcityBand = "scarcest" | "moderate" | "least-scarce" | null;

export interface AiPlatformScarcity {
  band: ScarcityBand;
  note?: string;
}

export const aiTalentScarcity: Record<
  "bedrock" | "vertexAi" | "azureAiFoundry",
  AiPlatformScarcity
> = {
  bedrock: {
    band: "scarcest",
    note: "these three are statistically close to each other and far scarcer than every other skill measured in this exercise.",
  },
  vertexAi: {
    band: "scarcest",
    note: "these three are statistically close to each other and far scarcer than every other skill measured in this exercise.",
  },
  azureAiFoundry: {
    band: "scarcest",
    note: "these three are statistically close to each other and far scarcer than every other skill measured in this exercise.",
  },
};
