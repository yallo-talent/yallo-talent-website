import { createHash, createHmac } from "node:crypto";

/**
 * AWS Signature Version 4, for a single PUT to an S3-compatible endpoint.
 *
 * WHY THIS IS HAND-WRITTEN RATHER THAN `@aws-sdk/client-s3`. The SDK is a
 * multi-megabyte dependency tree whose surface is credential providers, retry
 * middleware, streaming multipart and a hundred operations, of which this
 * codebase needs exactly one: put an object with a known key, a known length
 * and a known content type. The signing algorithm below is about seventy lines
 * and is fully specified by a public document with published test vectors, so
 * it can be VERIFIED rather than trusted — which is the point. See
 * `e2e/media.spec.ts`, which runs AWS's own documented example through it and
 * compares the signature byte for byte.
 *
 * NOT `server-only` so that verification can import it. It holds no secret; it
 * takes one as an argument, which is a different thing.
 *
 * UNSIGNED PAYLOADS ARE NOT USED. The body hash goes into the canonical request
 * and into `x-amz-content-sha256`, so a proxy cannot alter the bytes between
 * here and the bucket without the signature failing.
 */

const ALGORITHM = "AWS4-HMAC-SHA256";

function sha256Hex(data: string | Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmac(key: Uint8Array | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

/**
 * Percent-encode for a canonical URI path.
 *
 * The unreserved set is deliberately narrow: everything outside
 * `A-Za-z0-9-._~` is encoded, and `/` is preserved because a key's slashes are
 * path separators. Encoding the slash is the single most common way a
 * hand-rolled signer produces a signature that does not match.
 */
export function encodeRfc3986(value: string, keepSlash = false): string {
  let out = "";
  for (const char of value) {
    if (/[A-Za-z0-9\-._~]/.test(char) || (keepSlash && char === "/")) {
      out += char;
      continue;
    }
    for (const byte of Buffer.from(char, "utf8")) {
      out += `%${byte.toString(16).toUpperCase().padStart(2, "0")}`;
    }
  }
  return out;
}

/**
 * The four-step signing key derivation, exported so it can be checked against
 * AWS's published known answer rather than trusted.
 *
 * This is the half of SigV4 that is pure cryptography with a documented test
 * vector: the canonical request depends on the request, but the signing key
 * depends only on the secret, the date, the region and the service, and AWS
 * publishes the exact bytes for one such tuple. See `e2e/media.spec.ts`.
 */
export function signingKey(
  secretAccessKey: string,
  dateStamp: string,
  region: string,
  service: string,
): Buffer {
  return hmac(
    hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateStamp), region), service),
    "aws4_request",
  );
}

export interface SignInput {
  method: string;
  /** Absolute object path beginning with a slash, not yet encoded. */
  path: string;
  host: string;
  region: string;
  service: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Header names are lower-cased and sorted by this function, not by callers. */
  headers: Record<string, string>;
  payload: Uint8Array | string;
  /** Injectable so the published test vectors can be reproduced exactly. */
  now?: Date;
}

export interface SignedRequest {
  url: string;
  headers: Record<string, string>;
  /** Exposed for verification; the caller does not need to read it. */
  canonicalRequest: string;
  stringToSign: string;
  signature: string;
}

export function signRequest(input: SignInput): SignedRequest {
  const now = input.now ?? new Date();
  const amzDate = `${now.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(input.payload);

  const headers: Record<string, string> = {
    ...input.headers,
    host: input.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  const canonicalHeaderNames = Object.keys(headers)
    .map((name) => name.toLowerCase())
    .sort();
  const lowered: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    lowered[name.toLowerCase()] = String(value).trim().replace(/\s+/g, " ");
  }
  const canonicalHeaders = `${canonicalHeaderNames
    .map((name) => `${name}:${lowered[name]}`)
    .join("\n")}\n`;
  const signedHeaders = canonicalHeaderNames.join(";");

  const canonicalRequest = [
    input.method,
    encodeRfc3986(input.path, true),
    /* No query string on any request this signs. An empty canonical query
       string is an empty line, not an omitted one. */
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${input.region}/${input.service}/aws4_request`;
  const stringToSign = [
    ALGORITHM,
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const key = signingKey(
    input.secretAccessKey,
    dateStamp,
    input.region,
    input.service,
  );
  const signature = createHmac("sha256", key)
    .update(stringToSign, "utf8")
    .digest("hex");

  return {
    url: `https://${input.host}${encodeRfc3986(input.path, true)}`,
    headers: {
      ...headers,
      Authorization: `${ALGORITHM} Credential=${input.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    canonicalRequest,
    stringToSign,
    signature,
  };
}
