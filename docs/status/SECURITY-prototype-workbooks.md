# Credential exposure — prototype reference workbooks

**1 August 2026. Raised by me, caused by me.**

## What happened

Commit `3ae20b5` added 13 `.xlsx` reference workbooks under
`prototype/L1, L2 Details/` and was **pushed to `origin/main`**. One of them —
`Platforms L1, L2s/1. SAP L1, L2.xlsx` — contains a plaintext login in its
shared-strings table:

```
Login ID: sap@yallo.co
Pwd: <redacted — see the file>
```

The cause was mine and it was mechanical: I have been staging with `git add -A`
all session. The workbooks were untracked-but-present on disk (`?? prototype/…`
in the session's opening git status), so a blanket add swept them in. I did not
look at what `-A` was staging.

## What I have done

- `git rm --cached` on the whole `prototype/L1, L2 Details/` directory — the
  files stay on disk and leave the index.
- `.gitignore` now excludes that directory, so no future `git add -A` re-adds it.

## What I have NOT done, and why

**The credential is still in git history on GitHub.** Removing a file from HEAD
does not remove it from the commits that contained it. Two things are needed and
both are yours to decide:

1. **Rotate the SAP password now.** Treat it as compromised regardless of what
   happens to the history — it has been on a remote, and remote copies, forks,
   clones and any CI cache may retain it. This is the step that actually matters;
   history rewriting is housekeeping by comparison.
2. **Decide on history.** Purging it means rewriting `main` and force-pushing,
   which breaks every existing clone and is not something I will do to a shared
   branch unbidden. Say the word and I will prepare it; otherwise the untrack
   plus rotation is the sane resting state.

## What changes in how I work

Stop using `git add -A` in this repo. Stage explicit paths, or at minimum read
`git status` before staging when untracked files are present.
