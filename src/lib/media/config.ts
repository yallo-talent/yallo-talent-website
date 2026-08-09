/**
 * What the media pipeline accepts, and what it produces — design §9.
 *
 * NOT `server-only`: the widths and the accepted types are the same facts the
 * upload control shows a person before they choose a file and the gate asserts
 * afterwards. A limit enforced on the server and guessed at in the browser is a
 * limit somebody discovers by having their upload rejected.
 */

/**
 * The widths the templates actually use, derived rather than chosen.
 *
 * `.prose` in EditorialLayout.module.css is `max-width: 72ch`. At the body size
 * that measure resolves to roughly 780 CSS pixels, so:
 *
 *   800  the measure at 1x, which is what most readers see
 *   1600 the measure at 2x, which is what every retina reader sees
 *   1200 the social card width, because an uploaded hero becomes the OG image
 *        and `src/app/og/[[...slug]]/route.tsx` draws at 1200x630
 *
 * Three renditions, not a ladder of eight: this is body imagery inside one
 * measure, not a responsive art-direction problem, and every extra width is
 * storage and encode time spent on a breakpoint no template has.
 *
 * A WIDTH LARGER THAN THE ORIGINAL IS SKIPPED, never upscaled. An upscaled
 * rendition is a bigger file carrying no more detail, which is the opposite of
 * what resizing is for.
 */
export const MEDIA_WIDTHS = [800, 1200, 1600] as const;

/**
 * WebP, and only WebP.
 *
 * It is the modern format design §9 asks for, it is supported by every browser
 * the estate targets, and it encodes fast enough to run inside a request. AVIF
 * would compress better and costs seconds per image on encode, which would turn
 * an upload into something a writer waits on; that trade can be revisited when
 * uploads are queued rather than synchronous.
 */
export const RENDITION_MIME = "image/webp";
export const RENDITION_EXTENSION = "webp";

/** What a person may upload. Raster only: an SVG is a script surface. */
export const ACCEPTED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const ACCEPT_ATTRIBUTE = ACCEPTED_UPLOAD_TYPES.join(",");

/** 20 MB. A photograph off a camera fits; a video does not, and should not. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

/**
 * THE ONE BUCKET THIS CODE MAY TOUCH.
 *
 * Round 25b §7 and this round both say it plainly: nothing here touches
 * `yallo-lms-assets`, which belongs to the Academy. The bucket name arrives
 * from the environment, so this is the check that makes the rule enforceable
 * rather than aspirational — a misconfigured `SPACES_BUCKET` fails loudly here
 * instead of quietly writing a marketing image into another product's storage.
 */
export const MEDIA_BUCKET = "yallo-talent-media";

export const FORBIDDEN_BUCKETS = ["yallo-lms-assets"] as const;

export function assertBucketAllowed(bucket: string): void {
  if (bucket !== MEDIA_BUCKET) {
    throw new Error(
      `Refusing to write to "${bucket}". This pipeline writes to ${MEDIA_BUCKET} and nowhere else` +
        (FORBIDDEN_BUCKETS.includes(
          bucket as (typeof FORBIDDEN_BUCKETS)[number],
        )
          ? `; ${bucket} belongs to another product.`
          : "."),
    );
  }
}

/**
 * The object key for a rendition. Date-partitioned so a listing of the bucket
 * stays readable, and the base is a slug rather than the original filename:
 * an uploaded name carries spaces, case and sometimes a person's name.
 */
export function objectKeyFor(
  base: string,
  width: number,
  now = new Date(),
): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `media/${yyyy}/${mm}/${base}-${width}.${RENDITION_EXTENSION}`;
}

/** A filename reduced to something safe to put in a URL. */
export function slugifyFilename(name: string): string {
  const withoutExtension = name.replace(/\.[^.]+$/, "");
  const slug = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug === "" ? "image" : slug;
}
