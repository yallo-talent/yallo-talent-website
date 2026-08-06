import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1),
  /**
   * Omitted where no file exists. Consumers render a set wordmark in that case
   * — never a substituted logo, and never a broken image.
   *
   * Round 17: every consented row now has a mark. Radwell's file had been in the
   * supplied pack all along — it was the BUILD that never ran for that slug, and
   * "the asset is absent" had been checked against public/logos/clients/, which
   * is build-logos.mjs's OUTPUT. Wickes needed a polarity-aware key rather than a
   * new asset: a shield with knockout text silhouettes as the shield under one
   * global threshold, and as its letters under two.
   */
  logo: z.string().min(1).optional(),
  consentOnFile: z.boolean(),
});

const clientsFileSchema = z.object({
  enterprise: z.array(clientSchema),
  integrators: z.array(clientSchema),
});

export type Client = z.infer<typeof clientSchema>;
export type ClientGroup = keyof z.infer<typeof clientsFileSchema>;

const CLIENTS_PATH = join(process.cwd(), "content", "clients.yaml");

let cached: z.infer<typeof clientsFileSchema> | null = null;

function loadClients(): z.infer<typeof clientsFileSchema> {
  if (cached) return cached;
  const raw = readFileSync(CLIENTS_PATH, "utf8");
  const parsed = clientsFileSchema.safeParse(parseYaml(raw));
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new Error(`Invalid clients.yaml: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

export function getConsentedClients(group: ClientGroup): Client[] {
  return loadClients()[group].filter((c) => c.consentOnFile);
}

/**
 * Does the mark actually exist on disk?
 *
 * scripts/build-logos.mjs applies a measured legibility gate and refuses to emit
 * a silhouette it cannot vouch for — six of the fifteen rasters are multi-tone
 * sources that will not key to one clean ink, and one is too wide to reach a
 * readable cap height in the rail cell. content/clients.yaml still names those
 * clients, because the consent and the relationship are unchanged; only the
 * asset is missing. Canon §8 says such a mark renders as its NAME, never as a
 * padded box and never redrawn, so consumers ask this rather than trusting the
 * `logo` field on its own.
 */
export function hasLogoAsset(logo: string | undefined): boolean {
  if (!logo) return false;
  return existsSync(join(process.cwd(), "public", logo.replace(/^\//, "")));
}
