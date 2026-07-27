"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import styles from "./NavBar.module.css";
import { jobSeekersHref, primaryCTAHref, primaryNav } from "./nav-config";
import { ThemeToggle } from "./ThemeToggle";

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
            <span className={styles.brandMark}>Yallo</span>
            <span className={styles.brandSuffix}>Talent</span>
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
              // biome-ignore lint/a11y/noStaticElementInteractions: hover opens mega-menu; keyboard users use the child button's focus handler
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
                </button>
                <AnimatePresence>
                  {openGroup === group.label && (
                    <motion.div
                      className={styles.megaPanel}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                    >
                      <div className={styles.megaGrid}>
                        {group.columns.map((col) => (
                          <div key={col.heading} className={styles.megaCol}>
                            <div className="eyebrow">{col.heading}</div>
                            <ul className={styles.megaList}>
                              {col.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className={styles.megaLink}
                                  >
                                    <span className={styles.megaLinkLabel}>
                                      {item.label}
                                    </span>
                                    {item.description && (
                                      <span
                                        className={styles.megaLinkDescription}
                                      >
                                        {item.description}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link href={jobSeekersHref} className={styles.groupTrigger}>
              Job seekers
            </Link>
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />
            <Link href={primaryCTAHref} className={styles.ctaPrimary}>
              Request a contractor
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
                    col.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.mobileLink}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )),
                  )}
                </div>
              ))}
              <div className={styles.mobileGroup}>
                <Link
                  href={jobSeekersHref}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  Job seekers
                </Link>
                <Link
                  href={primaryCTAHref}
                  className={styles.mobileCTA}
                  onClick={() => setMobileOpen(false)}
                >
                  Request a contractor →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
