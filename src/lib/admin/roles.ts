import { ADMIN_ROUTES } from "@/lib/admin/config";

/**
 * Who may reach which pane — one table, and the only place that answers it.
 *
 * WHY ONE TABLE. Round 23 §3 says a UI that hides a link is not access control,
 * and the corollary matters just as much: two places that decide access will
 * disagree, and the one that disagrees quietly is the nav. So the nav, the route
 * guards and every server action all read THIS, and none of them restates a role
 * list of their own. Adding a pane means adding a line here, and a pane with no
 * line here is unreachable rather than open — see `rolesFor`, which has no
 * permissive default.
 *
 * FOUR ROLES SINCE CANON A4, ratified 9 August 2026. `owner` is new and sits
 * above `admin`; `admin` now reaches conversations and briefs, which is a
 * WIDENING of who can read a visitor's conversation with the assistant.
 *
 * THE /privacy CONSTRAINT IS STILL LOAD-BEARING, and it did not disappear when
 * it widened, it changed shape. The published notice used to say one named
 * administrator could read assistant conversations; it now says a small, named
 * group of Yallo Talent administrators can. That is the sentence the
 * `conversations` line below has to keep true, so `owner` and `admin` are on it
 * and nothing else goes on it without the notice changing FIRST. The order is
 * not a formality: round 25 §3 required the wording live before this widening
 * shipped, because a notice that lags the code is a false statement to a
 * visitor about their own data. It shipped one commit earlier, in item 1.
 *
 * BRIEFS SPLIT READ FROM WRITE. Ops follows leads up, so ops reads briefs. There
 * is no brief-write path in the cockpit today; the capability is named anyway, so
 * that when one arrives it arrives against an existing admin-only entry rather
 * than inheriting the read rule by accident.
 */
export const ROLES = ["owner", "admin", "editor", "ops"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

/** What each role is, in the words the Users pane shows. */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner:
    "Everything, and cannot be disabled or demoted by anyone, including another owner.",
  admin: "Everything: all panes, conversations, briefs and accounts.",
  editor:
    "Articles, case studies and media. No briefs, conversations or accounts.",
  ops: "Briefs, read only.",
};

export const PANES = [
  "briefs",
  "conversations",
  "caseStudies",
  "articles",
  "media",
  "users",
] as const;

export type Pane = (typeof PANES)[number];

const PANE_ROLES: Record<Pane, readonly Role[]> = {
  /* Ops exists to follow leads up. */
  briefs: ["owner", "admin", "ops"],
  /* Two roles, and this line is the /privacy promise in code. */
  conversations: ["owner", "admin"],
  caseStudies: ["owner", "admin", "editor"],
  articles: ["owner", "admin", "editor"],
  /* Canon A4: "editor reaches articles, case studies and media only". Media
     sits with the two content panes because it is what those two are made of;
     an editor who can write an article and cannot upload the image in it has
     an article they cannot finish. */
  media: ["owner", "admin", "editor"],
  users: ["owner", "admin"],
};

/**
 * Capabilities that are narrower than the pane that contains them. A role that
 * can reach a pane cannot necessarily do everything in it.
 */
const CAPABILITY_ROLES = {
  /**
   * OPS WRITES BRIEFS — R-27.1, Sumeet's ruling.
   *
   * Round 25 named this capability before any write path existed, so that the
   * first one would arrive against an admin-only rule rather than inherit
   * briefs' read rule by accident. Round 26 built the path — moving a lead
   * through the pipeline, assigning an owner — and honoured that entry.
   *
   * The consequence was then asserted in `e2e/roles.spec.ts` and it read badly
   * out loud: ops could see every lead and could not move one, which is the
   * whole job of the role. That was the entry doing its job — it made widening
   * the rule a deliberate act against a red test rather than a quiet edit here.
   * This is that act.
   *
   * IT IS THE PIPELINE ONLY. `ops` still reaches no content, no conversations
   * and no users, and the capture row itself is never edited from any pane.
   * `check:funnel` asserts all four.
   */
  briefsWrite: ["owner", "admin", "ops"],
  usersManage: ["owner", "admin"],
  /* ONLY AN OWNER MAY MAKE AN OWNER, and this is a delegated decision rather
     than a line of canon, logged in relay v34 for Sumeet's veto. Canon A4 says
     an owner cannot be demoted or disabled by anyone. If an admin could also
     CREATE one, an admin could mint an account that nobody can ever take back,
     which turns "undemotable" from a protection into an escalation route.
     Reserving the assignment to an owner keeps the protection and closes the
     route. */
  ownerAssign: ["owner"],
} as const satisfies Record<string, readonly Role[]>;

