import { NextResponse } from "next/server";
import { assertPane } from "@/lib/admin/guard";
import { allMedia, recordAsset } from "@/lib/db/media";
import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  objectKeyFor,
  slugifyFilename,
} from "@/lib/media/config";
import { processImage, srcSetFrom } from "@/lib/media/process";
import {
  publicUrlFor,
  putObject,
  requireSpacesConfig,
} from "@/lib/media/spaces";

/**
 * The upload route — design §9's "uploads go to object storage ... through the
 * server route, never browser-direct".
 *
 * WHY A ROUTE HANDLER RATHER THAN A SERVER ACTION. A server action serialises
 * its arguments through React's payload, which is the wrong shape for a twenty
 * megabyte binary and a poor place to stream one. A route handler takes the
 * multipart body directly. The guard is the same guard, called the same way.
 *
 * THE GUARD RUNS FIRST, BEFORE THE BODY IS READ. Reading a twenty megabyte
 * upload from an unauthenticated caller and then refusing it is a denial of
 * service with extra steps.
 *
 * NOTHING IS RECORDED UNTIL EVERY RENDITION IS STORED. A row pointing at an
 * object that was never written is a broken image in a library that says it
 * exists, which is worse than a failed upload.
 */

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * The library, for the editor's image block to insert from.
 *
 * WHY THE EDITOR NEEDS THIS AT ALL. Without it the only way to put an uploaded
 * image in a body is to copy a URL out of one pane and paste it into another,
 * and the alt text gets retyped — so the alt text the library made mandatory
 * becomes optional again in practice, and the renditions are never referenced
 * because nobody hand-writes a `srcset`. Inserting from here carries all of it
 * across in one act.
 */
/**
 * What the editor is told about an asset — ONE shape, for the list and for a
 * fresh upload.
 *
 * WHY IT IS A FUNCTION. A5 lets the editor upload without leaving the piece, so
 * the POST response is now something the editor inserts from directly rather
 * than a receipt it discards. The two responses described the same asset in two
 * shapes, and the one the POST used had no `srcSet` — which would have placed a
 * freshly uploaded image with no rendition set, spending the resizing pipeline
 * backwards, and nobody would have noticed because the image renders.
 */
function forEditor(asset: Awaited<ReturnType<typeof allMedia>>[number]) {
  return {
    id: asset.id,
    url: asset.url,
    alt: asset.alt,
    caption: asset.caption,
    width: asset.width,
    height: asset.height,
    objectKey: asset.objectKey,
    srcSet: srcSetFrom(asset.renditions)?.srcSet ?? "",
  };
}

export async function GET() {
  try {
    await assertPane("media");
  } catch {
    return bad("You do not have access to media.", 403);
  }
  const assets = (await allMedia()).filter((a) => a.archivedAt === null);
  return NextResponse.json({ assets: assets.map(forEditor) });
}

export async function POST(request: Request) {
  let signed: Awaited<ReturnType<typeof assertPane>>;
  try {
    signed = await assertPane("media");
  } catch {
    /* ONE ANSWER FOR BOTH CASES, deliberately. Distinguishing "not signed in"
       from "signed in but forbidden" tells an unauthenticated caller that the
       route exists and that some accounts reach it. */
    return bad("You do not have access to media.", 403);
  }

  let config: ReturnType<typeof requireSpacesConfig>;
  try {
    config = requireSpacesConfig();
  } catch (err) {
    /* 503 rather than 500: nothing is broken, the environment simply cannot
       do this. The message names the missing variables. */
    return bad((err as Error).message, 503);
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "").trim();
  const caption = String(form.get("caption") ?? "").trim();

  if (!(file instanceof File)) return bad("No file was sent.");
  /* ALT TEXT BLOCKS THE UPLOAD, not just the publish. Design §9 requires it on
     every asset; refusing here means the library can never hold one without it,
     so publish rule 7 has nothing left to catch. */
  if (alt === "") {
    return bad(
      "Alt text is required. Describe what the image shows, in a sentence somebody who cannot see it would want read to them.",
    );
  }
  if (!(ACCEPTED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    return bad(
      `${file.type || "That file"} is not an image this pipeline accepts. JPEG, PNG, WebP or AVIF.`,
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return bad(
      `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB, over the ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit.`,
    );
  }

  const input = new Uint8Array(await file.arrayBuffer());

  let processed: Awaited<ReturnType<typeof processImage>>;
  try {
    processed = await processImage(input);
  } catch (err) {
    return bad((err as Error).message);
  }

  const base = slugifyFilename(file.name);
  const now = new Date();
  const stored: {
    url: string;
    objectKey: string;
    width: number;
    height: number;
    byteSize: number;
  }[] = [];

  try {
    for (const rendition of processed.renditions) {
      const objectKey = objectKeyFor(
        `${base}-${Date.now()}`,
        rendition.width,
        now,
      );
      await putObject(objectKey, rendition.bytes, rendition.mimeType, config);
      stored.push({
        url: publicUrlFor(config, objectKey),
        objectKey,
        width: rendition.width,
        height: rendition.height,
        byteSize: rendition.byteSize,
      });
    }
  } catch (err) {
    return bad(`Nothing was recorded. ${(err as Error).message}`, 502);
  }

  /* The widest rendition is the canonical url, for the same reason it is the
     `src`: a consumer that reads one field wants the sharpest image. */
  const widest = stored.reduce((a, b) => (b.width > a.width ? b : a));

  const asset = await recordAsset(
    {
      objectKey: widest.objectKey,
      url: widest.url,
      alt,
      caption: caption === "" ? null : caption,
      mimeType: processed.renditions[0].mimeType,
      width: widest.width,
      height: widest.height,
      byteSize: widest.byteSize,
      renditions: stored,
      sourceWidth: processed.sourceWidth,
      sourceHeight: processed.sourceHeight,
    },
    signed,
  );

  /* The same shape the list returns, so the editor can insert what it just
     uploaded without a second request. */
  return NextResponse.json({ asset: forEditor(asset) }, { status: 201 });
}
