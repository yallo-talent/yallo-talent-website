# Context — Platform parity round

**v1.0 · 1 August 2026 · Chat lens, ratified by Sumeet 1 Aug 2026 · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. Amends `docs/design/identity-palette-proposal.md` §3.
Scope of this round: platform L1s and L2s only. Nothing else.

---

## 1. Two ambient hues are rejected

Sumeet's verdict, 1 Aug 2026: **moss and umber both go.** The other four (indigo, teal, plum, violet) are approved and stay untouched.

| Retired | Was used by | Replacement | Light | Dark |
|---|---|---|---|---|
| `moss` `#4a7d55` | Blue Yonder, Integration & Middleware, Government & Public Sector | **`harbour`**, a soft cool blue, Sumeet's explicit ask | `#3E6E85` | `#5289A5` |
| `umber` `#9a6e3e` | Oracle, DevOps & Platform Engineering, Manufacturing & Logistics | **`claret`**, a muted wine that keeps the family's warm end without reading brown | `#8B3E4E` | `#AF5F70` |

**Rename the tokens, do not alias.** `--amb-moss-*` becomes `--amb-harbour-*`, `--amb-umber-*` becomes `--amb-claret-*`, and every consumer updates. Leaving a dead alias behind is how the next reader concludes the site still has a green.

**Umber has a second life to kill.** The dark-register comment block in `globals.css` cites "the umber ambient at 30%" as part of why the ground read brown. Update that comment so it does not describe a token that no longer exists.

**Proof required before you call this done.** These are derived values, not measured ones, and R11 already taught that a hue behaves differently at real alpha than on a swatch. So:

1. Render both hues at `--amb-alpha` (20% light, 30% dark) on a real platform page, both themes.
2. Check perceptual separation of `harbour` against `indigo` `#3a5a8a`, against `teal` `#3d7d7d`, and against the functional blue `--fn-info-mark-l` `#1d6fa5`. Harbour is only 20 degrees from indigo, so this is the one real risk in the change.
3. Check `claret` against `plum` `#8e4a72` and against `--fn-signal-mark-l` `#c2410c`.
4. Re-run `scripts/check-contrast.mjs`. Confirm zero identity-hue leaks onto any control, the same measurement the R4 round passed.
5. Put a contact sheet in `docs/status/shots/` and name it in the relay. If separation fails, report it. Do not author a third variant on your own judgement, and do not touch the four approved hues to make room.

## 1a. Informatica takes a seventh hue, ratified

Seven platforms need seven hues, so the family grows to seven. **Informatica takes `mulberry`: `#7B4988` light, `#9D63AB` dark.**

| Token | Light | Dark |
|---|---|---|
| `--amb-mulberry-l` / `--amb-mulberry-d` | `#7B4988` | `#9D63AB` |

**Why this hue and not another.** The wheel is genuinely full. Gold owns 43 degrees and the two reds either side are `--fn-signal` and `claret`; green is rejected; the blue band from 180 to 217 already holds teal, harbour and indigo. The only real gap in the family sits between violet at 249 degrees and plum at 325, and mulberry lands at 288, roughly equidistant from both. That spacing is wider than two pairs already shipped and approved: teal to harbour is 17 degrees and indigo to violet is 32.

**Check it against, in this order:** `violet` `#5f5694`, `plum` `#8e4a72`, and `--fn-category-mark-l` `#9d3f7a`, which is 34 degrees away and far more saturated. Same proof procedure as the two hues above.

**Nothing else moves.** Mulberry is assigned to Informatica only. No discipline and no sector takes it in this round. Disciplines and sectors keep their existing assignments with the two substitutions above applied, so harbour covers Integration & Middleware and Government & Public Sector, and claret covers DevOps & Platform Engineering and Manufacturing & Logistics.

The family is now seven: indigo, teal, harbour, violet, mulberry, plum, claret. Update `docs/design/identity-palette-proposal.md` §1 and §3 to match, including its own note that six hues cannot make eighteen domains unique. That note is now half-answered rather than open.

---

## 2. Product-family chips, redesigned

The current SAP treatment fills nineteen chips with solid gold. Sumeet's verdict: too gold, too crowded, too busy. It is also the R11 fault returning by another route, since gold *coverage* is what makes a page read brown.

Replace with slim, soft-edged buttons:

| Property | Light | Dark |
|---|---|---|
| Surface | `--paper-2` | `--dk-3` |
| Hairline, 1px | `--rule` | `--dk-line` |
| Label | `--ink-2` | `--dk-txt-2` |
| Depth, single shadow | `0 1px 2px rgba(0,0,0,0.06)` | `0 1px 2px rgba(0,0,0,0.35)` |
| Hover and focus | hairline to `--gold-deep`, surface to `--paper`, shadow to `0 2px 4px` | hairline to `--gold`, surface to `--dk-2`, shadow to `0 2px 6px` |

- Uniform soft radius, 6px. **No petal at chip scale.** The signature is a quarter-round on a card; repeated forty times it becomes noise. Petal stays on cards and bands.
- Slim: roughly 6px vertical and 12px horizontal padding. Keep the interactive target at 24px minimum per WCAG 2.5.8, achieved with padding rather than a taller box.
- Real anchors routing to the module L2, `:focus-visible` ring in gold at 2px offset, transition 150ms maximum, no lift greater than 1px, no glow, no inner highlight, no gradient.
- Gold after this change appears only as a hairline on hover and focus. That is the whole intent.

Ship it on SAP, confirm with Sumeet's eye in the relay screenshot, then replicate across every platform L1.

---

## 3. SAP Business AI, the empty section

