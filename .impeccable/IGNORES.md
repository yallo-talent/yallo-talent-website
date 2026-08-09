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

Those entries carry their own `reason` field in the config and need no second
copy here. Read them there.
