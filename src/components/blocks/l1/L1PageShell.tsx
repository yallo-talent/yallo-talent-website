"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { L1Hue, L1PageData } from "@/data/l1/types";
import styles from "./L1PageShell.module.css";

const hueStyle = (hue: L1Hue): React.CSSProperties =>
  ({
    "--sector-accent": `var(--hue-${hue}-500)`,
    "--sector-accent-08": `var(--hue-${hue}-08)`,
    "--sector-accent-20": `var(--hue-${hue}-20)`,
    "--sector-accent-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

interface Props {
  data: L1PageData;
}

export function L1PageShell({ data }: Props) {
  return (
    <div className={styles.page} style={hueStyle(data.hue)}>
      <L1Hero data={data} />
      <L1StatsStrip data={data} />
      <L1Intro data={data} />
      {data.scarceRoles && data.scarceRoles.length > 0 && (
        <L1ScarceTalent data={data} />
      )}
      <L1Expertise data={data} />
      <L1Segments data={data} />
      <L1BottomCta />
      <L1ReadNext data={data} />
    </div>
  );
}

/* ============ HERO ============ */
function L1Hero({ data }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImageWrap}>
        <Image
          src={data.heroImage}
          alt={data.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.heroTint} aria-hidden="true" />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroInner}>
        <nav className={styles.crumb} aria-label="Breadcrumb">
          {data.breadcrumb.map((c, i) => {
            const isLast = i === data.breadcrumb.length - 1;
            return (
              <span key={c.label} className={styles.crumbItem}>
                {isLast || !c.href ? (
                  <span className={styles.crumbCurrent}>{c.label}</span>
                ) : (
                  <>
                    <Link href={c.href} className={styles.crumbLink}>
                      {c.label}
                    </Link>
                    <span className={styles.crumbSep} aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </span>
            );
          })}
        </nav>

        <div className={styles.heroEyebrow}>
          <span className={styles.heroEyebrowDot} aria-hidden="true" />
          {data.eyebrow}
        </div>

        <h1 className={styles.heroTitle}>
          {data.title}
          <br />
          <span className={styles.heroEmphasis}>{data.emphasis}</span>
        </h1>

        <p className={styles.heroSub}>{data.sub}</p>

        <div className={styles.heroCtas}>
          <Link href={data.primaryCta.href} className={styles.ctaPrimary}>
            {data.primaryCta.label}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href={data.secondaryCta.href} className={styles.ctaGhost}>
            {data.secondaryCta.label}
          </Link>
        </div>

        <div className={styles.heroDots}>
          {data.statusDots.map((d) => (
            <div key={d} className={styles.heroDot}>
              <span className={styles.heroDotMark} aria-hidden="true" />
              {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ STATS STRIP ============ */
function L1StatsStrip({ data }: Props) {
  return (
    <section className={styles.statsStrip}>
      <div className={styles.statsInner}>
        {data.stats.map((s) => (
          <div key={s.l} className={styles.statCell}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ INTRO ============ */
function L1Intro({ data }: Props) {
  return (
    <section className={styles.intro}>
      <div className={styles.introOrb} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.introGrid}>
          <div className={styles.introLeft}>
            <div className={styles.eyebrow}>{data.introEyebrow}</div>
            <h2 className={styles.h2}>{data.introTitle}</h2>
            {data.introCopy.map((p) => (
              <p key={p.slice(0, 30)} className={styles.introPara}>
                {p}
              </p>
            ))}
          </div>
          <div className={styles.introRight}>
            {data.introStatCards.map((c) => (
              <div key={c.l} className={styles.introStatCard}>
                <div className={styles.introStatN}>{c.n}</div>
                <div className={styles.introStatL}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SCARCE TALENT ============ */
function L1ScarceTalent({ data }: Props) {
  if (!data.scarceRoles || !data.scarceEyebrow) return null;
  return (
    <section className={styles.scarce}>
      <div className={styles.wrap}>
        <div className={styles.scarceCard}>
          <div className={styles.scarceGlow} aria-hidden="true" />
          <div className={styles.scarceGrid}>
            <div className={styles.scarceLeft}>
              <div className={styles.eyebrow}>{data.scarceEyebrow}</div>
              <h3 className={styles.scarceH}>{data.scarceTitle}</h3>
              <p className={styles.scarceCopy}>{data.scarceCopy}</p>
            </div>
            <div className={styles.scarceList}>
              {data.scarceRoles.map((r) => (
                <div key={r.name} className={styles.scarceRow}>
                  <span className={styles.scarceRowName}>{r.name}</span>
                  <span className={styles.scarceTags}>
                    <span
                      className={`${styles.rtag} ${
                        r.scarcity === "high" ? styles.rtagHigh : styles.rtagMed
                      }`}
                    >
                      {r.scarcity === "high" ? "High scarcity" : "Med scarcity"}
                    </span>
                    <span
                      className={`${styles.rtag} ${
                        r.engagement === "perm"
                          ? styles.rtagPerm
                          : styles.rtagContract
                      }`}
                    >
                      {r.engagement === "perm"
                        ? "Perm"
                        : r.engagement === "contract-perm"
                          ? "Perm / Contract"
                          : "Contract"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ EXPERTISE ============ */
function L1Expertise({ data }: Props) {
  return (
    <section className={styles.expertise} id="expertise">
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>{data.expertiseEyebrow}</div>
        <h2 className={styles.h2}>{data.expertiseTitle}</h2>
        <p className={styles.sub}>{data.expertiseSub}</p>
        <div className={styles.expertiseGrid}>
          {data.expertise.map((card, i) => {
            const inner = (
              <>
                <div className={styles.expCardBg}>
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 88vw, 300px"
                    className={styles.expCardImage}
                  />
                </div>
                <div className={styles.expCardTint} aria-hidden="true" />
                <div className={styles.expCardOverlay} aria-hidden="true" />
                <div className={styles.expCardInner}>
                  <div className={styles.expCardNum}>{card.num}</div>
                  <h3 className={styles.expCardTitle}>{card.title}</h3>
                  <ul className={styles.expCardRoles}>
                    {card.roles.map((r) => (
                      <li key={r} className={styles.expCardRole}>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.expCardLink}>
                    View contractors
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </>
            );
            return (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={styles.expCardWrap}
              >
                {card.href ? (
                  <Link href={card.href} className={styles.expCard}>
                    {inner}
                  </Link>
                ) : (
                  <div className={styles.expCard} data-static="true">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ SEGMENTS ============ */
function L1Segments({ data }: Props) {
  const [active, setActive] = useState(data.segments[0]?.id ?? "");
  const activeSeg =
    data.segments.find((s) => s.id === active) ?? data.segments[0];
  if (!activeSeg) return null;

  return (
    <section className={styles.segments} id="segments">
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>{data.segmentsEyebrow}</div>
        <h2 className={styles.h2}>{data.segmentsTitle}</h2>
        <p className={styles.sub}>{data.segmentsSub}</p>

        <div className={styles.segWrap}>
          <ul className={styles.segList} aria-label="Select a segment">
            {data.segments.map((s) => {
              const isActive = s.id === activeSeg.id;
              return (
                <li
                  key={s.id}
                  className={`${styles.segItem} ${isActive ? styles.segItemOn : ""}`}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(s.id)}
                    onFocus={() => setActive(s.id)}
                    onClick={() => setActive(s.id)}
                    aria-pressed={isActive}
                    className={styles.segTrigger}
                  >
                    <span className={styles.segItemDot} aria-hidden="true" />
                    <span className={styles.segItemName}>{s.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <motion.div
            className={styles.segPanel}
            key={activeSeg.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.segImgWrap}>
              <Image
                src={activeSeg.image}
                alt={activeSeg.imageAlt}
                fill
                sizes="(max-width: 900px) 92vw, 640px"
                className={styles.segImg}
              />
              <div className={styles.segImgTint} aria-hidden="true" />
              <div className={styles.segImgOverlay} aria-hidden="true" />
            </div>
            <div className={styles.segContent}>
              <h3 className={styles.segH}>{activeSeg.name}</h3>
              <p className={styles.segCopy}>{activeSeg.intro}</p>
              <div className={styles.segRolesLabel}>Roles in demand now</div>
              <div className={styles.segRolesPills}>
                {activeSeg.roles.map((r) => (
                  <span key={r} className={styles.segRolePill}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ BOTTOM CTA ============ */
function L1BottomCta() {
  return (
    <section className={styles.bottomCta}>
      <div className={styles.wrap}>
        <div className={styles.bottomCard}>
          <div className={styles.bottomGlow} aria-hidden="true" />
          <div className={styles.bottomInner}>
            <div className={styles.eyebrow}>Ready to brief us?</div>
            <h2 className={styles.h2}>
              Send the role, the platform, the timeline —{" "}
              <span className={styles.heroEmphasis}>
                get a shortlist in 72 hours.
              </span>
            </h2>
            <p className={styles.sub}>
              No CVs until we understand your programme. Architect-screened
              shortlist matched to your context.
            </p>
            <div className={styles.bottomActions}>
              <Link href="/brief" className={styles.ctaPrimary}>
                Send us a brief
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/contract" className={styles.ctaGhost}>
                Contract model
              </Link>
              <Link href="/eor" className={styles.ctaGhost}>
                EOR model
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ READ NEXT ============ */
function L1ReadNext({ data }: Props) {
  return (
    <section className={styles.readNext}>
      <div className={styles.wrap}>
        <div className={styles.readNextHead}>
          <div className={styles.eyebrow}>Read next</div>
          <h3 className={styles.readNextH}>{data.relatedTitle}</h3>
        </div>
        <div className={styles.readNextGrid}>
          {data.related.map((r) => (
            <Link key={r.href} href={r.href} className={styles.readNextCard}>
              <span className={styles.readNextCat}>{r.category}</span>
              <span className={styles.readNextLabel}>{r.label}</span>
              <span className={styles.readNextArr} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
