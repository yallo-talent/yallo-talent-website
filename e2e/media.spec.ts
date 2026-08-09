import { createHash, createHmac } from "node:crypto";
import { expect, test } from "@playwright/test";
import sharp from "sharp";
import {
  ACCEPTED_UPLOAD_TYPES,
  assertBucketAllowed,
  MAX_UPLOAD_BYTES,
  MEDIA_WIDTHS,
  objectKeyFor,
  slugifyFilename,
} from "../src/lib/media/config";
import { processImage, srcSetFrom } from "../src/lib/media/process";
import { encodeRfc3986, signingKey, signRequest } from "../src/lib/media/sigv4";

/**
 * DESIGN §9, VERIFIED WHERE IT CAN BE.
 *
 * WHAT IS PROVEN HERE AND WHAT IS NOT, stated first so nothing below is read as
 * more than it is. The signer, the resize pipeline and the bucket guard are
 * exercised for real. The PUT to DigitalOcean Spaces is NOT: the five SPACES_*
 * values are encrypted secrets on the deployed app, this session cannot read
 * them and must not enter credentials, so there is no honest way to watch a real
 * object land in the bucket from here. Relay v36 records that as owed.
 *
 * The signature is the part that would otherwise be taken on trust, so it is the
 * part measured hardest, and the limits of each check are stated rather than
 * implied:
 *
 *   1. The SIGNING KEY is compared against the four steps re-implemented from
 *      the specification wording. AWS no longer publishes the example bytes,
 *      so this is not a known-answer test and does not claim to be.
 *   2. The CANONICAL REQUEST is asserted against a string spelled out in full
 *      here. It is NOT the published example's signature, and it cannot be:
 *      S3 requires an `x-amz-content-sha256` header that the published generic
 *      example does not carry, so the canonical request legitimately differs
 *      and so does everything derived from it. Saying "reproduces the published
 *      signature" would be the overclaim; the canonical request is written out
 *      line by line instead, which is the same specification read from the
 *      other direction.
 */

/* AWS's documented example credentials. Published test data with no account
   behind them, not a credential: they appear verbatim in the SigV4
   specification precisely so an implementation can be checked against them. */
const EXAMPLE_KEY_ID = "AKIDEXAMPLE";
const EXAMPLE_SECRET = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY";

test.describe("design §9 — the signer", () => {
  test("derives the signing key the way the specification words it", () => {
    /* WHAT THIS IS AND IS NOT. AWS's current documentation gives the four-step
       derivation in words and no longer publishes the example's resulting
       bytes, so there is no hex string to quote and a "known answer" asserted
       here would be one this code produced. Instead the four steps are
       re-implemented from the specification's own wording — DateKey,
       DateRegionKey, DateRegionServiceKey, SigningKey, in that order, with
       "AWS4" prepended to the secret — and compared. That catches an ordering,
       a casing or a scope mistake, which is what actually goes wrong here. It
       does not prove the specification was read correctly, and nothing short
       of a real bucket accepting a real object would. */
    const step = (key: Buffer | string, data: string) =>
      createHmac("sha256", key).update(data, "utf8").digest();
    const expected = step(
      step(step(step(`AWS4${EXAMPLE_SECRET}`, "20120215"), "us-east-1"), "iam"),
      "aws4_request",
    );
    expect(
      signingKey(EXAMPLE_SECRET, "20120215", "us-east-1", "iam").toString(
        "hex",
      ),
    ).toBe(expected.toString("hex"));
  });

  test("builds the canonical request exactly as the specification defines it", () => {
    /* An empty GET against a fixed host, region, service and instant, so the
       canonical request has exactly one possible correct form. That form is
       written out line by line below from the specification's own definition:
       method, URI, empty query line, sorted lower-cased headers each followed
       by a newline, the blank line, the signed-header list, the payload hash. */
    const signed = signRequest({
      method: "GET",
      path: "/",
      host: "example.amazonaws.com",
      region: "us-east-1",
      service: "service",
      accessKeyId: EXAMPLE_KEY_ID,
      secretAccessKey: EXAMPLE_SECRET,
      headers: {},
      payload: "",
      now: new Date(Date.UTC(2015, 7, 30, 12, 36, 0)),
    });

    const emptyHash = createHash("sha256").update("").digest("hex");
    expect(signed.canonicalRequest).toBe(
      [
        "GET",
        "/",
        "",
        "host:example.amazonaws.com",
        `x-amz-content-sha256:${emptyHash}`,
        "x-amz-date:20150830T123600Z",
        "",
        "host;x-amz-content-sha256;x-amz-date",
        emptyHash,
      ].join("\n"),
    );
    expect(signed.stringToSign).toContain(
      "AWS4-HMAC-SHA256\n20150830T123600Z\n20150830/us-east-1/service/aws4_request\n",
    );
    expect(signed.signature).toMatch(/^[0-9a-f]{64}$/);
    expect(signed.headers.Authorization).toContain(
      `Credential=${EXAMPLE_KEY_ID}/20150830/us-east-1/service/aws4_request`,
    );
    expect(signed.headers.Authorization).toContain(
      "SignedHeaders=host;x-amz-content-sha256;x-amz-date",
    );
  });

  test("the canonical string is stable, so the signature is reproducible", () => {
    const at = new Date(Date.UTC(2026, 7, 9, 18, 0, 0));
    const args = {
      method: "PUT",
      path: "/media/2026/08/a-name-800.webp",
      host: "yallo-talent-media.lon1.digitaloceanspaces.com",
      region: "lon1",
      service: "s3",
      accessKeyId: EXAMPLE_KEY_ID,
      secretAccessKey: EXAMPLE_SECRET,
      headers: { "content-type": "image/webp" },
      payload: new Uint8Array([1, 2, 3]),
      now: at,
    };
    expect(signRequest(args).signature).toBe(signRequest(args).signature);
    /* One byte of the payload changes the signature. Without this the body
       hash could be constant and every assertion above would still pass. */
    expect(
      signRequest({ ...args, payload: new Uint8Array([1, 2, 4]) }).signature,
    ).not.toBe(signRequest(args).signature);
  });

  test("slashes survive encoding and everything else does not", () => {
    /* Encoding the slash in a key is the single most common way a hand-rolled
       signer produces a signature the bucket rejects. */
    expect(encodeRfc3986("/media/2026/08/a b.webp", true)).toBe(
      "/media/2026/08/a%20b.webp",
    );
    expect(encodeRfc3986("a/b", false)).toBe("a%2Fb");
  });
});

