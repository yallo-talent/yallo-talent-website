#!/usr/bin/env bash
# =============================================================================
# talent.yallo.co — Phase 0 Scaffold
# Source: docs/architecture/exicution.html (Phase 0: "CoWork + CLI Scaffold")
#         + intelligence-layer additions agreed 2026-07-27 (CI gate, AGENTS.md,
#           Playwright smoke test, 5 custom subagents for the "team")
#
# ASSUMPTIONS — check these before running:
#   1. Run this from the ROOT of the talent.yallo.co repo (where docs/ already
#      lives). It scaffolds the Next.js app IN PLACE. If you actually want a
#      separate sibling repo called "yallo-co" instead, stop and say so first.
#   2. Existing docs/deisgns/ (typo preserved) is left as-is — not renamed to
#      docs/designs/ — to avoid breaking any links already pointing at it.
#   3. Git identity below is what you gave me. "raphy202@gmail.co" looks like
#      it might be missing the final "m" (gmail.com) — fix line 24 if so.
#   4. Requires: pnpm 9, Node 20+, git. Run `pnpm -v` / `node -v` first.
#
# This script only sets up scaffolding — no page content, no copy. That's
# Phase 1+ per the execution plan.
# =============================================================================
set -euo pipefail

# -----------------------------------------------------------------------------
# 0. Git identity — local to this repo only (no global config was found)
# -----------------------------------------------------------------------------
# Git identity already set correctly at repo level (Raphy Varghese / raphy202@gmail.com)
# git config user.name  "Raphy Varghese"
# git config user.email "raphy202@gmail.com"

# -----------------------------------------------------------------------------
# 1. Next.js app, in place
# -----------------------------------------------------------------------------
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --no-git   # repo already initialised, don't let it re-init

# Pin exact stack versions locked in arc_v10.html
pnpm add framer-motion@12 next-mdx-remote sharp resend @vercel/analytics
pnpm add -D @biomejs/biome husky @commitlint/cli @commitlint/config-conventional \
  @playwright/test typescript@5

# -----------------------------------------------------------------------------
# 2. Folder tree per arc_v10.html data model + exicution.html Phase 0
# -----------------------------------------------------------------------------
mkdir -p src/app/{industries/\[sector\]/\[fn\],platforms/\[platform\]/\[module\],capabilities/\[cap\]/\[sub\],contract,permanent,eor,managed-delivery,api}
mkdir -p src/components/{ui,blocks,layout,motion,forms}
mkdir -p src/data/{industries,platforms,capabilities,pages}
mkdir -p src/content/{insights,case-studies}
mkdir -p src/lib src/types src/hooks
mkdir -p public/{images,logos,fonts}
mkdir -p docs/content   # new — content ops docs, referenced in exicution.html
mkdir -p e2e            # Playwright smoke tests (intelligence-layer addition)
mkdir -p .claude/hooks .claude/agents .github/workflows

touch src/data/types.ts src/lib/data.ts

# -----------------------------------------------------------------------------
# 3. Biome — lint/format
# -----------------------------------------------------------------------------
cat > biome.json <<'EOF'
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
EOF

# -----------------------------------------------------------------------------
# 4. Husky + Commitlint — conventional types incl. plan's custom "data" type
# -----------------------------------------------------------------------------
pnpm husky init

cat > commitlint.config.js <<'EOF'
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "data", "style", "perf", "docs", "test", "refactor", "ci"]
    ]
  }
};
EOF

cat > .husky/pre-commit <<'EOF'
#!/usr/bin/env sh
pnpm biome check --write .
node .claude/hooks/check-colours.js
EOF
chmod +x .husky/pre-commit

cat > .husky/commit-msg <<'EOF'
#!/usr/bin/env sh
pnpm commitlint --edit "$1"
EOF
chmod +x .husky/commit-msg

