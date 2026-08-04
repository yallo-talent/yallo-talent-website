const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

/** Reads UTM parameters off the current page URL at submit time — the only
 * point a capture route can learn them, since the API request itself carries
 * no query string of its own. */
export function getCampaignParams(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : null;
}
