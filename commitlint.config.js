module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "data",
        "style",
        "perf",
        "docs",
        "test",
        "refactor",
        "ci",
      ],
    ],
  },
};
