import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The parallel-session build directories. AGENTS.md requires two sessions
    // in one repository to use two NEXT_DIST_DIRs, and .gitignore has excluded
    // those directories since that rule landed. This list still named only
    // .next, so every gate run linted whichever session's generated output
    // happened to be on disk.
    //
    // That was 2,776 of 2,886 reported errors on 2 Aug 2026: 96% of the number,
    // from compiled chunks nobody may edit, drowning 110 real ones. It also made
    // the count unreproducible between sessions, which is why round 4 measured
    // 624 and round 5 measured 2,886 with no source change between them.
    //
    // Line comments deliberately: the pattern below ends in the two characters
    // that close a block comment, and writing it inside one truncates this file
    // mid-array. Which is exactly how it was first written, and ESLint then
    // failed to parse its own config.
    ".next-*/**",
    // Worktree checkouts nested under the repository root. Each is a full copy
    // of src, so linting them reported every real error two extra times and put
    // six worktree paths in a worst-ten list that has room for three real ones.
    // The files are already linted where they belong, in the worktree that owns
    // the branch.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
