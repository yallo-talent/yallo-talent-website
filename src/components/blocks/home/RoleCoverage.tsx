"use client";

import { useState } from "react";
import { roleFamilies, rolesCopy } from "@/data/home/roles";
import styles from "./Home.module.css";
import { RoleGlyph } from "./icons";
import { SectionHead } from "./SectionHead";

/**
 * Eight role families as an accessible grid rather than the pitch deck's radial.
 *
 * Toggle buttons rather than tabs: the output panel is a disclosure of the
 * pressed family, and aria-pressed describes that more honestly than a tablist
 * would. Hover previews, click commits, and the grid is fully keyboard
 * operable through native button focus order.
 */
export function RoleCoverage() {
  const [active, setActive] = useState(0);
  const family = roleFamilies[active];
  if (!family) return null;

  return (
    <section className={`${styles.section} ${styles.g3}`} id="roles">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={rolesCopy.eyebrow}
          heading={rolesCopy.heading}
          lede={rolesCopy.lede}
          id="roles-heading"
        />

        <div className={styles.roleGrid}>
          {roleFamilies.map((r, i) => (
            <button
              key={r.name}
              type="button"
              className={styles.roleCard}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <RoleGlyph name={r.icon} />
              <span className={styles.roleName}>{r.name}</span>
              <span className={styles.roleNote}>{r.note}</span>
            </button>
          ))}
        </div>

        <div className={styles.roleOut} aria-live="polite">
          <span className={styles.panelPetal} aria-hidden="true" />
          <h3>{family.name}</h3>
          <p className={styles.roleOutNote}>{family.note}</p>
          <ul className={styles.roleChips}>
            {family.roles.map((role) => (
              <li key={role} className="role-pill">
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
