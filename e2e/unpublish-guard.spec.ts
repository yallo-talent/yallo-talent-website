import { expect, test } from "@playwright/test";
import { legacySourcesFor, redirectEntries } from "../src/data/redirects.mjs";
import { unpublishRefusal } from "../src/lib/admin/content-validation";

/**
 * R-25b.4 — THE UNPUBLISH GUARD, PROVEN IN BOTH DIRECTIONS.
 *
 * Taking a case study back to draft turns every legacy URL aimed at it into a
 * two-hop chain: the legacy path 301s to `/case-studies/<slug>`, which then
 * redirects to the hub because the row is no longer published. `check:redirects`
 * notices on the next full CI lane, and the window until then is long enough for
 * a person to open the URL. So the publish action refuses, naming the URL.
 *
 * BOTH DIRECTIONS, because a guard that only ever refuses cannot be told apart
 * from one that refuses everything. A slug a legacy URL names must be refused; a
 * slug no legacy URL names must pass; and the refusal must carry the real,
 * openable address rather than the internal source pattern.
 *
 * NO FIXTURE IS WRITTEN. The lookup is pure over the compiled redirect map, so
 * this needs no database and creates nothing. The rows it names are the real
 * published studies, read rather than modified.
 */

const REAL_STUDY = "enabling-sap-s-4hana-transformation-for-al-tayer-group";

test.describe("R-25b.4 — refuses", () => {
  test("a study a legacy URL names is found by the lookup", () => {
    const found = legacySourcesFor(`/case-studies/${REAL_STUDY}`);
    expect(found.length).toBeGreaterThan(0);
  });

  test("the address it names is the one a person can open", () => {
    /* The ported studies are query-string entries whose `source` is `/` with a
       `has` condition. Naming the source alone would tell somebody their
       homepage is about to break, which is worse than saying nothing. */
    const found = legacySourcesFor(`/case-studies/${REAL_STUDY}`);
    for (const url of found) {
      expect(url).not.toBe("/");
      expect(url).toContain(REAL_STUDY);
    }
  });

  test("every published study with a legacy URL is covered, not just one", () => {
    /* The rule is a class. Asserting it on one slug would leave the other eight
       to a hand-check nobody repeats. */
    const studyDestinations = redirectEntries()
      .map((e) => e.destination)
      .filter((d) => d.startsWith("/case-studies/"));
    expect(studyDestinations.length).toBeGreaterThan(0);
    for (const destination of new Set(studyDestinations)) {
      expect(legacySourcesFor(destination).length).toBeGreaterThan(0);
    }
  });
});

test.describe("R-25b.4 — permits", () => {
  test("a slug no legacy URL names returns nothing", () => {
    expect(
      legacySourcesFor("/case-studies/a-study-that-never-existed"),
    ).toEqual([]);
  });

  test("the hub itself is not treated as a named study", () => {
    /* A retired study's legacy URL points at `/case-studies`, the hub. The
       guard asks about `/case-studies/<slug>`, so the hub's own entries must
       not make every study look protected. */
    expect(legacySourcesFor("/case-studies/")).toEqual([]);
  });

  test("an article path is outside the guard entirely", () => {
    /* The ruling names case studies. Articles have their own legacy handling
       and none is published, so a guard reaching them would refuse a state
       nobody can currently be in. */
    expect(legacySourcesFor("/insights/anything-at-all")).toEqual([]);
  });
});

/**
 * THE ACTION'S DECISION, watched both ways.
 *
 * The lookup above proves which URLs exist. This proves what the publish action
 * DOES with them, which is the half that would otherwise be believed rather
 * than measured. The decision is a pure function for exactly that reason: the
 * action is a POST endpoint needing a session and a real row, so a decision
 * living inside it is a decision no test reaches.
 */
test.describe("R-25b.4 — the action's decision", () => {
  test("refuses draft, refuses archived, and names the URL", () => {
    for (const next of ["draft", "archived"]) {
      const message = unpublishRefusal(
        "case_study",
        next,
        REAL_STUDY,
        legacySourcesFor,
      );
      expect(message).not.toBeNull();
      expect(message).toContain(REAL_STUDY);
      /* R-26.1's second clause: this is the one refusal left in the cockpit, so
         its message has to be an explanation carrying a single action rather
         than a diagnosis in the vocabulary of the redirect table. "two-hop" was
         what the old message said, and it is not a phrase the person clicking
         Unpublish has any reason to know. */
      expect(message).toContain("no longer served");
      expect(message).toContain("The one action that resolves it");
      expect(message).toContain("src/data/redirects.mjs");
    }
  });

  test("permits publishing the same study", () => {
    expect(
      unpublishRefusal("case_study", "published", REAL_STUDY, legacySourcesFor),
    ).toBeNull();
  });

  test("permits unpublishing a study no legacy URL names", () => {
    expect(
      unpublishRefusal(
        "case_study",
        "draft",
        "a-study-that-never-existed",
        legacySourcesFor,
      ),
    ).toBeNull();
  });

  test("leaves articles alone entirely", () => {
    expect(
      unpublishRefusal("article", "draft", REAL_STUDY, legacySourcesFor),
    ).toBeNull();
  });
});
