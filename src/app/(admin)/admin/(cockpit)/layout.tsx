import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "@/components/admin/Admin.module.css";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { auth, signOut } from "@/lib/admin/auth";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { PANE_LABELS, PANE_ROUTES, panesFor } from "@/lib/admin/roles";

/**
 * The cockpit shell, and the one place the session is enforced.
 *
 * WHY THE GUARD IS HERE AND NOT ONLY IN MIDDLEWARE. Middleware runs before the
 * cache and is the right place for a header, but a layout guard is what makes an
 * unauthenticated read IMPOSSIBLE rather than merely intercepted: every pane is a
 * server component nested under this layout, so nothing below it renders — and
 * therefore nothing below it queries the database — until `auth()` has resolved
 * to a session. A route added tomorrow inherits the guard by being in the
 * directory, which is the opposite of the "new template, forgotten list" failure
 * this repository keeps paying for.
 *
 * `force-dynamic` because every pane reads live rows and the session. A
 * prerendered admin page is a cached admin page.
 *
 * WHY A ROUTE GROUP. `/admin/sign-in` cannot live under this layout: a sign-in
 * page inside its own auth guard redirects to itself forever. The `(cockpit)`
 * group is transparent in the URL, so `/admin`, `/admin/briefs`,
 * `/admin/conversations` and `/admin/case-studies` are guarded by their position
 * in the tree while `/admin/sign-in` sits outside it as a sibling. The
 * alternative — dropping the guard here and checking the session in each pane —
 * is the enumerated list that this repository's history says will one day be
 * missing an entry.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Yallo Talent",
  /* Belt and braces with robots.ts's `/admin/` disallow and middleware's
     X-Robots-Tag. robots.txt is a request, a meta tag is a request, and the
     header is the one that applies to every response including those a page's
     own metadata never touches. All three, because the cost of this surface
     being indexed once is unbounded. */
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect(ADMIN_ROUTES.signIn);
  const role = session.user.role;

  /* The nav is the LAST layer, never the only one. Every pane below re-checks
     with requirePane, and every server action re-checks with assertPane, because
     a link that is not rendered is still a URL that can be typed. Filtering here
     is so that the cockpit shows a person their own job, not so that it stops
     anyone doing someone else's. */
  const panes = panesFor(role);

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <p className={styles.wordmark}>
          <Link href={ADMIN_ROUTES.root}>Yallo admin</Link>
        </p>
        <nav aria-label="Cockpit panes" className={styles.nav}>
          {panes.map((pane) => (
            <Link href={PANE_ROUTES[pane]} key={pane}>
              {PANE_LABELS[pane]}
            </Link>
          ))}
        </nav>
        <p className={styles.whoami}>
          {session.user.email}
          <span className={styles.roleTag}>{role ?? "no role"}</span>
        </p>
        {/* R-27.2's cockpit-native theme control. The same component the public
            nav mounts, because it is a view of one `data-theme` attribute rather
            than a piece of site chrome — the cockpit needs the switch and does
            not need the nav that used to carry it. */}
        <ThemeToggle />
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: ADMIN_ROUTES.signIn });
          }}
        >
          <button type="submit" className={styles.signOut}>
            Sign out
          </button>
        </form>
      </header>
      {/* A `div`, not a `main`. The admin root layout owns the one `main`
          landmark for every surface under `/admin`, including sign-in and the
          preview route, which sit outside this group. */}
      <div className={styles.main}>{children}</div>
    </div>
  );
}
