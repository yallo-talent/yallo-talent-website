# Yallo Talent — Content Authoring Guide

**Version 1.0 · 29 July 2026 · Project GTM.01 — Websites — Product Build**
Audience: Sumeet, Tanzil, Raphy's pod, and anyone who publishes to yallo.co after go-live.
Status: reference document. Add to the project knowledge base.

---

## 1. What this is

The yallo.co site keeps its content in files inside the repository, not in a database behind a login. Articles, case studies, client logos and headline metrics can all be added or edited without touching a single component, and without a developer.

This document explains how.

If you have used WordPress, the mental shift is this: instead of logging into an admin panel and filling in boxes, you add a text file to a folder and commit it. The site rebuilds and the page exists. There is no separate publish step and no database to keep in sync.

## 2. Why we chose this over a CMS

Three reasons, recorded so the decision does not get relitigated.

**Search performance.** Articles are the site's main route to organic traffic. Content held in files is built into static pages at deploy time, so a reader and a search crawler both get finished HTML with nothing to fetch. A content management system fetched at request time is slower on exactly the metrics Google measures.

**Reviewability.** Every change is a normal code change. You can see what was edited, by whom, when, and revert it. A database row overwritten at 11pm leaves no trace.

**Cost and dependency.** No vendor, no licence, no third system to keep alive, no migration if that vendor changes its pricing. The tools required are already installed.

The trade-off is real and worth stating: publishing needs a person who is comfortable committing a file, or a person working with Claude Code. Section 9 covers what happens when that stops being acceptable.

## 3. Two tiers of content

Content is split by how often it changes, and the two tiers live in different places.

| Tier | What it covers | Where it lives | Who changes it |
|---|---|---|---|
| **Structural** | Navigation, positioning copy, service pages, platform and industry page copy | `src/data/` as TypeScript | Sumeet, deliberately, with Claude Code |
| **High churn** | Articles, case studies, client logos, testimonials, team profiles, headline metrics | `content/` as MDX and YAML | Anyone, by adding a file |

The split matters. Structural content carries the positioning and is governed by canon, so changing it should feel deliberate and should be reviewed. High-churn content is the opposite: it should be trivial to add and should never require a discussion.

## 4. What MDX is

MDX is Markdown with the option of dropping in a component when you need one. For almost everything you write, it is just Markdown:

```
## A heading

A paragraph of text with **bold** and a [link](https://example.com).

- A list item
- Another one
```

Every file has a block at the top, between two lines of three dashes, called frontmatter. That block holds the structured facts about the article: its title, its date, its category. The page body follows underneath.

You will not need the component part unless you are embedding something like a table of scarcity data. When that comes up, ask.

## 5. Directory map

```
content/
├── insights/            One .mdx file per article
├── case-studies/        One .mdx file per case study
├── team/                One .mdx file per consultant
├── clients.yaml         The client and integrator logo walls
└── metrics.yaml         The headline numbers on the homepage
```

The filename becomes the URL. `content/insights/enterprise-architect-middle-east.mdx` publishes at `yallo.co/insights/enterprise-architect-middle-east`. Keep filenames lowercase, words separated by hyphens, no spaces, no capitals, no underscores.

## 6. Publishing an article

1. Create a new file in `content/insights/`. Name it after the URL you want.
2. Copy the frontmatter template below and fill it in.
3. Write the body in Markdown beneath the closing `---`.
4. Commit and push. The site rebuilds and the article is live.

### Frontmatter for an article

```yaml
---
title: "Why enterprise architects are the hardest role to fill in the Middle East"
date: 2026-07-29
summary: "One sentence that appears on the insights index and in search results. Under 160 characters."
author: "Tanzil Ahmed"
readingTimeMinutes: 6
published: true

# Taxonomy. Use only slugs that exist on the site. Any of these may be omitted.
industry: retail
platform: sap
discipline: data-analytics

# Every number in the body needs one of these.
sources:
  - claim: "72% of employers report difficulty filling roles"
    source: "ManpowerGroup 2026 Talent Shortage Survey"
    url: "https://go.manpowergroup.com/talent-shortage"
---
```

### The fields that are not obvious

**`published`.** Set it to `false` and the article exists in the repository but appears nowhere on the site. Use this for drafts. Nothing half-finished should ever be `true`.

**`sources`.** This is not optional decoration. The site rule is that no figure appears without a visible source, and the build is configured to fail if a number appears in the body without a matching entry here. If you cannot source a figure, remove the figure.