# -----------------------------------------------------------------------------
# 5. Colour hook — "zero hardcoded hex" enforcement (per exicution.html)
# -----------------------------------------------------------------------------
cat > .claude/hooks/check-colours.js <<'EOF'
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
  const addedLines = diff.split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++"));
  for (const line of addedLines) {
    if (hexPattern.test(line)) {
      console.error(`[check-colours] Hardcoded hex found in ${file}: ${line.trim()}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nUse semantic tokens from globals.css (Layer 2+), not raw hex.");
  process.exit(1);
}
EOF

# -----------------------------------------------------------------------------
# 6. AGENTS.md — root project context (intelligence-layer addition)
# -----------------------------------------------------------------------------
cat > AGENTS.md <<'EOF'
# AGENTS.md — talent.yallo.co (yallo-co)

Contract-first Yallo Talent site. UK · ME · India. Next.js 15 / TS5 strict /
Tailwind 4 / pnpm 9 / Framer Motion 12. Static-generated, no CMS at launch.

## Ground rules
- All commits are authored as **Raphy Varghese** — no co-author trailers, ever.
- Nothing changes on the locked decisions (see docs/architecture/exicution.html
  "Decisions" section) without Raphy's explicit sign-off.
- Zero hardcoded hex colours outside `src/app/globals.css` Layer 1 — enforced
  by `.claude/hooks/check-colours.js` on every commit.
- Data-file changes (src/data/**) use the `data:` commit type.
- Phase order is fixed: 0 Scaffold → 1 Design System/TS → 2 Homepage →
  3 Service Pages/Templates → 4 Industry/Platform Taxonomy → 5 Capabilities/
  Knowledge Hub → 6 Jobs Portal/QA/Perf Gate. See docs/architecture/exicution.html
  for full detail.
- Performance gate before DNS switch: Lighthouse Mobile 90+, LCP <2.5s,
  CLS <0.1, INP <200ms, WCAG 2.2 AA.

## Source of truth
- `docs/architecture/exicution.html` — phase-by-phase execution plan
- `docs/architecture/arc_v10.html` — system architecture, data model, routes
- `docs/architecture/l1_page_plan.html` / `l2_page_plan.html` — page template mockups
- `docs/deisgns/home/` — 11 homepage sections, numbered in build order

## Team (see .claude/agents/)
architect, uiux-emil, content-strategist, seo-geo-aeo, performance-qa —
one subagent per discipline in docs/architecture/teamand tools_v2.html.
Raphy retains sign-off authority on all of them.
EOF

# -----------------------------------------------------------------------------
# 7. CI gate (intelligence-layer addition — plan only specifies local hooks)
# -----------------------------------------------------------------------------
cat > .github/workflows/ci.yml <<'EOF'
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm biome check .
      - run: pnpm tsc --noEmit
      - run: pnpm build
EOF

# -----------------------------------------------------------------------------
# 8. Playwright smoke test scaffold (intelligence-layer addition)
# -----------------------------------------------------------------------------
cat > playwright.config.ts <<'EOF'
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm dev",
    port: 3000,
    reuseExistingServer: true,
  },
  use: { baseURL: "http://localhost:3000" },
});
EOF

cat > e2e/smoke.spec.ts <<'EOF'
import { test, expect } from "@playwright/test";

test("home page renders and nav is present", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Yallo/i);
  await expect(page.locator("nav")).toBeVisible();
});
EOF

# -----------------------------------------------------------------------------
# 9. Spec stubs — "plant these before build starts" (exicution.html Phase 0)
# -----------------------------------------------------------------------------
for f in DESIGN_SYSTEM ANIMATION_SPEC HOMEPAGE_SPEC COMPONENT_INVENTORY; do
  cat > "docs/deisgns/${f}.md" <<EOF
# ${f}

Status: draft — to be filled per docs/architecture/exicution.html Phase 0.
EOF
done

# -----------------------------------------------------------------------------
# 10. The team — 5 custom subagents (docs/architecture/teamand tools_v2.html)
#     Full bodies are in the companion files this script expects alongside it:
#       agents/architect.md, agents/uiux-emil.md, agents/content-strategist.md,
#       agents/seo-geo-aeo.md, agents/performance-qa.md
#     Copy them into .claude/agents/ (same filenames).
# -----------------------------------------------------------------------------
echo ""
echo "NOTE: copy the 5 agent definition files (provided alongside this script)"
echo "into .claude/agents/ before first use."

# -----------------------------------------------------------------------------
# 11. First commit
# -----------------------------------------------------------------------------
git add -A
git commit -m "chore(scaffold): initialise yallo-co golden path repo

- Next.js 15 / TS5 strict / Tailwind 4 / pnpm 9 / Framer Motion 12
- Phase 0 folder tree per arc_v10.html data model
- Biome + Husky + Commitlint (colour-hardcode hook)
- AGENTS.md, CI gate, Playwright smoke scaffold
- 5 discipline subagents in .claude/agents/"

echo "Phase 0 scaffold complete."
