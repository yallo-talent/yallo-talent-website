import { aiRoleFamily } from "@/data/ai-talent";
import {
  type EstateZone,
  estateAssertion,
  estateLayers,
  estatePlatformDesks,
  estateRails,
  familiesFor,
  governanceFrameworks,
  zoneLitFor,
} from "@/data/ai-talent/estate";
import type { EstateZoneId, RoleFamilySlug } from "@/data/ai-talent/stacks";
import { toolsForZone } from "@/data/ai-talent/stacks";
import { routeExists } from "@/lib/routes";
import { AiEstateBand, type EstateModel, type ZoneView } from "./AiEstateBand";

/**
 * The AI estate band — the desk's single signature, and after round 6 the only
 * element unique to it besides the role-family structure and the
 * `adjacentDiscipline` join.
 *
 * It absorbed the stack matrix (decision 2) and the governance band. Those were
 * three bands over two datasets with two disagreeing groupings and one list
 * written twice; they are one band over one dataset now.
 *
 * This file is the server half: it does every derivation and hands
 * `AiEstateBand` plain data. Nothing about the taxonomy reaches the client
 * bundle.
 *
 * WHY IT IS NOT ONE <svg>, still worth stating. The binding constraint is that
 * at 360px the band stacks vertically with the rails beneath rather than
 * compressing sideways. A single SVG cannot restack — its contents scale with
 * the viewBox — so honouring the reflow inside one SVG means two complete
 * copies of the content in two <g> groups, which doubles every string, puts
 * both in the accessibility tree and guarantees they drift. There is no raster
 * asset here and no image element of any kind; every rule is drawn by the
 * browser. What replaces the SVG canvas is a semantic structure, and that is a
 * gain: a screen reader reads the estate in the same order a sighted reader
 * sees it, which an SVG would have needed bolted on with aria.
 *
 * FORBIDDEN HERE, per §7.2 and R-AI3: no placement count, client, logo,
 * quotation or date; no claim that Yallo is leading, pioneering or first; no
 * vendor performance figure; no technology that is not a real, current product.
 * There are no vendor logos at all, in colour or otherwise.
 *
 * THE L2 VARIANT is this same component with `family` set (§3.3). It is one
 * prop and one data path, not a second component and not a separate filtered
 * list: `toolsForZone` takes the family and `zoneLitFor` answers whether the
 * zone stays lit. Layers the family does not work at are present and dimmed,
 * because absence would lose the estate context that is the point of the band.
 */

function toZone(
  zone: EstateZone,
  family: RoleFamilySlug | null,
  opts: { desks?: boolean; items?: string[] } = {},
): ZoneView {
  const tiers = toolsForZone(zone.id as EstateZoneId, family ?? undefined).map(
    (t) => ({
      tier: t.tier,
      entries: t.entries.map((e) => ({
        name: e.name,
        families: e.roleFamilies,
      })),
    }),
  );

  const chips = familiesFor(zone)
    .map((slug) => {
      const f = aiRoleFamily(slug);
      /* A family with no data would be a broken link, so it renders nothing.
         Same rule the insight cards follow: an unbuilt destination never
         renders something that looks clickable. */
      return f
        ? { slug, label: f.shortName, href: `/ai-talent/${slug}` }
        : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return {
    id: zone.id,
    name: zone.name,
    note: zone.note,
    tiers,
    chips,
    items: opts.items,
    desks: opts.desks ? estatePlatformDesks(routeExists) : undefined,
    lit: family === null ? true : zoneLitFor(zone, family),
  };
}

export function AiEstateDiagram({ family }: { family?: RoleFamilySlug }) {
  const f = family ?? null;

  const model: EstateModel = {
    layers: estateLayers.map((zone) =>
      /* Layer 01 carries the platform desks, derived. Every other layer
         carries tools. */
      toZone(zone, f, { desks: zone.id === "systems" }),
    ),
    railLeft: toZone(estateRails.left, f),
    railRight: toZone(estateRails.right, f, {
      /* Frameworks, not tools: they are neither procured nor engineered, so the
         §5 tier test does not reach them and they are not `stacks.ts` entries.
         One list, after round 6 found two copies that disagreed. */
      items: governanceFrameworks,
    }),
    assertion: estateAssertion,
    family: f,
  };

  return <AiEstateBand model={model} />;
}
