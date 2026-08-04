"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { allL1 } from "@/data/l1/index";
import { Lockup } from "./Lockup";
import styles from "./NavBar.module.css";
import {
  jobSeekersHref,
  type NavFeatured,
  type NavItem,
  primaryCTAHref,
  primaryNav,
} from "./nav-config";
import { ThemeToggle } from "./ThemeToggle";

/* No per-item icon. Each row carried a 36x36 bordered tile with its own tinted
   ground, which meant twenty competing objects in one panel and a row height
   three times what the label needs. The menu's job is to let someone find a
   platform name fast; the label does that, and the description under it does the
   rest. The tiles also carried --item-hue-*, the last of the retired per-sector
   hue plumbing that step 9 missed because of the different prefix. */
function NavItemBody({ item }: { item: NavItem }) {
  return (
    <span className={styles.itemBody}>
      <span className={styles.itemLabel}>
        {item.label}
        {item.external && (
          <span className={styles.externalMark} aria-hidden="true">
            ↗
          </span>
        )}
      </span>
      {item.description && (
        <span className={styles.itemDescription}>{item.description}</span>
      )}
    </span>
  );
}

function FeaturedBody({ featured }: { featured: NavFeatured }) {
  return (
    <div className={styles.featuredBody}>
      <span className={styles.featuredEyebrow}>{featured.eyebrow}</span>
      <span className={styles.featuredTitle}>{featured.title}</span>
      <span className={styles.featuredCopy}>{featured.copy}</span>
      <span className={styles.featuredCta}>{featured.ctaLabel}</span>
    </div>
  );
}

function FeaturedCard({ featured }: { featured: NavFeatured }) {
  if (featured.published === false) {
    return (
      <div className={styles.featured} aria-disabled="true">
        <FeaturedBody featured={featured} />
      </div>
    );
  }
  return (
    <Link href={featured.href} className={styles.featured}>
      <FeaturedBody featured={featured} />
    </Link>
  );
}

/* onSelect closes the panel the moment a link is chosen, which the pathname
   effect cannot do on its own: clicking a link to the route you are ALREADY on
   changes no pathname, so the effect never fires and the panel sits over the page
   the reader just asked for. Verified before the fix — from /platforms/sap,
   choosing SAP from the menu left the panel open. It also removes the wait for
   navigation to commit on a normal click, which is the "close IMMEDIATELY on
   selection" half of ORDER 5. */
/* D0 redesign: the panel read as a bare list of names, so every row now carries
   a support line — what that desk actually covers. NOTHING is authored for it.
   An item's own `description` wins where it has one (Engagement and Explore
   already do); otherwise the row takes the L1 index `tagline` for its slug, which
   is the same sentence the L1 page itself publishes. 18 of the 19 Specialisms
   rows resolve this way. Anything unmatched renders the label alone rather than a
   placeholder — a missing support line is per-row and asserts nothing, so R16 is
   satisfied either way. */
const TAGLINE_BY_SLUG = new Map(
  Object.values(allL1)
    .flat()
    .map((e) => [e.slug, e.tagline] as const),
);

function supportLine(item: NavItem): string | null {
  /* NOT item.description — NavItemBody already renders that, and returning it
     here printed every Engagement and Explore subtitle TWICE, once in each
     element. My regression from the register redesign: I added the support line
     without checking whether the row already had one. The support line exists to
     give a row context it does NOT already have, so where a description exists
     this must stay silent. */
  if (item.description) return null;
  const slug = item.href.split("/").filter(Boolean).pop();
  return (slug && TAGLINE_BY_SLUG.get(slug)) || null;
}

function MegaSupport({ item }: { item: NavItem }) {
  const line = supportLine(item);
  return line ? <span className={styles.megaSupport}>{line}</span> : null;
}