Research done 1 Aug 2026. **[FACT]** unless marked. Sources: SAP News Center Sapphire 2026 releases (May 2026), SAP News Center Business AI Q2 2026 release highlights (July 2026), SAPinsider and Constellation Research Sapphire 2026 coverage.

**What SAP now calls it.** At Sapphire 2026 SAP announced the **SAP Business AI Platform**, consolidating its AI foundation layer with SAP Business Data Cloud and SAP Business Technology Platform into one offering. This matters for the page because it is a consolidation: the old habit of listing AI Core, AI Launchpad and Generative AI Hub as separate desks is now out of date.

**The desks to publish**, seven, matching the depth pattern of the other SAP families:

| Desk | Scope |
|---|---|
| Joule and Joule Assistants | The assistant layer across S/4HANA Cloud, SuccessFactors, Ariba, Concur and Service Cloud. RISE activates three assistants in year one; GROW carries the full portfolio |
| Joule Studio and Joule Agents | Building, managing and governing agents, including third-party agents. **Joule Work** is the newer natural-language interface layer and is in early adopter status |
| SAP Business AI Platform and BTP | The foundation layer, runtime, and clean-core extension work |
| Business Data Cloud and Datasphere | The data foundation agents are grounded on. SAP Master Data Governance is now a core component of Business Data Cloud; SAP acquired Reltio for entity resolution |
| SAP Domain Models and grounding | Models trained on SAP code, data, metadata, process and documentation, which ground Joule rather than generic web knowledge. Context graphs sit here |
| Autonomous Finance | The finance assistant suite: financial closing, financial planning, billing, governance, tax and compliance, accounts receivable, cash and treasury |
| Agent governance and interoperability | Guardrails, and interoperability through Model Context Protocol and agent-to-agent, including bidirectional interoperability with Google Cloud and Microsoft agent frameworks |

**Roles for the bench list on this desk.** SAP BTP AI Developer · Joule Studio Agent Developer · SAP AI Platform Engineer · Business Data Cloud Engineer · SAP Datasphere Engineer · Master Data Governance Consultant · Clean Core Extension Architect · ABAP Cloud Developer · Prompt and Context Engineer, SAP-grounded · MLOps Engineer, SAP AI · AI Governance Lead, SAP agents · Autonomous Finance Functional Lead · Process Mining Analyst feeding agent design · Integration Architect, MCP and agent-to-agent.

**The one Claude line, and only one.** SAP named Anthropic as a partner at Sapphire 2026, with Claude among the foundation models its AI platform uses to power Joule agents across HR, procurement and supply chain. That is a factual hook for Yallo's own Claude depth. One sentence, low on the page, per canon: Claude is depth-proof, never the organising claim. Also note n8n is now embedded in Joule Studio for visual workflow orchestration, which cross-links to the AI talent stack matrix.

**Forbidden on this section.** Every SAP performance figure. The 80 per cent of business tasks claim, the 35 per cent migration-effort reduction, the 40 to 60 per cent HR cycle-time figure and the 400 use cases are all SAP's own marketing and must not appear as Yallo's claim, sourced or not. No customer names. Do not describe what Joule does for a business; write what Yallo places on it. Do not state a GA date for anything, including Palantir AIP.

**Boundary with `/ai-talent`.** This desk is SAP-specific roles on SAP's AI stack. `/ai-talent` is the vendor-neutral role-family family. Cross-link both ways, once each, and do not duplicate the stack matrix here.

---

## 4. How We Work band, two fixes

**Padding.** The band starts abruptly against the section above it. Measure the computed `padding-top` and check for a collapsed margin at the band boundary before assuming a token is missing. Fix the class, not the SAP instance, then verify at 360, 768 and 1280 in both themes on every page carrying the band.

**Connector.** Join the four numbered steps with a hairline and a single travelling dot, the same pattern as the homepage hero connector.

- Reuse the homepage connector component. Do not author a second one.
- This consumes the section's one purposeful travelling element under the ratified motion budget: transforms and opacity only, 400 to 1200ms, one pass, never raster.
- `prefers-reduced-motion` renders the hairline and four static markers with no dot travel.
- The hairline is a rule, not gold at accent weight, and it must not become a fifth thing competing for attention. At mobile widths the connector becomes vertical or is dropped, whichever reads cleaner. Do not squeeze a horizontal line into 360px.

---

## 5. Parity checklist, applied to the other five, then Informatica

SAP is the reference. Sumeet has reviewed it closely and approved it. Every platform L1 and its L2s carries all of the following, with content genuine to that platform and nothing carried across by analogy:

1. The sticky mini-bar, with that platform's own section taxonomy rather than SAP's labels.
2. The product-family chips per §2.
3. "Specialists, by module" hero with the module and role counts derived from real data, never asserted by hand.
4. The four proof cards.
5. **The full bench list at SAP depth.** Real market job titles, relevant to that platform, at the granularity of the SAP list rather than a token twenty. No scarcity flag, no count, no rate on any of them.
6. The How We Work band per §4.
7. Sector cross-links driven from real L1 data, gated out below three sectors rather than rendered as a one-item grid.

Platforms in canon §3 order: SAP (reference), Oracle, Microsoft, Salesforce, Blue Yonder, Workday. Informatica inherits the whole of this file when its page lands.

---

## 6. Forbidden across this round

- Any invented job title, module, product name or vendor figure.
- Any client, quotation, metric, source, case study or date not already in the repo.
- Any change to indigo, teal, plum or violet.
- Any gold fill where a hairline will do.
- Any raster animation.
- Banned vocabulary per canon §2, no em dashes, UK English.
