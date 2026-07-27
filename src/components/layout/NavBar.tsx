"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./NavBar.module.css";
import {
  jobSeekersGroup,
  type NavItem,
  primaryCTAHref,
  primaryNav,
} from "./nav-config";
import { navIcons } from "./nav-icons";
import { ThemeToggle } from "./ThemeToggle";

function NavItemIcon({ icon }: { icon?: NavItem["icon"] }) {
  if (!icon) return null;
  const IconComp = navIcons[icon];
  return <IconComp className={styles.itemIconSvg} />;
}

const hueStyle = (hue?: NavItem["hue"]): React.CSSProperties | undefined => {
  if (!hue) return undefined;
  return {
    "--item-hue": `var(--hue-${hue}-500)`,
    "--item-hue-08": `var(--hue-${hue}-08)`,
    "--item-hue-35": `var(--hue-${hue}-35)`,
  } as React.CSSProperties;
};

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
            {[...primaryNav, jobSeekersGroup].map((group) => (
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
                      className={styles.megaPanel}
                      initial={{ opacity: 0, y: -8, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, x: "-50%" }}
                      exit={{ opacity: 0, y: -8, x: "-50%" }}
                      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                    >
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
                              {col.items.map((item) => {
                                const inner = (
                                  <>
                                    <span className={styles.itemIcon}>
                                      <NavItemIcon icon={item.icon} />
                                    </span>
                                    <span className={styles.itemBody}>
                                      <span className={styles.itemLabel}>
                                        {item.label}
                                        {item.external && (
                                          <span
                                            className={styles.externalMark}
                                            aria-hidden="true"
                                          >
                                            ↗
                                          </span>
                                        )}
                                      </span>
                                      {item.description && (
                                        <span
                                          className={styles.itemDescription}
                                        >
                                          {item.description}
                                        </span>
                                      )}
                                    </span>
                                  </>
                                );
                                return (
                                  <li key={item.href}>
                                    {item.external ? (
                                      <a
                                        href={item.href}
                                        className={styles.megaLink}
                                        style={hueStyle(item.hue)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {inner}
                                      </a>
                                    ) : (
                                      <Link
                                        href={item.href}
                                        className={styles.megaLink}
                                        style={hueStyle(item.hue)}
                                      >
                                        {inner}
                                      </Link>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                        {group.featured && (
                          <Link
                            href={group.featured.href}
                            className={styles.featured}
                          >
                            <div className={styles.featuredImage}>
                              <Image
                                src={group.featured.image}
                                alt={group.featured.imageAlt}
                                fill
                                sizes="280px"
                                className={styles.featuredImageImg}
                              />
                              <div
                                className={styles.featuredImageTint}
                                aria-hidden="true"
                              />
                            </div>
                            <div className={styles.featuredBody}>
                              <span className={styles.featuredEyebrow}>
                                {group.featured.eyebrow}
                              </span>
                              <span className={styles.featuredTitle}>
                                {group.featured.title}
                              </span>
                              <span className={styles.featuredCopy}>
                                {group.featured.copy}
                              </span>
                              <span className={styles.featuredCta}>
                                {group.featured.ctaLabel}
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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
              {[...primaryNav, jobSeekersGroup].map((group) => (
                <div key={group.label} className={styles.mobileGroup}>
                  <div className="eyebrow">{group.label}</div>
                  {group.columns.flatMap((col) =>
                    col.items.map((item) =>
                      item.external ? (
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
                      ),
                    ),
                  )}
                </div>
              ))}
              <div className={styles.mobileGroup}>
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
