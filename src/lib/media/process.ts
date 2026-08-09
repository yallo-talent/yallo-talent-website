import sharp from "sharp";
import { MEDIA_WIDTHS, RENDITION_MIME } from "@/lib/media/config";

/**
 * Resize one uploaded image to the widths the templates use — design §9.
 *
 * NEVER UPSCALED. A width larger than the original is skipped, not stretched:
 * an upscaled rendition is a bigger file carrying no more detail, and a
 * `srcset` offering one tells a browser to download it. If the original is
 * narrower than every width, the original's own width is used, so an upload
 * always produces at least one rendition and the caller never has to handle an
 * empty set.
 *
 * EXIF IS DROPPED, and that is a privacy decision rather than a size one. A
 * photograph off a phone carries GPS coordinates and a device serial, and a
 * marketing image on a public page is exactly the wrong place for either.
 * `sharp` strips metadata unless asked to keep it, which is the right default
 * and is stated here so nobody adds `.withMetadata()` for file-size reasons
 * without meeting this sentence.
 *
 * NOT `server-only`, on the same reasoning `content-validation.ts` gives: every
 * function here is pure over its inputs and holds no secret, and marking it
 * would make the resize unreachable from the spec that watches it produce real
 * WebP bytes. `sharp` is a native module, so nothing bundles this into a client
 * chunk by accident; the credential-holding half is `spaces.ts`, which IS
 * server-only.
 */

export interface Rendition {
  width: number;
  height: number;
  bytes: Uint8Array;
  byteSize: number;
  mimeType: string;
}

export interface ProcessedImage {
  sourceWidth: number;
  sourceHeight: number;
  renditions: Rendition[];
}

export async function processImage(input: Uint8Array): Promise<ProcessedImage> {
  const image = sharp(input, { failOn: "error" });
  const meta = await image.metadata();
  const sourceWidth = meta.width ?? 0;
  const sourceHeight = meta.height ?? 0;
  if (sourceWidth === 0 || sourceHeight === 0) {
    throw new Error(
      "That file does not decode as an image, so nothing was uploaded.",
    );
  }

  const widths = MEDIA_WIDTHS.filter((w) => w <= sourceWidth);
  const targets = widths.length > 0 ? widths : [sourceWidth];

  const renditions: Rendition[] = [];
  for (const width of targets) {
    /* A fresh sharp instance per rendition. Reusing one pipeline across
       several resizes applies them cumulatively, so the 1600 would be a resize
       of the 800 rather than of the original. */
    const buffer = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    renditions.push({
      width: buffer.info.width,
      height: buffer.info.height,
      bytes: new Uint8Array(buffer.data),
      byteSize: buffer.data.byteLength,
      mimeType: RENDITION_MIME,
    });
  }

  return { sourceWidth, sourceHeight, renditions };
}

/**
 * The `srcset` a rendition set produces, and the `src` a browser without one
 * falls back to.
 *
 * THE WIDEST IS THE `src`, not the narrowest. A browser that ignores `srcset`
 * is either very old or is a crawler generating a preview, and both are better
 * served by the sharpest image than by the smallest one.
 */
export function srcSetFrom(
  renditions: { url: string; width: number }[],
): { src: string; srcSet: string } | null {
  if (renditions.length === 0) return null;
  const sorted = [...renditions].sort((a, b) => a.width - b.width);
  return {
    src: sorted[sorted.length - 1].url,
    srcSet: sorted.map((r) => `${r.url} ${r.width}w`).join(", "),
  };
}
