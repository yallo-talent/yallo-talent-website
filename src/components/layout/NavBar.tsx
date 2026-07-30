"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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
    <>
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
    </>
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
              // biome-ignore lint/a11y/noStaticElementInteractions: hover opens mega-menu; keyboard uses button focus handler
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
                  aria-haspopup="true"
                  onFocus={() => setOpenGroup(group.label)}
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
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                    >
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
