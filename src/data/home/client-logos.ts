import { getConsentedClients } from "@/lib/clients";

/**
 * Resolves a case study's client name to its consented logo.
 *
 * Deliberately routed through content/clients.yaml rather than hardcoded: a
 * client whose consent is withdrawn disappears from the logo rail AND from every
 * case-study card in one edit, with no second list to remember.
 *
 * Returns undefined when the name is not on the consented register or has no
 * file. The card then sets the name instead — never a substituted mark.
 */
export function clientLogoFor(client: string): string | undefined {
  const all = [
    ...getConsentedClients("enterprise"),
    ...getConsentedClients("integrators"),
  ];
  const target = normalise(client);
  const hit = all.find((c) => {
    const name = normalise(c.name);
    return (
      name === target || target.startsWith(name) || name.startsWith(target)
    );
  });
  return hit?.logo;
}

/** "Tata Consultancy Services" and "TCS" have to meet somewhere. */
const ALIASES: Record<string, string> = {
  "tata consultancy services": "tcs",
  "sephora middle east": "sephora",
  "al tayer group": "al tayer",
};

function normalise(s: string) {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9 &]/g, "")
    .trim();
  return ALIASES[base] ?? base;
}
