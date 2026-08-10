import { expect, test } from "@playwright/test";
import {
  type Capability,
  canAssignRole,
  canDo,
  canManageAccount,
  canSee,
  isRole,
  landingFor,
  PANES,
  type Pane,
  panesFor,
  ROLES,
  type Role,
} from "../src/lib/admin/roles";

/**
 * THE FOUR ROLES OF CANON A4, EVERY GUARD WATCHED REFUSING.
 *
 * Round 23 red-proved three roles the same way and this replaces that: a role
 * table asserts a NEGATIVE — that a role cannot reach a pane — and a negative
 * that has never been watched holding is a table nobody has any reason to
 * believe. So every cell of the matrix is asserted in both directions, and the
 * two rules that are not a matrix at all get their own cases.
 *
 * NO ACCOUNT IS CREATED. These are pure functions over a role string. Round 25
 * forbids creating a real account and a test that made one to prove a guard
 * would be creating exactly that.
 */

/** The whole access matrix, written out rather than derived from the thing it
    is checking. A test that computes its own expectation from the code under
    test asserts only that the code agrees with itself. */
/**
 * The matrix is written out BY HAND, deliberately, and that is the whole value
 * of this file: deriving it from `PANE_ROLES` would assert that the table
 * equals itself. It is canon A4 transcribed, so a change to the code has to be
 * met by a change here, made by somebody reading the canon.
 *
 * `media` joined it in round 25c. Canon A4: "editor reaches articles, case
 * studies and media only". The pane was added and this matrix was not, so three
 * assertions went red claiming owner, admin and editor are refused a pane they
 * reach — the enumerating-guard rule in AGENTS.md, caught by the guard it
 * exists to protect.
 */
const MATRIX: Record<Role, Pane[]> = {
  owner: [
    "briefs",
    "conversations",
    "caseStudies",
    "articles",
    "media",
    "users",
  ],
  admin: [
    "briefs",
    "conversations",
    "caseStudies",
    "articles",
    "media",
    "users",
  ],
  editor: ["caseStudies", "articles", "media"],
  ops: ["briefs"],
};

test("the four roles are exactly owner, admin, editor, ops", () => {
  expect([...ROLES]).toEqual(["owner", "admin", "editor", "ops"]);
});

test("nothing outside the four is a role", () => {
  for (const notARole of ["administrator", "superuser", "OWNER", "", "root"]) {
    expect(isRole(notARole)).toBe(false);
  }
});

for (const role of ROLES) {
  test.describe(`${role}`, () => {
    for (const pane of PANES) {
      const allowed = MATRIX[role].includes(pane);
      test(`${allowed ? "reaches" : "is REFUSED"} ${pane}`, () => {
        expect(canSee(role, pane)).toBe(allowed);
      });
    }

    test("lands on a pane it can actually see", () => {
      const landing = landingFor(role);
      expect(panesFor(role).length).toBeGreaterThan(0);
      expect(landing).not.toContain("sign-in");
    });
  });
}

test.describe("no session reaches anything", () => {
  for (const pane of PANES) {
    test(`null is REFUSED ${pane}`, () => {
      expect(canSee(null, pane)).toBe(false);
      expect(canSee(undefined, pane)).toBe(false);
    });
  }
  for (const capability of [
    "briefsWrite",
    "usersManage",
    "ownerAssign",
  ] as Capability[]) {
    test(`null is REFUSED ${capability}`, () => {
      expect(canDo(null, capability)).toBe(false);
    });
  }
});

test.describe("the /privacy promise, in code", () => {
  test("only owner and admin read assistant conversations", () => {
    const readers = ROLES.filter((r) => canSee(r, "conversations"));
    expect(readers).toEqual(["owner", "admin"]);
  });

  test("editor and ops are REFUSED, which is what the notice says", () => {
    expect(canSee("editor", "conversations")).toBe(false);
    expect(canSee("ops", "conversations")).toBe(false);
  });
});

test.describe("the owner cannot be demoted or disabled by anyone", () => {
  for (const actor of ROLES) {
    test(`${actor} is REFUSED management of the owner`, () => {
      expect(canManageAccount(actor, "owner")).toBe(false);
    });
  }

  test("including an owner acting on an owner, which is the literal reading", () => {
    expect(canManageAccount("owner", "owner")).toBe(false);
  });

  test("but an owner and an admin can manage every other role", () => {
    for (const target of ["admin", "editor", "ops"] as Role[]) {
      expect(canManageAccount("owner", target)).toBe(true);
      expect(canManageAccount("admin", target)).toBe(true);
    }
  });

  test("and an editor or ops can manage nobody", () => {
    for (const actor of ["editor", "ops"] as Role[]) {
      for (const target of ROLES) {
        expect(canManageAccount(actor, target)).toBe(false);
      }
    }
  });
});

