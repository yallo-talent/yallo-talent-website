# ESLint triage

**2 August 2026 · session A, round 5 · decision 8 of `docs/design/context-round5-rulings.md`**
A report. No lint errors were fixed.

---

## The headline is that the number was wrong

Round 4 reported 624 errors. This run first measured 2,886. Nothing in `src`
changed between them.

Both numbers were mostly generated files. `eslint.config.mjs` overrode
`eslint-config-next`'s default ignores and listed `.next/**`, and nothing else:

| Source | Errors | Share |
|---|---|---|
| `.next-*` parallel-session build output | 2,776 | 96% |
| `.claude/worktrees/**`, two checkouts of the same `src` | 48 | 2% |
| Real, first-party source | **38** | 2% |

`AGENTS.md` requires two sessions in one repository to build into two different
`NEXT_DIST_DIR`s, and `.gitignore` has excluded those directories since that rule
landed. The lint config was never told, so every run linted whichever session's
compiled chunks happened to be on disk. That is why the count moved by 2,262
between two rounds with no source change: it was measuring the other session's
build.

The nested worktrees are the same fault in miniature. Each is a full copy of
`src`, so every real error was counted three times and six of the worst-ten
files were duplicate paths.

**Both are now ignored.** That is a change to the gate, not to any lint error.
The counts below are reproducible.

---

## Counts by rule, first-party source only

| Errors | Rule |
|---|---|
| 34 | `react/no-unescaped-entities` |
| 2 | `react-hooks/set-state-in-effect` |
| 1 | `@typescript-eslint/no-require-imports` |
| 1 | `@next/next/no-assign-module-variable` |
| **38** | **total** |

Warnings: 13, all `@typescript-eslint/no-unused-vars`.
Auto-fixable errors: none.

## Worst ten files

| Errors | File |
|---|---|
| 11 | `src/app/jobs/page.tsx` |
| 5 | `src/app/leadership/page.tsx` |
| 4 | `src/app/about/page.tsx` |
| 3 | `src/app/why-yallo/page.tsx` |
| 2 | `src/app/case-studies/page.tsx` |
| 2 | `src/app/insights/page.tsx` |
| 2 | `src/components/blocks/CvUploadForm.tsx` |
| 2 | `src/components/blocks/service/ServicePageShell.tsx` |
| 1 | `.claude/hooks/check-colours.js` |
| 1 | `src/components/blocks/BriefCTA.tsx` |

---

## What a fix would cost

Small, and smaller than it looks, but it is not free and it is not all one
decision. Thirty-four of the thirty-eight are `react/no-unescaped-entities`,
which is an apostrophe or a quotation mark written literally in JSX text. None
is a rendering defect: the pages are correct in a browser, and the rule exists
to catch the case where a stray brace or bracket silently swallows text.
Mechanically it is an hour, spread across eight copy-bearing files, and the risk
is entirely in the sweep rather than in any single edit, because replacing an
apostrophe with `&rsquo;` inside authored copy is a copy change made by a script.
Typographic apostrophes would be an improvement over both the literal and the
entity, which makes this a content decision wearing a lint error's clothes, and
it belongs with the session that owns copy rather than with a codemod.

The remaining four are individual and want reading rather than sweeping. The two
`set-state-in-effect` errors are a genuine React pattern smell and each needs its
component understood before it is touched; they are the only two of the thirty-
eight that could be masking a real bug. The `no-require-imports` and
`no-assign-module-variable` errors are both in tooling rather than in the app,
where CommonJS is the correct idiom, and the honest resolution is a scoped
override for `.claude/hooks/**` rather than a rewrite.

Recommendation, for Chat rather than taken here: leave all thirty-eight. The
config fix is what made the number mean anything, and 38 reproducible errors
across four rules is a state that can now be watched. Fixing the apostrophes
should ride along with the next copy pass on those eight files, and the two
`set-state-in-effect` errors deserve their own small task with a named owner.
