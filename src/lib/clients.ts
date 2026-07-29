import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1),
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
