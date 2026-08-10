# Why each impeccable ignore exists

`.impeccable/config.json` is written by the skill's own admin script and its
`detector.ignoreFiles` entries are bare strings with nowhere to put a reason.
R-26.3 requires the rationale to be recorded with the entry, so this file is
that record. **An ignore with no entry here is an ignore that should be
removed.**

## `detector.ignoreFiles`

### `public/signature.html` — R-26.3, round 26

The hosted source page for the email signature block. Everybody who uses it
copies from it into a mail client, so what it contains is not a web page in the
sense the detector assumes:

- **No CSS custom properties.** Email clients do not resolve `var()`. A design
  token in this file would collapse to nothing in Outlook and in most webmail,
  which is the opposite of what the design system is for. Every colour here is
  therefore a literal, deliberately.
- **Arial and Helvetica, not Inter or Newsreader.** The email-safe stack is the
  only stack that renders as intended across desktop Outlook, Apple Mail, Gmail
  and the webmail clients between them. A web font in a signature is a font
  most recipients never see.
- **The sizes are ratified verbatim.** They were signed off against rendered
  output in the signature round, not derived from the type scale, because the
  scale is a scale for a browser.

The detector was reporting all three as defects. They are the specification.

**Scope:** this file only. The raw-colour gate (`.claude/hooks/check-colours.js`)
is a separate mechanism and its scope is unchanged — it stays off
`public/**/*.html` for the same reason, and stays live everywhere else.

**Reversal:** delete the string from `detector.ignoreFiles` and this section. The
day the signature stops being an email asset, both go.

## `detector.ignoreValues`

Every entry carries its own `reason` field in the config, so that is where the
rationale lives and this file does not copy it. One exception, below, because
R-27.4 asks for the reversal in writing and the config has nowhere to put one.

### `side-tab` on `YalloBlocks.module.css` — R-27.4, round 27

The 3px accent rule down the left edge of `.pullQuote`. Ratified by Sumeet after
relay v37 §6a raised it and deliberately left it unsuppressed for him to decide.

**Rationale.** The rule targets a thick coloured border on one side of a *card*,
which is a real tell. `.pullQuote` is not a card: it is a `<figure>` wrapping a
`<blockquote>`, and a rule down the left edge of a quotation is the oldest
convention in typesetting. The estate is already consistent about that
distinction — `.block` in `Editor.module.css` carries a comment explicitly
refusing a side tab *on a card*, and `.prose blockquote` uses the same left rule
this does. The finding is pre-existing (round 25b, `f8dc9bf`); the hook only
re-scanned the file because round 26 added the `.embed` rules to it.

**Scope:** this one file. `side-tab` stays live in every other stylesheet, which
is the difference between this and `ignore-rule side-tab` — the narrowest form
v37 §6a named.

**Reversal:** remove the `side-tab` object from `detector.ignoreValues` in
`.impeccable/config.json` and delete this section. Reverse it the day a
`.pullQuote` becomes a card, or the day the detector learns to tell a figure from
a card, whichever comes first.
