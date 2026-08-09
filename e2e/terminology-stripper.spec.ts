import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

/**
 * R-25c.2 — THE STRIPPER'S OWED RED-PROOF, MADE REPEATABLE.
 *
 * Relay v35 §11 fixed `stripComments` and said plainly that half the proof was
 * still owed: the state-corruption bug was real and fixed, but the specific
 * false finding v34 reported had not been reproduced, and the fixture built for
 * it scanned clean under BOTH strippers. R-25c.2 ruled that the input was
 * recoverable rather than inventable, and it was.
 *
 * WHAT WAS RECOVERED, and it is not a manufactured case. `src/lib/assistant/
 * client.ts` has carried `CITATION_PATTERN` since 7 August:
 *
 *   const CITATION_PATTERN =
 *     /(?<=^|[\s("'])\/(?:[a-z][a-z0-9/-]*|(?=[\s.,;:!?)"']|$))/g;
 *
 * A regex literal containing BOTH quote characters. The old stripper classified
 * every `/` as either a comment opener or an ordinary character, so that literal
 * put it into a single-quoted string state it never left, and every comment
 * after it went unstripped. Run against the historical file, the old stripper
 * falsely keeps 2 comment em dashes at `7c8cb0b`, 2 at `be16a33` and 3 at
 * `cb0761c`; the new stripper keeps none of them. The full run is committed at
 * `docs/status/round25c/r25c2-stripper-redproof.log`.
 *
 * WHY THIS TEST EXISTS AS WELL AS THAT LOG. The log is evidence of one run
 * against files that only exist in history. This is the property, asserted
 * against the CURRENT gate, so it stays true: the construct that broke it is
 * reproduced here in miniature, and the third leg — a real em dash in copy is
 * still caught — is asserted alongside, because a stripper that strips
 * everything would pass the first two legs and be useless.
 */

function runGate(fileBody: string): { code: number; output: string } {
  const dir = mkdtempSync(join(tmpdir(), "strip-"));
  try {
    /* The gate walks `src/`, so the fixture has to live there to be seen. It is
       created and removed inside this test and nothing else can observe it. */
    const target = join(process.cwd(), "src", "__stripper-fixture.ts");
    writeFileSync(target, fileBody, "utf8");
    try {
      const output = execFileSync(
        "node",
        [join(process.cwd(), "scripts", "check-terminology.mjs")],
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      );
      return { code: 0, output };
    } catch (err) {
      const e = err as { status: number; stdout: string; stderr: string };
      return { code: e.status, output: `${e.stdout ?? ""}${e.stderr ?? ""}` };
    } finally {
      rmSync(target, { force: true });
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/* The construct, in miniature: a regex literal carrying both quote characters,
   then a comment containing an em dash. Verbatim in shape from the real
   CITATION_PATTERN, which is what makes this the recovered case rather than an
   invented one. */
const REGEX_THEN_COMMENT = `const P = /(?<=^|[\\s("'])\\/[a-z][a-z0-9/-]*/g;

/**
 * A comment carrying an em dash — like this one — after that literal.
 */
export const value = P.source.length;
`;

const REAL_COPY_EM_DASH = `const P = /(?<=^|[\\s("'])\\/[a-z][a-z0-9/-]*/g;

export const message = "Send a brief — we reply within 72 hours.";
export const value = P.source.length;
`;

test.describe("R-25c.2 — the comment stripper", () => {
  test("a comment em dash after a quote-carrying regex literal scans clean", () => {
    const { code, output } = runGate(REGEX_THEN_COMMENT);
    expect(
      output,
      "the em dash inside the comment was reported as published copy",
    ).not.toContain("__stripper-fixture");
    expect(code).toBe(0);
  });

  test("a real em dash in COPY after the same literal is still caught", () => {
    /* The leg that stops the fix being "strip everything". Without it, a
       stripper that discarded the whole file would pass the test above. */
    const { code, output } = runGate(REAL_COPY_EM_DASH);
    expect(code).toBe(1);
    expect(output).toContain("__stripper-fixture");
  });
});
