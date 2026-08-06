#!/usr/bin/env node
/**
 * check-asset-case — two tracked files whose paths differ only by case.
 *
 *   node scripts/check-asset-case.mjs
 *
 * WHY THIS EXISTS. context-round16-scope.md §2.6: on macOS `Informatica.png`
 * and `informatica.png` are ONE file. That is how a worktree silently
 * overwrote the client wordmark with the platform icon — the two names look
 * distinct in a data file and in a commit, and the filesystem quietly merges
 * them. Whoever checked out last won, and nothing anywhere reported a
 * problem.
 *
 * WHY IT READS GIT AND NOT THE DIRECTORY. The filesystem is the thing that
 * hides this. `ls` on a case-insensitive volume shows one entry where git's
 * index holds two, so a check that walks the directory cannot see the defect
 * it exists to catch, and would pass on the very machine where the damage
 * happens. `git ls-files` reports both.
 *
 * Repository-wide rather than assets-only. The failure mode is a property of
 * the filesystem, not of images: two source modules differing only by case
 * collide in exactly the same way, and CI on Linux would build whichever one
 * the import happened to name while a developer on macOS built the other.
 */
import { execFileSync } from "node:child_process";

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

/** lowercased path -> every tracked path that folds to it. */
const byFolded = new Map();
for (const path of tracked) {
  const key = path.toLowerCase();
  const bucket = byFolded.get(key);
  if (bucket) bucket.push(path);
  else byFolded.set(key, [path]);
}

const collisions = [...byFolded.values()].filter((paths) => paths.length > 1);

if (collisions.length) {
  console.error(
    `\n${collisions.length} case collision(s) among tracked files. On a case-insensitive filesystem each group below is ONE file, and checking out overwrites one with another:\n`,
  );
  for (const group of collisions) {
    console.error(`  ${group.join("\n  ")}\n`);
  }
  console.error(
    "Rename so the paths differ by more than case, in the same commit.",
  );
  process.exit(1);
}

console.log(
  `No case collisions among ${tracked.length} tracked files — every path is distinct with case folded.`,
);