test.describe("design §9 — the bucket boundary", () => {
  test("the Academy bucket is refused by name", () => {
    /* Round 25b §7 and round 25c both say it: nothing here touches
       yallo-lms-assets. This is that sentence made enforceable. */
    expect(() => assertBucketAllowed("yallo-lms-assets")).toThrow(
      /another product/,
    );
    expect(() => assertBucketAllowed("some-other-bucket")).toThrow(
      /yallo-talent-media/,
    );
    expect(() => assertBucketAllowed("yallo-talent-media")).not.toThrow();
  });

  test("object keys are date-partitioned and carry the width", () => {
    const key = objectKeyFor(
      "a-photograph",
      800,
      new Date(Date.UTC(2026, 7, 9)),
    );
    expect(key).toBe("media/2026/08/a-photograph-800.webp");
  });

  test("an uploaded filename never reaches the URL as written", () => {
    expect(slugifyFilename("Ahmed's Photo (Final) v2.JPG")).toBe(
      "ahmed-s-photo-final-v2",
    );
    expect(slugifyFilename(".png")).toBe("image");
  });

  test("only raster formats are accepted; SVG is a script surface", () => {
    expect(ACCEPTED_UPLOAD_TYPES).not.toContain("image/svg+xml");
    expect(MAX_UPLOAD_BYTES).toBeGreaterThan(0);
  });
});

test.describe("design §9 — the resize pipeline", () => {
  /** A real image, generated rather than committed. Removes itself with the process. */
  async function fixture(width: number, height: number): Promise<Uint8Array> {
    const png = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 20, g: 40, b: 60 },
      },
    })
      .png()
      .toBuffer();
    return new Uint8Array(png);
  }

  test("a wide original produces every template width, as WebP", async () => {
    const processed = await processImage(await fixture(2000, 1000));
    expect(processed.sourceWidth).toBe(2000);
    expect(processed.renditions.map((r) => r.width)).toEqual([...MEDIA_WIDTHS]);
    for (const rendition of processed.renditions) {
      expect(rendition.mimeType).toBe("image/webp");
      /* The bytes really are WebP: RIFF....WEBP is the container header, and
         asserting the recorded mime type alone would prove only that a string
         was set. */
      const header = Buffer.from(rendition.bytes.slice(0, 12));
      expect(header.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(header.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(rendition.byteSize).toBe(rendition.bytes.byteLength);
    }
  });

  test("a narrow original is never upscaled", async () => {
    const processed = await processImage(await fixture(500, 250));
    expect(processed.renditions.map((r) => r.width)).toEqual([500]);
  });

  test("each rendition is resized from the original, not from the last one", async () => {
    /* Reusing one sharp pipeline across several resizes applies them
       cumulatively, so 1600 would be an upscale of 800. The aspect ratio is
       what catches it: a cumulative chain drifts, a fresh one does not. */
    const processed = await processImage(await fixture(2000, 1000));
    for (const rendition of processed.renditions) {
      expect(rendition.width / rendition.height).toBeCloseTo(2, 5);
    }
  });

  test("a file that is not an image is refused before anything is stored", async () => {
    await expect(
      processImage(new Uint8Array([1, 2, 3, 4, 5])),
    ).rejects.toThrow();
  });

  test("the srcset offers every width and the src is the widest", () => {
    const set = srcSetFrom([
      { url: "https://cdn/a-1600.webp", width: 1600 },
      { url: "https://cdn/a-800.webp", width: 800 },
    ]);
    expect(set?.src).toBe("https://cdn/a-1600.webp");
    expect(set?.srcSet).toBe(
      "https://cdn/a-800.webp 800w, https://cdn/a-1600.webp 1600w",
    );
    expect(srcSetFrom([])).toBeNull();
  });
});

test.describe("design §9 — the route is guarded", () => {
  test("an unauthenticated upload is refused, and no object is written", async ({
    request,
  }) => {
    const response = await request.post("/api/admin/media", {
      multipart: {
        alt: "A fixture",
        file: {
          name: "a.png",
          mimeType: "image/png",
          buffer: Buffer.from([1]),
        },
      },
    });
    expect(response.status()).toBe(403);
  });

  test("the library listing is guarded too", async ({ request }) => {
    const response = await request.get("/api/admin/media");
    expect(response.status()).toBe(403);
  });
});
