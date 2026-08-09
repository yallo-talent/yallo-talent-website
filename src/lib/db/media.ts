import "server-only";
import type { Signed } from "@/lib/admin/guard";
import { sql } from "@/lib/db/client";
import { allArticles, allCaseStudies } from "@/lib/db/content";

/**
 * The media library's reads and writes — design §9's "a media library pane
 * lists what exists, where it is used, and refuses deletion of anything in
 * use".
 *
 * THERE IS NO DELETE, and that is the schema's first principle rather than this
 * module's preference. `archived_at` is the terminal state, exactly as
 * `archived` is for content: an object that is gone cannot be restored when the
 * article that needed it is restored from a revision. So the library's
 * destructive-looking control archives, and even that refuses while anything
 * still points at the asset.
 *
 * USAGE IS COMPUTED, NEVER STORED. A `used_by` column is a cache of a fact the
 * bodies already hold, and a cache that is wrong is worse than no cache when
 * the question it answers is "is it safe to remove this". Thirty rows are
 * scanned in memory; when that stops being cheap the query moves into Postgres
 * with a jsonb path, and the answer stays derived either way.
 */

export interface MediaRendition {
  url: string;
  objectKey: string;
  width: number;
  height: number;
  byteSize: number;
}

export interface MediaAsset {
  id: string;
  objectKey: string;
  url: string;
  alt: string;
  caption: string | null;
  mimeType: string;
  width: number | null;
  height: number | null;
  byteSize: number | null;
  renditions: MediaRendition[];
  sourceWidth: number | null;
  sourceHeight: number | null;
  archivedAt: string | null;
  archivedBy: string | null;
  createdAt: string;
}

function toAsset(r: Record<string, unknown>): MediaAsset {
  return {
    id: String(r.id),
    objectKey: String(r.object_key),
    url: String(r.url),
    alt: String(r.alt ?? ""),
    caption: (r.caption as string) ?? null,
    mimeType: String(r.mime_type ?? ""),
    width: r.width == null ? null : Number(r.width),
    height: r.height == null ? null : Number(r.height),
    byteSize: r.byte_size == null ? null : Number(r.byte_size),
    renditions: (r.renditions ?? []) as MediaRendition[],
    sourceWidth: r.source_width == null ? null : Number(r.source_width),
    sourceHeight: r.source_height == null ? null : Number(r.source_height),
    archivedAt: r.archived_at
      ? new Date(String(r.archived_at)).toISOString()
      : null,
    archivedBy: (r.archived_by as string) ?? null,
    createdAt: new Date(String(r.created_at ?? Date.now())).toISOString(),
  };
}

export async function allMedia(): Promise<MediaAsset[]> {
  const rows = await sql()`select * from media_assets order by created_at desc`;
  return (rows as Record<string, unknown>[]).map(toAsset);
}

export async function mediaById(id: string): Promise<MediaAsset | null> {
  const rows = await sql()`select * from media_assets where id = ${id}`;
  const r = (rows as Record<string, unknown>[])[0];
  return r ? toAsset(r) : null;
}

export interface RecordAssetInput {
  objectKey: string;
  url: string;
  alt: string;
  caption: string | null;
  mimeType: string;
  width: number;
  height: number;
  byteSize: number;
  renditions: MediaRendition[];
  sourceWidth: number;
  sourceHeight: number;
}

/**
 * Index a stored object.
 *
 * ALT TEXT IS NOT NULLABLE IN THE SCHEMA and is refused here as well. Design §9
 * says alt text blocks publishing; making it impossible to record an asset
 * without it means the block is never reached, which is the cheaper place to be
 * strict. The refusal is at the top so a request that will fail does not spend
 * an upload first.
 */
export async function recordAsset(
  input: RecordAssetInput,
  actor: Signed,
): Promise<MediaAsset> {
  if (input.alt.trim() === "") {
    throw new Error(
      "Alt text is required. An image without it is an image somebody using a screen reader is simply not shown.",
    );
  }
  const rows = await sql()`
    insert into media_assets
      (object_key, url, alt, caption, mime_type, width, height, byte_size,
       renditions, source_width, source_height, created_by)
    values (${input.objectKey}, ${input.url}, ${input.alt.trim()},
            ${input.caption}, ${input.mimeType}, ${input.width}, ${input.height},
            ${input.byteSize}, ${JSON.stringify(input.renditions)}::jsonb,
            ${input.sourceWidth}, ${input.sourceHeight}, null)
    returning *`;
  await sql()`
    insert into content_audit (content_type, action, actor_email, actor_role, detail)
    values ('media', 'upload', ${actor.email}, ${actor.role},
            ${JSON.stringify({ objectKey: input.objectKey })}::jsonb)`;
  return toAsset((rows as Record<string, unknown>[])[0]);
}

