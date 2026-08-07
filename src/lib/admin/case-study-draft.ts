import "server-only";

import matter from "gray-matter";
import { stringify as stringifyYaml } from "yaml";
import { caseStudyFrontmatterSchema } from "@/lib/content-schema";

/**
 * The case-study draft: what the cockpit is about to commit, validated BEFORE a
 * pull request exists.
 *
 * SPEC: round 20 §2.2. The pane's third requirement is that "a PR that CI will
 * fail should be impossible to open from the happy path", and the only way to
 * mean that is to run the build's own rules on the draft rather than a
 * paraphrase of them. So `caseStudyFrontmatterSchema` is imported, not restated:
 * a gate that re-implements what it checks is checking itself, and the same
 * argument applies to a form.
 *
 * WHAT THIS ADDS ON TOP OF THE SCHEMA, and why each is here rather than in the
 * schema itself:
 *
 *   - THE SLUG MATCHES THE FILENAME. `loadEntry` throws on a mismatch at build
 *     time, which is a build failure rather than a validation message, and it
 *     cannot be expressed inside a schema that never sees the path.
 *   - `clientPublic` GOVERNS THE PROSE, not only the field. This is the one that
 *     is not obvious and is the reason §2.2 names it. Every rendering surface
 *     already gates the client NAME and LOGO on the flag — /case-studies,
 *     the detail page, the homepage evidence rail, the platform module pages and
 *     the assistant corpus all read `clientPublic ? client : <generic>`. None of
 *     them reads the title, the deck, the excerpt or the body. So a study with
 *     `clientPublic: false` whose headline names the client publishes the name
 *     in 48px type under a card label reading "client confidential", and every
 *     one of those five call sites is behaving correctly. Refusing the draft is
 *     the only place that hole closes, and refusing is the instruction: the pane
 *     says so rather than silently anonymising.
 *   - A BODY THAT IS ACTUALLY THERE. `matter` returns an empty string for a file
 *     that is all frontmatter, the schema never sees the body, and the page
 *     renders a heading over nothing.
 *
 * Errors are per FIELD, because "validation failed" in a form that edits eleven
 * fields is the same message as no message at all.
 */

/** The fields the pane may edit. */
export const EDITABLE_FIELDS = [
  "title",
  "cardTitle",
  "deck",
  "excerpt",
  "client",
  "clientPublic",
  "region",
  "engagement",
  "category",
  "published",
] as const;

export type EditableField = (typeof EDITABLE_FIELDS)[number];

/**
 * `summary` is deliberately absent, and this is not an oversight. Every study in
 * the corpus writes it as a YAML folded block (`>-`) spanning several lines, and
 * the surgical writer below edits single-line scalars only. Widening it would
 * mean re-serialising the whole frontmatter to change one field, which turns a
 * one-line diff into a rewrite of the file and loses the folding on every
 * neighbouring field. `summary` is metadata description; it is edited in the
 * file, and the pane says so.
 */
export const NOT_EDITABLE_HERE = ["summary", "sources", "metrics"] as const;

export interface DraftError {
  field: string;
  message: string;
}

export interface Draft {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

/** Every published text surface a client name could reach a reader through. */
const PROSE_FIELDS = [
  "title",
  "cardTitle",
  "deck",
  "excerpt",
  "summary",
] as const;

/**
 * Does `haystack` name the client?
 *
 * Word-boundary, case-insensitive, and on the client string as written. Not a
 * fuzzy match: "Al Tayer" inside "Al Tayer Group" is a true positive and wanted,
 * while a substring test alone would flag any study whose client is a common
 * word. The check is deliberately conservative in the other direction too — it
 * cannot catch a paraphrase, and it does not pretend to. It catches the case
 * that actually occurs, which is the name copied verbatim out of the title.
 */
function namesClient(haystack: string, client: string): boolean {
  const needle = client.trim();
  if (needle.length < 3) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i").test(haystack);
}

export function validateDraft(draft: Draft): DraftError[] {
  const errors: DraftError[] = [];
  const fm = draft.frontmatter;

  const parsed = caseStudyFrontmatterSchema.safeParse(fm);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push({
        field: issue.path.join(".") || "frontmatter",
        message: issue.message,
      });
    }
  }

  if (fm.slug !== draft.slug) {
    errors.push({
      field: "slug",
      message:
        `Frontmatter slug "${String(fm.slug)}" does not match the file name ` +
        `"${draft.slug}". The build reads the file name and throws on this, so ` +
        "a pull request carrying it fails CI rather than publishing.",
    });
  }

  if (draft.body.trim() === "") {
    errors.push({
      field: "body",
      message:
        "The body is empty. Frontmatter alone renders a page that is a heading " +
        "over nothing, and no schema can see it.",
    });
  }

  if (fm.clientPublic === false && typeof fm.client === "string") {
    for (const field of PROSE_FIELDS) {
      const value = fm[field];
      if (typeof value === "string" && namesClient(value, fm.client)) {
        errors.push({
          field,
          message:
            `clientPublic is false, but ${field} names "${fm.client}". Every ` +
            "rendering surface gates the client field and the logo on that " +
            "flag and none of them reads this one, so the name would publish " +
            "here while the card reads as confidential. Either set " +
            "clientPublic true once written consent is on file, or take the " +
            "name out of this field.",
        });
      }
    }
    if (namesClient(draft.body, fm.client)) {
      errors.push({
        field: "body",
        message:
          `clientPublic is false, but the body names "${fm.client}". The body ` +
          "renders verbatim; nothing anonymises it.",
      });
    }
  }

  return errors;
}

