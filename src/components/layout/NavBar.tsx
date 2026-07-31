"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { Lockup } from "./Lockup";
import styles from "./NavBar.module.css";
import {
  jobSeekersHref,
  type NavFeatured,
  type NavItem,
  primaryCTAHref,
  primaryNav,
} from "./nav-config";

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

function MegaItem({ item }: { item: NavItem }) {
  if (item.published === false) {
    return (
      <span className={styles.megaLink} aria-disabled="true">
        <NavItemBody item={item} />
        {/* B7: says what it is, at full strength, instead of being dimmed. */}
        <span className={styles.megaPlannedMark}>Desk in build</span>
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
      >
        <NavItemBody item={item} />
      </a>
    );
  }
  return (
    <Link href={item.href} className={styles.megaLink}>
      <NavItemBody item={item} />
    </Link>
  );
}

export function NavBar() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      // Focus would otherwise be stranded inside a panel that no longer exists.
      const trigger = document.querySelector<HTMLElement>(
        `[aria-haspopup="true"][data-group="${openGroup}"]`,
      );
      trigger?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openGroup]);

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
  }, [mobileOpen]);

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
            onMouseLeave={() => setOpenGroup(null)}
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
                onMouseEnter={() => setOpenGroup(group.label)}
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
                <AnimatePresence>
                  {openGroup === group.label && (
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
                      id={`megapanel-${group.label.replace(/\s+/g, "-").toLowerCase()}`}
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
                        seed={group.label}
                        className={styles.megaAtmosphere}
                      />
                      <div className={styles.megaPanelInner}>
                        {group.description && (
                          <div className={styles.megaDescription}>
                            {group.description}
                          </div>
                        )}
                        <div
                          className={styles.megaGrid}
                          data-cols={
                            group.columns.length + (group.featured ? 1 : 0)
                          }
                        >
                          {group.columns.map((col) => (
                            <div key={col.heading} className={styles.megaCol}>
                              <div className={styles.megaColHeading}>
                                {col.heading}
                              </div>
                              <ul className={styles.megaList}>
                                {col.items.map((item) => (
                                  <li key={item.href}>
                                    <MegaItem item={item} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {group.featured && (
                            <FeaturedCard featured={group.featured} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link href={jobSeekersHref} className={styles.jobsLink}>
              Jobs
            </Link>
          </nav>

          <div className={styles.actions}>
            {/* Theme toggle hidden until light theme is production-ready. */}
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
              onClick={() => setMobileOpen((v) => !v)}
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
