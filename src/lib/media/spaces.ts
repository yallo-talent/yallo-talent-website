import "server-only";
import { assertBucketAllowed } from "@/lib/media/config";
import { signRequest } from "@/lib/media/sigv4";

/**
 * The one place this codebase writes an object to storage — design §9's
 * "uploads go to object storage, not the database or the repository", and
 * round 25b §7's "nothing touches yallo-lms-assets".
 *
 * SERVER ROUTE, NEVER BROWSER-DIRECT. A browser-direct upload needs either a
 * presigned URL or a public-write bucket. The first hands a caller a credential
 * that is valid for a window they control the clock on; the second is not a
 * bucket, it is an open directory. The file arrives at a guarded route handler
 * and leaves from the server, so the only thing that ever holds the secret is
 * the server, and the only thing that decides what may be written is the guard.
 *
 * THE BUCKET IS CHECKED ON EVERY CALL, not once at start-up. A start-up check
 * passes on a process that was configured correctly and says nothing about a
 * value read per request from an environment that may have been changed since.
 */

export interface SpacesConfig {
  key: string;
  secret: string;
  bucket: string;
  region: string;
  /** The CDN host renditions are served from, without a scheme. */
  cdnHost: string;
}

/**
 * Read the configuration, or explain exactly what is missing.
 *
 * Returns null rather than throwing when nothing is configured at all, because
 * a local checkout with no Spaces credentials is a normal state: the library
 * pane still lists what exists and still refuses to archive what is in use.
 * Only the UPLOAD needs the secret, and only the upload path calls `require`.
 */
export function readSpacesConfig(): SpacesConfig | null {
  const key = process.env.SPACES_KEY;
  const secret = process.env.SPACES_SECRET;
  const bucket = process.env.SPACES_BUCKET;
  const region = process.env.SPACES_REGION;
  const cdn = process.env.SPACES_CDN_ENDPOINT;
  if (!key || !secret || !bucket || !region || !cdn) return null;
  return {
    key,
    secret,
    bucket,
    region,
    cdnHost: cdn.replace(/^https?:\/\//, "").replace(/\/+$/, ""),
  };
}

export function requireSpacesConfig(): SpacesConfig {
  const config = readSpacesConfig();
  if (!config) {
    const missing = [
      ["SPACES_KEY", process.env.SPACES_KEY],
      ["SPACES_SECRET", process.env.SPACES_SECRET],
      ["SPACES_BUCKET", process.env.SPACES_BUCKET],
      ["SPACES_REGION", process.env.SPACES_REGION],
      ["SPACES_CDN_ENDPOINT", process.env.SPACES_CDN_ENDPOINT],
    ]
      .filter(([, value]) => !value)
      .map(([name]) => name);
    throw new Error(
      `Object storage is not configured here: ${missing.join(", ")} unset. Uploading needs all five.`,
    );
  }
  assertBucketAllowed(config.bucket);
  return config;
}

/** The public URL a stored object is served from. */
export function publicUrlFor(config: SpacesConfig, objectKey: string): string {
  return `https://${config.cdnHost}/${objectKey}`;
}

/**
 * PUT one object. Public-read, because these are images inside published
 * articles; the ACL is the only thing about the object that is not private.
 */
export async function putObject(
  objectKey: string,
  body: Uint8Array,
  contentType: string,
  config = requireSpacesConfig(),
): Promise<string> {
  assertBucketAllowed(config.bucket);
  const host = `${config.bucket}.${config.region}.digitaloceanspaces.com`;
  const signed = signRequest({
    method: "PUT",
    path: `/${objectKey}`,
    host,
    region: config.region,
    service: "s3",
    accessKeyId: config.key,
    secretAccessKey: config.secret,
    headers: {
      "content-type": contentType,
      "content-length": String(body.byteLength),
      "x-amz-acl": "public-read",
      /* A rendition is immutable: its key carries the width, and a new upload
         gets a new key. A year is not a guess, it is what immutability means. */
      "cache-control": "public, max-age=31536000, immutable",
    },
    payload: body,
  });

  const response = await fetch(signed.url, {
    method: "PUT",
    headers: signed.headers,
    /* A view over the buffer, not the view itself: `BodyInit` accepts an
       ArrayBuffer and the Uint8Array's own type does not satisfy it under this
       lib target. `slice()` on the underlying buffer respects byteOffset, which
       a bare `.buffer` does not when sharp hands back a pooled allocation. */
    body: body.buffer.slice(
      body.byteOffset,
      body.byteOffset + body.byteLength,
    ) as ArrayBuffer,
  });
  if (!response.ok) {
    /* The body carries the S3 error code, and without it every failure reads
       as "upload failed" — which is the message that sends somebody to ask. */
    const detail = (await response.text()).slice(0, 400);
    throw new Error(
      `Storage refused ${objectKey}: HTTP ${response.status}. ${detail}`,
    );
  }
  return publicUrlFor(config, objectKey);
}