/* --------------------------------------------------------- reading a draft */

export function parseStudyFile(slug: string, source: string): Draft {
  const { data, content } = matter(source);
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : data.date;
  return { slug, frontmatter: { ...data, date }, body: content };
}

/* --------------------------------------------------------- writing a draft */

export class DraftWriteError extends Error {}

/**
 * One scalar, replaced in place, with every other byte of the file untouched.
 *
 * WHY NOT `matter.stringify`. Round-tripping the whole document through a YAML
 * serialiser to flip one boolean rewrites every field it did not need to touch:
 * the folded `summary` blocks collapse to quoted one-liners, quote styles
 * normalise, and key order can move. The pull request for "unpublish this
 * study" would then be a 24-line diff in which the one line that matters is
 * invisible, and the reviewer that diff exists for is a human. A scalar edit
 * produces a one-line diff.
 *
 * Scoped to the frontmatter block by construction: the search starts after the
 * opening `---` and stops at the closing one, so a line in the body that happens
 * to start `title:` is never the match.
 */
export function writeScalar(
  source: string,
  key: string,
  value: string | number | boolean,
): string {
  const lines = source.split("\n");
  if (lines[0]?.trim() !== "---") {
    throw new DraftWriteError(
      "This file does not open with a frontmatter fence, so there is no block " +
        "to edit and the write is refused rather than guessed at.",
    );
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) {
    throw new DraftWriteError("The frontmatter block is never closed.");
  }

  /* `yaml` decides the quoting, not a template literal. A client name with an
     apostrophe or a title with a colon in it is exactly the value that breaks a
     hand-rolled writer, and both are present in this corpus. */
  const serialised = stringifyYaml({ [key]: value }).trimEnd();

  const at = lines
    .slice(1, end)
    .findIndex((line) => line.startsWith(`${key}:`));
  if (at === -1) {
    /* Absent keys are appended at the end of the block rather than inserted at a
       guessed position. `published` is the case that matters: it is optional and
       most studies omit it, so unpublishing one is an insert, not a replace. */
    lines.splice(end, 0, serialised);
    return lines.join("\n");
  }

  const index = at + 1;
  /* A multi-line value — a folded block, a list — is refused rather than
     half-overwritten. EDITABLE_FIELDS is the allow list this can never be
     called outside, and this is the assertion that keeps that true if it is. */
  const next = lines[index + 1] ?? "";
  if (/^\s+\S/.test(next) && lines[index]?.match(/:\s*[|>]/)) {
    throw new DraftWriteError(
      `"${key}" is written as a multi-line YAML block. This writer edits ` +
        "single-line scalars, so it refuses rather than truncating the value.",
    );
  }
  lines[index] = serialised;
  return lines.join("\n");
}

/** The body, replaced. Frontmatter block preserved byte for byte. */
export function writeBody(source: string, body: string): string {
  const lines = source.split("\n");
  if (lines[0]?.trim() !== "---") {
    throw new DraftWriteError(
      "This file does not open with a frontmatter fence.",
    );
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) {
    throw new DraftWriteError("The frontmatter block is never closed.");
  }
  const head = lines.slice(0, end + 1).join("\n");
  return `${head}\n${body.replace(/\s+$/, "")}\n`;
}
