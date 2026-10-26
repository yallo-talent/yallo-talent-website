# Sessions, worktrees, dist directories and ports

Loaded on demand, named by plain path from `CLAUDE.md`. Moved from the root instruction files on 26 Oct 2026; no rule changed.

## Worktrees

- `../yallo-talent-sig` is a **git worktree of this repo**, not a separate project: same `.git`, same remote, branch `feat/email-signature-gif`. Changes there land in this repo.
- Never open a second competing branch for the same file across worktrees; check `git worktree list` before branching.

## Dist directories and ports

- **A single-session round uses one dist directory and one port.** The default is plain `.next`; do not invent a per-session name when there is no second session to collide with.
- Two sessions in one repository use two branches, two worktrees and two build directories. `NEXT_DIST_DIR` is honoured by `next.config.ts`; `.claude/launch.json` carries `session-a` on 3001 and `session-b` on 3002. Sharing `.next` is how a whole measurement pass came to describe a stale build.
- **Any session that creates a per-session dist directory deletes it at the end of its round.** The convention was never wrong; nothing ever required the cleanup, and that omission is the whole cause. Round 16 swept what was left of it.
- Stage explicit paths, never `git add -A`.
- `next dev` rewrites `tsconfig.json` to add its dist dir's types and reformats the file while it is there. Under a custom `NEXT_DIST_DIR` the rewrite names that directory, so the file becomes session-local and must never reach a commit: `git checkout -- tsconfig.json` before staging, and never include it in an explicit path list.
- Before trusting any measurement, check WHICH server is on the port. `next start` on a stale build answers 200 and never shows your edits, and a job killed in one shell does not die in the next. `lsof -ti:PORT`.

## Context documents

- **A context document is not in play until it is committed.** Chat writes `docs/design/context-*.md` into one session's working tree; a parallel worktree cannot see an uncommitted file and reads the absence as a blocked task. In round 4 a P0 was nearly reported blocked for exactly this.
- Every `docs/design/context-*.md` present in the tree is committed in the first commit of a run, before any work that depends on it.
