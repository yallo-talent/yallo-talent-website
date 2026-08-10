import styles from "@/components/admin/Admin.module.css";
import { requirePane } from "@/lib/admin/guard";
import { type AssetUsage, allMedia, usageByAssetId } from "@/lib/db/media";
import { MEDIA_WIDTHS } from "@/lib/media/config";
import { readSpacesConfig } from "@/lib/media/spaces";
import { archiveAssetAction } from "./actions";
import { MediaUpload } from "./MediaUpload";

/**
 * The media library — design §9: "what exists, where it is used, and refuses
 * deletion of anything in use".
 *
 * WHERE IT IS USED IS THE POINT OF THE PANE, not a column somebody added. A
 * library that only lists files makes every removal a guess, and the guess is
 * always taken because the alternative is opening every article. The usage is
 * computed from the bodies themselves, so it cannot be stale.
 *
 * DRAFTS COUNT AS USE. An asset only a draft references is still in use:
 * archiving it breaks the piece the moment somebody publishes, and by then the
 * person who archived it is not looking.
 */
export const dynamic = "force-dynamic";

function bytes(n: number | null): string {
  if (n == null) return "unknown size";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function usageLine(entries: AssetUsage[]): string {
  return entries
    .map((u) => `${u.title || u.slug} (${u.status}, ${u.where})`)
    .join(" · ");
}

export default async function MediaPane({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; archived?: string }>;
}) {
  await requirePane("media");
  const q = await searchParams;

  let assets: Awaited<ReturnType<typeof allMedia>> = [];
  let usage = new Map<string, AssetUsage[]>();
  let error: string | null = null;
  try {
    [assets, usage] = await Promise.all([allMedia(), usageByAssetId()]);
  } catch (err) {
    error = (err as Error).message;
  }

  const live = assets.filter((a) => a.archivedAt === null);
  const archived = assets.filter((a) => a.archivedAt !== null);
  /* The pane still works without object storage configured: it lists, it shows
     usage and it refuses. Only the upload control needs the secret, so only the
     upload control is withheld, and it says why rather than being absent. */
  const storageReady = readSpacesConfig() !== null;

  return (
    <>
      <h1 className={styles.h1}>Media</h1>
      <p className={styles.lede}>
        Images live in object storage and are indexed here. Every upload passes
        through the server, is resized to the widths the article template uses (
        {MEDIA_WIDTHS.join(", ")} pixels wide) and is stored as WebP. Alt text
        is required before anything is stored, so a published body can never
        carry an image without it.
      </p>

      {q.err ? <p className={styles.error}>{q.err}</p> : null}
      {q.archived ? <p className={styles.ok}>Archived.</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <h2 className={styles.h2}>Upload</h2>
      {storageReady ? (
        <MediaUpload />
      ) : (
        <p className={styles.empty}>
          Object storage is not configured in this environment, so nothing can
          be uploaded from here. The library below still works.
        </p>
      )}

      <h2 className={styles.h2}>Library</h2>
      {live.length === 0 ? (
        <p className={styles.empty}>Nothing uploaded yet.</p>
      ) : (
        <ul className={styles.rows}>
          {live.map((asset) => {
            const used = usage.get(asset.id) ?? [];
            return (
              <li className={styles.row} key={asset.id}>
                <div className={styles.rowHead}>
                  <code>{asset.objectKey}</code>
                  <span className={styles.meta}>
                    {asset.sourceWidth ?? asset.width}×
                    {asset.sourceHeight ?? asset.height} source ·{" "}
                    {asset.renditions.length} rendition
                    {asset.renditions.length === 1 ? "" : "s"} ·{" "}
                    {bytes(asset.byteSize)}
                  </span>
                </div>
                <p className={styles.note}>{asset.alt}</p>
                <p className={styles.meta}>
                  {used.length === 0
                    ? "Not used anywhere."
                    : `In use: ${usageLine(used)}`}
                </p>
                <div className={styles.rowActions}>
                  <a
                    className={styles.rowButton}
                    href={asset.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open
                  </a>
                  {used.length === 0 ? (
                    <form action={archiveAssetAction}>
                      <input name="id" type="hidden" value={asset.id} />
                      <button className={styles.rowButton} type="submit">
                        Archive
                      </button>
                    </form>
                  ) : (
                    /* NOT A DISABLED BUTTON. A disabled control invites the
                       question "why", and answering it is one sentence. The
                       server refuses regardless; this is the honest version of
                       the same refusal, shown before the click. */
                    <span className={styles.meta}>
                      Archiving refused while it is in use.
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {archived.length > 0 && (
        <>
          <h2 className={styles.h2}>Archived</h2>
          <p className={styles.note}>
            Nothing is ever hard deleted. The object stays where it is, so a
            revision restored months from now still resolves.
          </p>
          <ul className={styles.rows}>
            {archived.map((asset) => (
              <li className={styles.row} key={asset.id}>
                <div className={styles.rowHead}>
                  <code>{asset.objectKey}</code>
                  <span className={styles.meta}>
                    archived {asset.archivedAt?.slice(0, 10)}
                    {asset.archivedBy ? ` by ${asset.archivedBy}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
