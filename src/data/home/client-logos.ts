import { getConsentedClients, hasLogoAsset } from "@/lib/clients";

/**
 * Resolves a case study's client name to its consented logo.
 *
 * Deliberately routed through content/clients.yaml rather than hardcoded: a
 * client whose consent is withdrawn disappears from the logo rail AND from every
 * case-study card in one edit, with no second list to remember.
 *
 * Returns undefined when the name is not on the consented register or has no
 * file. The card then sets the name instead — never a substituted mark.
 *
 * "or has no file" was the docstring's promise and not its behaviour: it returned
 * `hit?.logo` straight from the register, which is a path, not proof. Once
 * build-logos.mjs started declining to emit marks it could not key to one clean
 * ink, three of those paths pointed at nothing and the case-study cards rendered
 * broken images — CI caught it, and locally it had passed only because Next's
 * image cache still held the deleted files. `hasLogoAsset` is now the check.
 */
export function clientLogoFor(client: string): string | undefined {
  const hit = matchClient(client);
  return hasLogoAsset(hit?.logo) ? hit?.logo : undefined;
}

/**
 * Resolves a case-study's raw client string to the register's own display
 * name — "Sephora Middle East" becomes "Sephora", per the ALIASES map below.
 * Falls back to the input unchanged when nothing in the register matches, so
 * a name outside the register (an unlisted integrator, say) still renders as
 * written rather than disappearing.
 *
 * Round 7 §4.4: a card carried "Sephora Middle East" as a second, driftable
 * source of truth for a name the register already states as "Sephora". This
 * is the derivation the case-study card must call instead of trusting its own
 * frontmatter `client` string.
 */
export function clientDisplayNameFor(client: string): string {
  return matchClient(client)?.name ?? client;
}

function matchClient(client: string) {
  const all = [
    ...getConsentedClients("enterprise"),
    ...getConsentedClients("integrators"),
  ];
  const target = normalise(client);
  return all.find((c) => {
    const name = normalise(c.name);
    return (
      name === target || target.startsWith(name) || name.startsWith(target)
    );
  });
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