test.describe("only an owner may make an owner", () => {
  test("an admin is REFUSED", () => {
    expect(canAssignRole("admin", "owner")).toBe(false);
  });

  test("an owner may", () => {
    expect(canAssignRole("owner", "owner")).toBe(true);
  });

  test("both may assign every lesser role", () => {
    for (const next of ["admin", "editor", "ops"] as Role[]) {
      expect(canAssignRole("owner", next)).toBe(true);
      expect(canAssignRole("admin", next)).toBe(true);
    }
  });

  test("an editor and ops may assign nothing at all", () => {
    for (const actor of ["editor", "ops"] as Role[]) {
      for (const next of ROLES) {
        expect(canAssignRole(actor, next)).toBe(false);
      }
    }
  });
});

test.describe("capabilities are narrower than the panes that contain them", () => {
  /* R-27.1 CHANGED THIS ONE, and the earlier version is worth stating: ops read
     briefs and was refused writing them. That was round 25 naming the capability
     before a write path existed so the first one would arrive against an
     admin-only rule; the rule then survived round 26 unchanged and the result
     read badly out loud, so Sumeet widened it. What remains narrower than the
     pane is the editor, which reaches neither. */
  test("ops reads briefs AND writes them", () => {
    expect(canSee("ops", "briefs")).toBe(true);
    expect(canDo("ops", "briefsWrite")).toBe(true);
  });

  test("an editor reaches neither the briefs pane nor the write", () => {
    expect(canSee("editor", "briefs")).toBe(false);
    expect(canDo("editor", "briefsWrite")).toBe(false);
  });

  test("an editor is REFUSED managing accounts", () => {
    expect(canDo("editor", "usersManage")).toBe(false);
  });
});

/**
 * ROUND 26'S FUNNEL, transcribed by hand like everything else in this file.
 *
 * WHAT THE ROUND ADDED. `briefsWrite` had no write path until now — round 25
 * named the capability with the reason recorded: "so that when one arrives it
 * arrives against an existing admin-only entry rather than inheriting briefs'
 * read rule by accident." Round 26 built that path (moving a lead through the
 * pipeline, assigning an owner) and honoured the entry rather than widening it.
 *
 * AND THE CONSEQUENCE, ASSERTED RATHER THAN DISCOVERED: ops can read every lead
 * and export the current view, and cannot move one. That is a real operational
 * limit on the role whose whole job is following leads up, and it is written
 * here so that changing it is a deliberate act against a red test rather than a
 * quiet edit to CAPABILITY_ROLES.
 *
 * THE CSV EXPORT IS A READ. It sits at /api/admin/briefs/export, outside the
 * (cockpit) route group, so no layout guard runs on its request and the route
 * asserts the PANE itself. Reading a view and exporting the same view are the
 * same act with a different destination, so the set is the pane's set:
 * cockpit-v3 §11 says admin and ops, and owner reaches everything.
 */
test.describe("round 26 — the funnel's reach", () => {
  test("owner and admin may move a lead through the pipeline", () => {
    expect(canDo("owner", "briefsWrite")).toBe(true);
    expect(canDo("admin", "briefsWrite")).toBe(true);
  });

  test("ops reads, exports AND moves a lead — R-27.1", () => {
    /* The export route asserts the pane, so pane reach IS export reach. */
    expect(canSee("ops", "briefs")).toBe(true);
    expect(canDo("ops", "briefsWrite")).toBe(true);
  });

  /* The limit that did NOT move. Widening the pipeline write says nothing about
     content, transcripts or accounts, and the point of transcribing it here is
     that the next widening has to be its own deliberate act too. */
  test("ops still reaches no content, no conversations and no users", () => {
    expect(canSee("ops", "caseStudies")).toBe(false);
    expect(canSee("ops", "articles")).toBe(false);
    expect(canSee("ops", "conversations")).toBe(false);
    expect(canSee("ops", "users")).toBe(false);
    expect(canDo("ops", "usersManage")).toBe(false);
    expect(canDo("ops", "ownerAssign")).toBe(false);
  });

  test("an editor is REFUSED the pane, so also the export and the write", () => {
    expect(canSee("editor", "briefs")).toBe(false);
    expect(canDo("editor", "briefsWrite")).toBe(false);
  });

  test("exactly three roles reach briefs, which is the export's set", () => {
    expect(ROLES.filter((r) => canSee(r, "briefs"))).toEqual([
      "owner",
      "admin",
      "ops",
    ]);
  });

  /* Three since R-27.1, and the same three that reach the pane: reading a lead
     and moving it are now one set. The editor is still outside both. */
  test("exactly three roles may write them, and they are the pane's three", () => {
    expect(ROLES.filter((r) => canDo(r, "briefsWrite"))).toEqual([
      "owner",
      "admin",
      "ops",
    ]);
    expect(ROLES.filter((r) => canDo(r, "briefsWrite"))).toEqual(
      ROLES.filter((r) => canSee(r, "briefs")),
    );
  });
});
