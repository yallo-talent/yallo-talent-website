import "server-only";
import { cookies } from "next/headers";
import { caseStudyOrder } from "@/lib/case-study-order";

/**
 * The case-study order as it is being edited, before anyone publishes it.
 *
 * WHY THIS EXISTS, round 23 §5. Every move used to open its own pull request.
 * Nine moves therefore produced nine pull requests against the same base, and
 * whichever merged first encoded one move rather than the order that was built.
 * That is not a hypothetical: it is #14 to #18, closed unmerged at the top of
 * this round. Reordering is ONE editorial decision and it now produces ONE pull
 * request.
 *
 * WHY A COOKIE. §5 requires that an abandoned staged state either survives a
 * refresh or is plainly discarded, and asks for one of the two, visibly. A
 * cookie survives, which is the more forgiving of the two: closing the tab
 * mid-rerank does not silently lose the work. It is httpOnly and scoped to the
 * admin path, it holds slugs and nothing else, and the pane shows a banner
 * naming how many moves are staged with a Discard button beside it, so a
 * surviving state can never be invisible.
 *
 * WHY NOT THE DATABASE. A staged order is per-person, short-lived, and worth
 * nothing once published. A table for it would be a migration, a retention
 * question and a second store to reason about, for a value whose entire life is
 * one sitting at one desk.
 *
 * THE STAGED ORDER IS VALIDATED AGAINST THE COMMITTED ONE ON EVERY READ. If a
 * study is added or deleted in the file while an order is staged, the staged
 * list is stale and silently republishing it would resurrect or drop a study.
 * `readStagedOrder` returns null in that case and the pane says the staged state
 * was dropped because the underlying list changed.
 */

const COOKIE = "yallo-staged-order";

/* Cookie limits are a few kilobytes and this list is nine slugs today. Storing
   the slugs rather than a diff means the pane never has to replay moves to know
   what it is showing. */
const encode = (slugs: string[]): string => slugs.join(" ");
const decode = (raw: string): string[] =>
  raw.split(" ").filter((s) => s.length > 0);

export interface StagedOrder {
  slugs: string[];
  /** How many positions differ from what is committed. Zero means nothing to publish. */
  moved: number;
}

/** The order as committed in `content/case-studies/order.yaml`. */
export function committedOrder(): string[] {
  return [...caseStudyOrder()];
}

function countMoved(staged: string[], committed: string[]): number {
  let n = 0;
  for (let i = 0; i < staged.length; i++) {
    if (staged[i] !== committed[i]) n += 1;
  }
  return n;
}

/**
 * The staged order, or null when there is none or the one there is has gone
 * stale. Never throws: a malformed cookie is treated as no cookie.
 */
export async function readStagedOrder(): Promise<StagedOrder | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const staged = decode(raw);
  const committed = committedOrder();

  /* Same members, or it is stale. Length alone is not enough: a study deleted
     and another added keeps the count and changes the set. */
  if (staged.length !== committed.length) return null;
  const committedSet = new Set(committed);
  if (staged.some((slug) => !committedSet.has(slug))) return null;

  return { slugs: staged, moved: countMoved(staged, committed) };
}

export async function writeStagedOrder(slugs: string[]): Promise<void> {
  (await cookies()).set(COOKIE, encode(slugs), {
    httpOnly: true,
    sameSite: "lax",
    /* Scoped to the cockpit, so it is never sent with a request for a public
       page. It carries no secret, and it still has no business being there. */
    path: "/admin",
    /* A working session, not a persistent preference. */
    maxAge: 60 * 60 * 12,
  });
}

/**
 * Discards the staged order.
 *
 * Written as an expiring `set` rather than `delete`, and that is not a style
 * choice: measured here, `cookies().delete({ name, path })` left the cookie in
 * place and the banner survived a Discard click. Overwriting it with an empty
 * value and `maxAge: 0`, on exactly the attributes it was written with, is the
 * form the browser acts on. `readStagedOrder` already treats an empty value as
 * no cookie, so the two agree either way.
 */
export async function clearStagedOrder(): Promise<void> {
  (await cookies()).set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 0,
  });
}

/**
 * One move applied to whichever order is currently in play.
 *
 * Returns null when the move is impossible, so the caller reports it rather
 * than silently producing an unchanged list that looks like a successful click.
 */
export function movedOrder(
  current: string[],
  slug: string,
  direction: "up" | "down",
): string[] | null {
  const from = current.indexOf(slug);
  if (from === -1) return null;
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= current.length) return null;
  const next = [...current];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}
