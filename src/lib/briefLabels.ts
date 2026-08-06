import type { BriefFormValues } from "@/lib/schemas";

/**
 * Human labels for the two coded enums `briefFormSchema` shares with the
 * Anthropic tool schema (src/lib/assistant/client.ts's `submit_brief`).
 * The assistant's brief-confirmation card used to print the raw codes
 * ("me", "managed-delivery") straight from the model's tool call — the
 * same codes `/brief`'s own `<select>` already had labels for. One source
 * now, so a code can't read fine on one surface and wrong on the other.
 */
export const regionOptions: {
  value: BriefFormValues["region"];
  label: string;
}[] = [
  { value: "uk", label: "United Kingdom" },
  { value: "me", label: "Middle East" },
  { value: "india", label: "India" },
  { value: "multi", label: "Multi-region" },
];

export const engagementOptions: {
  value: BriefFormValues["engagement"];
  label: string;
}[] = [
  { value: "contract", label: "Contract" },
  { value: "permanent", label: "Permanent" },
  { value: "eor", label: "EOR" },
  { value: "managed-delivery", label: "Managed Delivery" },
];

export const regionLabel = (value: BriefFormValues["region"]): string =>
  regionOptions.find((o) => o.value === value)?.label ?? value;

export const engagementLabel = (value: BriefFormValues["engagement"]): string =>
  engagementOptions.find((o) => o.value === value)?.label ?? value;
