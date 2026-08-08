import policy from "@/lib/robots-policy.json";

/**
 * The cockpit's route base, from the same file robots.ts reads its disallow list
 * from and scripts/check-admin-isolation.mjs reads its assertions from.
 *
 * One value, three consumers. A route base written down three times is how an
 * admin surface comes to be excluded from two of the three places that must
 * exclude it.
 */
export const ADMIN_BASE = policy.adminBase;

export const ADMIN_ROUTES = {
  root: ADMIN_BASE,
  signIn: `${ADMIN_BASE}/sign-in`,
  briefs: `${ADMIN_BASE}/briefs`,
  conversations: `${ADMIN_BASE}/conversations`,
  caseStudies: `${ADMIN_BASE}/case-studies`,
  articles: `${ADMIN_BASE}/articles`,
  users: `${ADMIN_BASE}/users`,
} as const;

/**
 * Everything the cockpit reads is read-only except case studies, and nothing it
 * does deletes. Stated here rather than left implicit in which handlers exist,
 * because round 17 §3 forbids a delete path outright: the transcript purge owns
 * deletion and a second path would race it.
 */
export const ADMIN_CAPABILITIES = {
  briefs: ["read"],
  conversations: ["read"],
  caseStudies: ["read", "create", "reorder", "edit", "unpublish"],
  /* Round 20 §3.2. The pane exists and states where articles live; it does
     nothing, and the empty list is the enforcement of that rather than a note
     saying so. Unpublishing a case study is `published: false` through the same
     pull request path — never a file deletion, and never a delete from here. */
  articles: [],
} as const;
