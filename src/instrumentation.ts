/**
 * Startup banner for non-production servers.
 *
 * Ruling R-A2 (context-round16-scope.md §1, §2.1): one database. There is no
 * separate local instance, so a brief submitted against `next dev` or a local
 * `next start` lands in the same table as a real enquiry, and — if
 * RESEND_API_KEY is configured — sends a real email to a real inbox. Sumeet
 * has accepted mixed real and test rows. What he has not accepted is finding
 * out afterwards, so the one thing kept from the discarded two-database
 * ruling is this: say it loudly, at startup, every time.
 *
 * The banner reports whether each key is CONFIGURED, never its value. Three
 * sessions have printed a live key while trying to redact one; the way not to
 * print a secret is not to read it into a string at all.
 */

function line(label: string, configured: boolean, consequence: string): string {
  return `  ${configured ? "LIVE" : "off "}  ${label.padEnd(16)} ${consequence}`;
}

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  /* NOT `NODE_ENV !== "production"`. `next start` sets NODE_ENV=production,
     so that test excludes the local production server — which is precisely
     the one that serves a real build against the real database and is the
     reason this banner exists. `isProductionHost` is the site's existing
     answer to "is this the real deployment", already used to decide noindex.
     One rule, derived in one place. */
  const { isProductionHost } = await import("@/lib/seo");
  if (isProductionHost) return;

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  const mailConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
  const recipientOverridden = Boolean(process.env.RESEND_TO?.trim());

  const rule = "─".repeat(72);
  console.warn(
    [
      "",
      rule,
      "  NON-PRODUCTION SERVER, PRODUCTION TARGETS",
      "",
      line(
        "DATABASE_URL",
        dbConfigured,
        dbConfigured
          ? "submissions persist to the real database"
          : "unset — submissions will be refused, not silently dropped",
      ),
      line(
        "RESEND_API_KEY",
        mailConfigured,
        mailConfigured
          ? "briefs and CVs send real email"
          : "unset — persisted, not delivered",
      ),
      line(
        "RESEND_TO",
        recipientOverridden,
        recipientOverridden
          ? "overridden locally (see .env.local)"
          : "unset — mail goes to the default business aliases",
      ),
      "",
      "  There is one database by ruling. A test brief is a real row. If you",
      "  are about to submit a form, mean it — or point RESEND_TO at your own",
      "  address in .env.local first.",
      rule,
      "",
    ].join("\n"),
  );
}
