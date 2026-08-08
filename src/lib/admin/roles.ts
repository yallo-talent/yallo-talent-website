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
 * THE /privacy CONSTRAINT IS LOAD-BEARING. The published privacy notice says one
 * named administrator can read assistant conversations. That is a promise to
 * visitors, not an internal preference, so `conversations` is admin-only in every
 * phase and no role may be added to that line without the notice changing first.
 * `/privacy` copy is Sumeet's and is not edited by any session.
 *
 * BRIEFS SPLIT READ FROM WRITE. Ops follows leads up, so ops reads briefs. There
 * is no brief-write path in the cockpit today; the capability is named anyway, so
 * that when one arrives it arrives against an existing admin-only entry rather
 * than inheriting the read rule by accident.
 */
export const ROLES = ["admin", "editor", "ops"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

/** What each role is, in the words the Users pane shows. */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Everything: all panes, conversations, briefs and accounts.",
  editor: "Articles and case studies only, through the pull request path.",
  ops: "Briefs, read only.",
};

export const PANES = [
  "briefs",
  "conversations",
  "caseStudies",
  "articles",
  "users",
] as const;

export type Pane = (typeof PANES)[number];

const PANE_ROLES: Record<Pane, readonly Role[]> = {
  /* Admin and ops. Ops exists to follow leads up. */
  briefs: ["admin", "ops"],
  /* Admin only, and this line is the /privacy promise in code. */
  conversations: ["admin"],
  caseStudies: ["admin", "editor"],
  articles: ["admin", "editor"],
  users: ["admin"],
};

/**
 * Capabilities that are narrower than the pane that contains them. A role that
 * can reach a pane cannot necessarily do everything in it.
 */
const CAPABILITY_ROLES = {
  /* No such path exists yet. Named now so the first one is written against an
     admin-only rule instead of inheriting briefs' read rule. */
  briefsWrite: ["admin"],
  usersManage: ["admin"],
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

/** Pane -> its route, so the nav and the guards agree on both halves. */
export const PANE_ROUTES: Record<Pane, string> = {
  briefs: ADMIN_ROUTES.briefs,
  conversations: ADMIN_ROUTES.conversations,
  caseStudies: ADMIN_ROUTES.caseStudies,
  articles: ADMIN_ROUTES.articles,
  users: ADMIN_ROUTES.users,
};

export const PANE_LABELS: Record<Pane, string> = {
  briefs: "Briefs",
  conversations: "Conversations",
  caseStudies: "Case studies",
  articles: "Articles",
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