export type Capability = keyof typeof CAPABILITY_ROLES;

/** No permissive default: an unlisted pane is closed, not open. */
export function rolesFor(pane: Pane): readonly Role[] {
  return PANE_ROLES[pane] ?? [];
}

export function canSee(role: Role | null | undefined, pane: Pane): boolean {
  return role != null && rolesFor(pane).includes(role);
}

export function canDo(
  role: Role | null | undefined,
  capability: Capability,
): boolean {
  return (
    role != null &&
    (CAPABILITY_ROLES[capability] as readonly Role[]).includes(role)
  );
}

/**
 * Whether `actor` may change `target`'s role or disabled flag.
 *
 * THE OWNER IS UNTOUCHABLE BY EVERYONE, INCLUDING AN OWNER. Canon A4 says
 * neither an admin nor an owner may demote or disable the owner, and the literal
 * reading is the safe one: an owner who demotes their own account is the lockout
 * the break-glass credential exists to survive, offered by the pane rather than
 * arrived at by accident. Round 23 already refused to let the last enabled admin
 * disable itself for the same reason; this is that rule with the exception
 * removed.
 *
 * SEPARATE FROM `canDo('usersManage')` ON PURPOSE. Managing accounts and
 * managing THIS account are different questions, and folding the second into the
 * first is how a target-blind capability check grants more than it means.
 */
export function canManageAccount(
  actor: Role | null | undefined,
  target: Role,
): boolean {
  if (!canDo(actor, "usersManage")) return false;
  return target !== "owner";
}

/** Whether `actor` may hand out the role `next`. */
export function canAssignRole(
  actor: Role | null | undefined,
  next: Role,
): boolean {
  if (!canDo(actor, "usersManage")) return false;
  return next === "owner" ? canDo(actor, "ownerAssign") : true;
}

/** Pane -> its route, so the nav and the guards agree on both halves. */
export const PANE_ROUTES: Record<Pane, string> = {
  briefs: ADMIN_ROUTES.briefs,
  conversations: ADMIN_ROUTES.conversations,
  caseStudies: ADMIN_ROUTES.caseStudies,
  articles: ADMIN_ROUTES.articles,
  media: ADMIN_ROUTES.media,
  users: ADMIN_ROUTES.users,
};

export const PANE_LABELS: Record<Pane, string> = {
  briefs: "Briefs",
  conversations: "Conversations",
  caseStudies: "Case studies",
  articles: "Articles",
  media: "Media",
  users: "Users",
};

/** The panes a role may reach, in nav order. */
export function panesFor(role: Role | null | undefined): Pane[] {
  return PANES.filter((pane) => canSee(role, pane));
}

/**
 * Where a role lands after signing in.
 *
 * `/admin` used to redirect unconditionally to briefs, which an editor may not
 * read: the first editor to sign in would have been bounced to a pane they are
 * forbidden, and a forbidden landing page reads as a broken account rather than
 * as a working one. The landing page is therefore the first pane the role can
 * actually see.
 */
export function landingFor(role: Role | null | undefined): string {
  const [first] = panesFor(role);
  return first ? PANE_ROUTES[first] : ADMIN_ROUTES.signIn;
}