export interface AssetUsage {
  contentType: "article" | "case_study";
  id: string;
  slug: string;
  title: string;
  status: string;
  /** Where in the piece the asset is referenced. */
  where: "body" | "social card";
}

/** Every URL an asset answers to: its canonical url and every rendition. */
function urlsOf(asset: MediaAsset): string[] {
  return [asset.url, ...asset.renditions.map((r) => r.url)];
}

function bodyImageSrcs(body: unknown): string[] {
  const out: string[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const node = n as {
      type?: string;
      attrs?: { src?: unknown };
      content?: unknown[];
    };
    if (node.type === "image" && typeof node.attrs?.src === "string") {
      out.push(node.attrs.src);
    }
    for (const c of node.content ?? []) walk(c);
  };
  walk(body);
  return out;
}

/**
 * Where each asset is used, across every article and case study in any status.
 *
 * DRAFTS COUNT. An asset only referenced by a draft is still in use: archiving
 * it would break the piece the moment somebody publishes it, and the person
 * archiving would have had no way to know.
 */
export async function usageByAssetId(): Promise<Map<string, AssetUsage[]>> {
  const [assets, articles, studies] = await Promise.all([
    allMedia(),
    allArticles(),
    allCaseStudies(),
  ]);

  const byUrl = new Map<string, string>();
  for (const asset of assets) {
    for (const url of urlsOf(asset)) byUrl.set(url, asset.id);
  }

  const usage = new Map<string, AssetUsage[]>();
  const note = (assetId: string, entry: AssetUsage) => {
    const list = usage.get(assetId) ?? [];
    list.push(entry);
    usage.set(assetId, list);
  };

  const scan = (
    rows: {
      id: string;
      slug: string;
      title: string;
      status: string;
      body: unknown;
      ogImageUrl: string | null;
    }[],
    contentType: "article" | "case_study",
  ) => {
    for (const row of rows) {
      for (const src of bodyImageSrcs(row.body)) {
        const assetId = byUrl.get(src);
        if (assetId) {
          note(assetId, {
            contentType,
            id: row.id,
            slug: row.slug,
            title: row.title,
            status: row.status,
            where: "body",
          });
        }
      }
      const og = (row.ogImageUrl ?? "").trim();
      const ogAsset = og === "" ? undefined : byUrl.get(og);
      if (ogAsset) {
        note(ogAsset, {
          contentType,
          id: row.id,
          slug: row.slug,
          title: row.title,
          status: row.status,
          where: "social card",
        });
      }
    }
  };

  scan(articles, "article");
  scan(studies, "case_study");
  return usage;
}

/**
 * Archive an asset, refusing while anything still points at it.
 *
 * THE REFUSAL NAMES THE PIECES, not a count. "In use by 2 pieces" is a message
 * that sends somebody looking; "in use by Al Tayer (published) and one draft"
 * is a message they can act on.
 */
export async function archiveAsset(
  id: string,
  actor: Signed,
): Promise<MediaAsset> {
  const asset = await mediaById(id);
  if (!asset) throw new Error("No such asset.");
  const usage = (await usageByAssetId()).get(id) ?? [];
  if (usage.length > 0) {
    const named = usage
      .map((u) => `${u.title || u.slug} (${u.status}, ${u.where})`)
      .join("; ");
    throw new Error(
      `Still in use, so nothing was archived. Remove it from ${named} first.`,
    );
  }
  const rows = await sql()`
    update media_assets
       set archived_at = now(), archived_by = ${actor.email}
     where id = ${id}
    returning *`;
  await sql()`
    insert into content_audit (content_type, action, actor_email, actor_role, detail)
    values ('media', 'archive', ${actor.email}, ${actor.role},
            ${JSON.stringify({ objectKey: asset.objectKey })}::jsonb)`;
  return toAsset((rows as Record<string, unknown>[])[0]);
}