**`industry`, `platform`, `discipline`.** These drive the taxonomy pages at `/insights/industry/retail` and similar. Use the exact slugs from the site. Inventing a new slug will fail the build rather than silently create an orphan page.

**`author`.** Attribute to the person who actually wrote it. Do not put Sumeet's name on something he did not write. This is a standing rule, not a preference.

## 7. Publishing a case study

Same process, in `content/case-studies/`. The frontmatter carries more structure because case studies make claims that need to hold up.

```yaml
---
title: "Three SAP specialists on a Middle East banking programme in 72 hours"
date: 2026-07-29
summary: "One sentence for the index and for search."
published: true

client: "Name of client"
clientPublic: true        # false until written logo and naming consent is on file
platform: sap
industry: finance
region: "United Arab Emirates"
outcome: "Programme mobilised on the original date"

metrics:
  - value: "72h"
    label: "Brief to shortlist"
    source: "Vincere placement record, engagement 4417"
  - value: "2:1"
    label: "CV to interview ratio"
    source: "Vincere placement record, engagement 4417"
---
```

**`clientPublic` is the important one.** Set it to `false` and the client name is replaced with a description throughout, for example "a Middle East banking group". It stays `false` until written consent to name the client and use their logo is on file. Never set it to `true` on the assumption that consent exists.

## 8. Logos, metrics and team

These three are YAML rather than MDX, because they are structured lists rather than prose.

**`content/clients.yaml`** holds two groups. `enterprise` is the accounts Yallo owns. `integrators` is the systems integrators who buy Yallo's specialists. They render as two separate walls with different headings, and they must never be merged into one strip.

```yaml
enterprise:
  - name: "Landmark"
    logo: "/logos/clients/landmark.svg"
    consentOnFile: false
integrators:
  - name: "TCS"
    logo: "/logos/clients/tcs.svg"
    consentOnFile: false
```

Any entry with `consentOnFile: false` renders nowhere. That is deliberate. Add the logo file and the entry now, flip the flag when the paperwork lands.

**`content/metrics.yaml`** holds the homepage numbers. Every metric needs a `source` and the file needs an `asAt` date, which renders on the page. Whoever owns the quarterly refresh updates that date. A metric with a stale `asAt` is worse than no metric.

**`content/team/`** holds one MDX file per consultant: name, role, specialism, platforms, region, a direct contact route, and an optional photo. Launch with real names and no photographs rather than placeholder people. Never publish an invented person.

## 9. Rules the build enforces

These are not guidelines. The build fails and the site does not deploy.

- Frontmatter that does not match the schema.
- A taxonomy slug that does not exist on the site.
- A number in an article body with no matching `sources` entry.
- An internal link pointing at a route that does not exist.
- A raw colour value written anywhere except the single tokens file.

If a build fails, the message names the file and the field. Fix it and push again.

## 10. What not to do

- Do not paste from Word. It carries invisible formatting. Paste as plain text.
- Do not write "GCC" when you mean the Gulf. Write "Middle East", or name the country. In Yallo's own India business, GCC means Global Capability Centre, and the collision is real.
- Do not describe what a platform does. Write what Yallo places on it. "SAP Customer Experience delivers personalised experiences" is vendor marketing. "Finding SAP CX consultants who have delivered in live retail" is the site's voice.
- Do not put rates, fees or day rates on the public site. Rate bands live inside the gated Programme Staffing Blueprint.
- Do not create a folder that is not in the map above. Ask instead.

## 11. When we add an editing interface

The trigger is specific: the first time somebody who is neither Sumeet nor working with Claude Code needs to publish without help.

At that point a git-backed editor such as Decap or Tina installs on top of these same files. It gives a browser interface with form fields and a preview, and it commits to the repository underneath. Nothing migrates, no content moves, and the site keeps building statically.

The decision waits until the trigger fires. Adding it earlier means maintaining an interface nobody is using.

---

## Quick reference

| Task | Do this |
|---|---|
| Publish an article | Add `content/insights/your-slug.mdx`, commit |
| Hide a draft | Set `published: false` |
| Add a case study | Add `content/case-studies/your-slug.mdx`, commit |
| Add a client logo | Add the SVG to `public/logos/clients/`, add the entry to `clients.yaml` |
| Show a client logo | Set `consentOnFile: true` once consent is on file |
| Update the homepage numbers | Edit `content/metrics.yaml`, update `asAt` |
| Add a consultant | Add `content/team/firstname-lastname.mdx` |
| Anything else | Ask before inventing a pattern |