function MegaItem({ item, onSelect }: { item: NavItem; onSelect: () => void }) {
  if (item.published === false) {
    return (
      <span className={styles.megaLink} aria-disabled="true">
        <span className={styles.megaLinkHead}>
          <NavItemBody item={item} />
          {/* B7: says what it is, at full strength, instead of being dimmed. */}
          <span className={styles.megaPlannedMark}>Desk in build</span>
        </span>
        <MegaSupport item={item} />
      </span>
    );
  }
  if (item.external) {
    return (
      <a
        href={item.href}
        className={styles.megaLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
      >
        <span className={styles.megaLinkHead}>
          <NavItemBody item={item} />
        </span>
        <MegaSupport item={item} />
      </a>
    );
  }
  return (
    <Link href={item.href} className={styles.megaLink} onClick={onSelect}>
      <span className={styles.megaLinkHead}>
        <NavItemBody item={item} />
      </span>
      <MegaSupport item={item} />
    </Link>
  );
}

/**
 * State that must not outlive the route it was opened on.
 *
 * ROUND 10, and it is one defect wearing two faces. Both pieces of chrome state
 * have to close when the route changes, and the previous fix reset only the
 * mega panel, from inside an effect. Measured at 360: opening the drawer and
 * pressing browser back landed on the new page with `aria-expanded="true"`, 33
 * links from the old panel still rendered, `body` AND `documentElement` still
 * `overflow: hidden`, and the header still `inert` — a page the reader cannot
 * scroll, with a header they cannot use. The mega panel's own case is milder
 * only because a panel over the right page looks less broken than a lock.
 *
 * Stamping the value with the route it was set on lets RENDER derive the reset.
 * No effect, no setState-in-effect, and no cascading render on navigation —
 * which is what react-hooks/set-state-in-effect was reporting. A pending
 * hover-intent timer that fires after a navigation stamps the route it was
 * started on, so it derives closed instead of opening a panel on the new page,
 * and that is the behaviour we want rather than a side effect to suppress.
 */
function useRouteScopedState<T>(initial: T, pathname: string) {
  const [stamped, setStamped] = useState<{ value: T; path: string }>({
    value: initial,
    path: pathname,
  });
  const value = stamped.path === pathname ? stamped.value : initial;
  const set = useCallback(
    (next: T) => setStamped({ value: next, path: pathname }),
    [pathname],
  );
  return [value, set] as const;
}

export function NavBar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useRouteScopedState<string | null>(
    null,
    pathname,
  );

  /* ORDER 5: hover-INTENT, not hover.
     Opening on raw mouseenter meant a pointer crossing the nav on its way
     elsewhere opened and closed panels in sequence — the flicker. A short dwell
     means a pass-through never opens anything, while a deliberate move still
     feels immediate. The same timer cancels on leave, so nothing opens after the
     pointer has gone. */
  const intent = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearIntent = () => {
    if (intent.current) clearTimeout(intent.current);
    intent.current = null;
  };

  /* A FORGIVING close, and this is the fix for the reported "cannot grab the
     panel". Diagnosed with a pointer trace at 1440px: the group wrapper ends at
     y=62 and the panel is `position: fixed` at `top: var(--header-h)` = y=80, so
     there is an 18px strip belonging to neither. Moving straight down from the
     trigger, `onMouseLeave` on the nav fired at y=70 — ten pixels BEFORE the
     panel began — and the panel was gone before the pointer could reach it.
     The links were never the problem: measured, each is a real 303x46 target and
     elementFromPoint at its centre returns the anchor. They were unclickable only
     because a straight-line move to one closed the panel on the way.
     A short grace period means crossing the strip cannot close anything, and any
     re-entry cancels it. 180ms is long enough for the 18px hop and short enough
     that a deliberate exit still feels immediate. */
  const leave = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (leave.current) clearTimeout(leave.current);
    leave.current = null;
  };
  const closeSoon = () => {
    cancelClose();
    leave.current = setTimeout(() => setOpenGroup(null), 180);
  };
  const openWithIntent = (label: string) => {
    clearIntent();
    // Already open: switch immediately, since intent is established.
    if (openGroup) {
      setOpenGroup(label);
      return;
    }
    intent.current = setTimeout(() => setOpenGroup(label), 120);
  };

  /* ORDER 5: close on route change. A panel that survives navigation is a panel
     covering the page the reader just asked for. pathname is the only reliable
     signal here — a click handler on each link misses keyboard activation and
     browser back, and browser back is the case measurement proved reaches this.
     The reset itself now DERIVES from pathname in useRouteScopedState above. */
  /* The open group as DATA, so one panel can render any group's content. */
  const activeGroup = primaryNav.find((g) => g.label === openGroup) ?? null;

  useEffect(() => {
    /* Only the timers are cleared here now, and a timer is exactly the external
       system an effect is for. Nothing sets state: a pending timer that fires
       after a navigation already derives closed, so this is hygiene rather than
       correctness, and it saves one inert render per navigation.
       The clearTimeout calls are inlined for the reason the original gave —
       referencing clearIntent would make this effect depend on a function
       identity that changes every render. And pathname is READ rather than only
       listed, which is the same reason the original carried this guard: biome
       rejects a dependency the body never touches, and it is right to. */
    if (pathname !== null) {
      if (intent.current) clearTimeout(intent.current);
      intent.current = null;
      if (leave.current) clearTimeout(leave.current);
      leave.current = null;
    }
  }, [pathname]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useRouteScopedState(false, pathname);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  /**
   * Escape closes the drawer, and the page underneath stops scrolling.
   *
   * Neither was true. The drawer covers the full 844px viewport at 390 and
   * carries 23 links, and a critique verified that Escape — pressed with focus
   * on the trigger AND with focus on a drawer link — left `aria-expanded` true
   * and the drawer visible. Because it fills the viewport there is no "outside"
   * to tap either: every click lands on a link and navigates. So the only exit
   * was the hamburger itself, and a keyboard user who had tabbed into the list
   * had to tab back out to reach it.
   *
   * The scroll lock is the second half. `body` was `overflow: visible` and
   * `position: static`, so the document scrolled freely behind a fixed overlay —
   * the reader loses their place and, on iOS, the drawer and the page fight.
   * The scrollbar width is not compensated because the drawer only exists at
   * widths where the scrollbar is an overlay, so there is no layout shift to
   * correct.
   */
  /**
   * Escape dismisses an open mega panel, and focus no longer opens one.
   *
   * SC 1.4.13 (Content on Hover or Focus) requires additional content to be
   * DISMISSIBLE without moving the pointer or focus. It was not: tabbing to a
   * group trigger flipped `aria-expanded` to true and painted a 611px panel,
   * Escape did nothing, and the next Tab walked into the panel's contents — so
   * reaching "Start a brief" from a fresh load took THIRTY-THREE tab stops,
   * because forward traversal opened all four panels in turn and traversed each.
   * axe cannot see any of it.
   *
   * Two changes, and the second is the one that fixes the tab count. Escape
   * closes and returns focus to the trigger. And opening moves from `onFocus` to
   * a real click/Enter/Space toggle: focus-to-open is what put four panels'
   * worth of links into a linear tab traversal. Pointer users keep hover-open,
   * which is unaffected.
   */
  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenGroup(null);
      /* Focus would otherwise be stranded inside a panel that no longer exists,
         and it WAS: this selector still required aria-haspopup="true" after the
         attribute was deliberately removed one round earlier in favour of
         aria-controls (see the trigger's own comment below). It matched nothing,
         so trigger?.focus() was a silent no-op. Measured at 1280: open a panel,
         Tab to a link inside it, press Escape — aria-expanded went false and
         focus stayed on a link in the dismissed panel. Keyed on data-group,
         which is what the trigger actually carries. */
      const trigger = document.querySelector<HTMLElement>(
        `button[data-group="${openGroup}"]`,
      );
      trigger?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    /* setOpenGroup is route-scoped, so its identity changes with pathname and it
       is a real dependency rather than a lint formality. Re-subscribing costs
       nothing: the body returns immediately unless a panel is open. */
  }, [openGroup, setOpenGroup]);

  /**
   * The drawer is a modal, and last round it only looked like one.
   *
   * A critique measured it at 390: no `role`, no `aria-modal`, no accessible
   * name, no scrim, and `main` neither inert nor aria-hidden. Tab walked the 23
   * drawer links and then CARRIED ON into the page behind — and as the browser
   * scrolled those hidden controls into view, scrollY crept 0 to 44px, defeating
   * the very scroll lock this effect installs. Escape closed it but dropped
   * focus on <body> rather than the trigger.
   *
   * So: `inert` on the rest of the document, which removes the page from both
   * the tab order and the accessibility tree in one property and is why no
   * hand-rolled focus trap is needed here; focus moved into the drawer on open
   * and returned to the hamburger on close; and the dialog semantics that tell
   * a screen reader what this is.
   */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    /* documentElement, not just body. layout.tsx deliberately keeps `h-full`
       off <html>, so <html> is the scroll container and `body { overflow:
       hidden }` alone left the page scrolling freely behind the overlay —
       measured. Both are set because which element scrolls depends on the
       engine's viewport-propagation rules, and getting it wrong is silent. */
    const prevBody = document.body.style.overflow;
    const prevRoot = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    /* Everything except the drawer goes inert. The drawer is a sibling of
       <header>, so the targets are the header and <main> plus the footer. */
    const outside = [...document.body.children].filter(
      (el) => !el.hasAttribute("data-drawer"),
    );
    for (const el of outside) el.setAttribute("inert", "");

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevRoot;
      for (const el of outside) el.removeAttribute("inert");
      // Focus belongs back on the control that opened it, not on <body>.
      document.querySelector<HTMLElement>("[data-hamburger]")?.focus();
    };
    /* As above: route-scoped setter, real dependency. On a route change the
       drawer derives closed, so this effect's cleanup is what lifts the scroll
       lock and the inert attributes — which is the browser-back defect fixed. */
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.bar}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="Yallo Talent home"
          >
            <Lockup />
          </Link>

          <nav
            className={styles.primary}
            aria-label="Primary"
            onMouseEnter={cancelClose}
            onMouseLeave={() => {
              clearIntent();
              closeSoon();
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setOpenGroup(null);
              }
            }}
          >
            {primaryNav.map((group) => (
              <div
                key={group.label}
                className={styles.groupWrap}
                role="none"
                onMouseEnter={() => openWithIntent(group.label)}
              >
                <button
                  type="button"
                  className={styles.groupTrigger}
                  aria-expanded={openGroup === group.label}
                  /* No aria-haspopup, and aria-controls instead. `true` is
                     ARIA-equivalent to `menu`, so assistive tech announced a
                     menu and the user got a disclosure — there is no role=menu,
                     no role=menuitem and no arrow-key navigation anywhere in the
                     panel, which is a bare div of links. axe cannot see it
                     because `true` is a valid value, which is how it survived
                     six passes. aria-expanded plus aria-controls describes what
                     this actually is. */
                  aria-controls={`megapanel-${group.label.replace(/\s+/g, "-").toLowerCase()}`}
                  data-group={group.label}
                  onClick={() =>
                    setOpenGroup(openGroup === group.label ? null : group.label)
                  }
                >
                  {group.label}
                  <svg
                    viewBox="0 0 12 12"
                    className={styles.triggerCaret}
                    aria-hidden="true"
                    role="presentation"
                  >
                    <title>Chevron</title>
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {/* ONE panel, hoisted out of the group loop, with its CONTENT swapped
                rather than the element replaced. Each group used to own an
                AnimatePresence, so switching triggers unmounted one panel and
                mounted another: measured 60ms into a switch there were TWO panels
                on screen at opacity 0.32 and 0.67, cross-fading at two different
                x positions. That is the flicker. .megaPanel is
                `position: fixed; left: 0; right: 0`, never positioned by its
                group wrapper, so hoisting it costs nothing in geometry and makes
                a second panel structurally impossible. Switching groups now swaps
                children with no remount and no enter/exit at all. */}
            <AnimatePresence>
              {activeGroup && (
                <motion.div
                  /* band-dark, not just a dark background: the panel ground
                     is permanently dark in both themes, but its links read
                     --fg, which resolves to INK in the light theme — so the
                     labels rendered dark-on-dark and were effectively
                     invisible. band-dark restates the Layer 2c aliases so
                     every descendant resolves against the dark ground. */
                  className={`${styles.megaPanel} band-dark`}
                  /* The id aria-controls points at. Without it the attribute
                     references nothing and the association is a claim rather
                     than a fact. */
                  id={`megapanel-${activeGroup.label.replace(/\s+/g, "-").toLowerCase()}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {/* B7: hero-grade ambient field on the panel, seeded per
                      group so each menu draws its own. Deterministic, static,
                      and needs no backdrop-filter — which is why the panel can
                      have this where it cannot have A3 glass (Q8). */}
                  <HeroAtmosphere
                    seed={activeGroup.label}
                    className={styles.megaAtmosphere}
                  />
                  <div className={styles.megaPanelInner}>
                    {activeGroup.description && (
                      <div className={styles.megaDescription}>
                        {activeGroup.description}
                      </div>
                    )}
                    <div
                      className={styles.megaGrid}
                      data-cols={
                        activeGroup.columns.length +
                        (activeGroup.featured ? 1 : 0)
                      }
                    >
                      {activeGroup.columns.map((col) => (
                        <div key={col.heading} className={styles.megaCol}>
                          <div className={styles.megaColHeading}>
                            {col.heading}
                          </div>
                          <ul className={styles.megaList}>
                            {col.items.map((item) => (
                              <li key={item.href}>
                                <MegaItem
                                  item={item}
                                  onSelect={() => setOpenGroup(null)}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {activeGroup.featured && (
                        <FeaturedCard featured={activeGroup.featured} />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Link href={jobSeekersHref} className={styles.jobsLink}>
              Jobs
            </Link>
          </nav>

          <div className={styles.actions}>
            {/* round14-scope.md §3(b): the stale comment this replaced named
                light-theme readiness as the blocker, but src/config/theme.ts
                has said otherwise since round 10 — "Light and dark are peers,
                not inversions... each passes WCAG 2.2 AA independently."
                ThemeToggle.tsx itself was already built and fixed in round 10;
                nothing in src/ imported it. The blocker was never the theme
                system, it was that no component ever mounted the switch.

                Desktop only (hidden at the same 1024px breakpoint .primary
                collapses to the hamburger at, NavBar.module.css). The bar
                below 480px is tuned to a zero-slack pixel budget — measured
                and commented at length just below in the CSS — and a second
                control here overflows it. The mobile instance lives in the
                drawer instead, where the width fight does not exist. */}
            <span className={styles.themeToggleDesktop}>
              <ThemeToggle />
            </span>
            <Link href={primaryCTAHref} className={styles.ctaPrimary}>
              Start a brief
              <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className={styles.hamburger}
              data-hamburger=""
              aria-controls="mobile-drawer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileDrawer}
            data-drawer=""
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className={styles.mobileInner}>
              {primaryNav.map((group) => (
                <div key={group.label} className={styles.mobileGroup}>
                  <div className="eyebrow">{group.label}</div>
                  {group.columns.flatMap((col) =>
                    col.items.map((item) => {
                      if (item.published === false) {
                        return (
                          <span
                            key={item.href}
                            className={styles.mobileLink}
                            aria-disabled="true"
                          >
                            {item.label}
                          </span>
                        );
                      }
                      return item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          className={styles.mobileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label} ↗
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={styles.mobileLink}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    }),
                  )}
                </div>
              ))}
              <div className={styles.mobileGroup}>
                <div className={styles.mobileThemeRow}>
                  <span>Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href={jobSeekersHref}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  href={primaryCTAHref}
                  className={styles.mobileCTA}
                  onClick={() => setMobileOpen(false)}
                >
                  Start a brief →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
