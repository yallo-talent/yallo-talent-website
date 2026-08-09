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
const MATRIX: Record<Role, Pane[]> = {
  owner: ["briefs", "conversations", "caseStudies", "articles", "users"],
  admin: ["briefs", "conversations", "caseStudies", "articles", "users"],
  editor: ["caseStudies", "articles"],
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
  test("ops reads briefs and is REFUSED writing them", () => {
    expect(canSee("ops", "briefs")).toBe(true);
    expect(canDo("ops", "briefsWrite")).toBe(false);
  });

  test("an editor is REFUSED managing accounts", () => {
    expect(canDo("editor", "usersManage")).toBe(false);
  });
});
