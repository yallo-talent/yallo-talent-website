#!/usr/bin/env node
// Blocks commits that introduce hardcoded hex colours outside globals.css
// Layer 1 (raw palette). Semantic tokens (Layer 2+) must be used everywhere else.
const { execSync } = require("node:child_process");

const staged = execSync("git diff --cached --name-only --diff-filter=ACM")
  .toString()
  .split("\n")
  .filter(Boolean)
  .filter((f) => /\.(css|tsx|ts)$/.test(f) && f !== "src/app/globals.css");

const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
let failed = false;

for (const file of staged) {
  const diff = execSync(`git diff --cached -- "${file}"`).toString();
  const addedLines = diff
    .split("\n")
    .filter((l) => l.startsWith("+") && !l.startsWith("+++"));
  for (const line of addedLines) {
    if (hexPattern.test(line)) {
      console.error(
        `[check-colours] Hardcoded hex found in ${file}: ${line.trim()}`,
      );
      failed = true;
    }
  }
}

if (failed) {
  console.error(
    "\nUse semantic tokens from globals.css (Layer 2+), not raw hex.",
  );
  process.exit(1);
}
