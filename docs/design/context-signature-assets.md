# Context - Signature assets: animated GIF + hosted signature page

**v1.0 · 9 August 2026 · Chat lens · Project GTM.01**
Save to `docs/design/context-signature-assets.md`. Authority: subordinate to `docs/design/yallo-talent-CANON.md`.

## 1. Ruling

Ratified by Sumeet, 9 August 2026:

- One standardised email signature for all staff. Per-person variant choice is superseded.
- The signature banner is a single animated GIF cycling three existing banner designs. Frame 1 is the light 72h-shortlist banner, non-negotiable: recipients on older desktop Outlook or with animations disabled see only frame 1, so frame 1 is the signature for them.
- The copy source is a hosted page at `/signature.html`, bare of all site chrome, that staff copy whole and paste into Outlook.
- Banner copy and the four PNG variants were ratified 8 August 2026. None of this reopens.
- Held for veto, not for this round: whether group-ops staff sign "Yallo Talent" or "Yallo". The template ships "Yallo Talent".

## 2. The GIF

**Sources.** The three variants as defined in `scripts/brand/signature-banners.mjs` (measured, read 9 Aug): `light-72h-shortlist`, `light-ai-talent`, `dark-corridor`. Do not alter their copy, geometry or tokens.

**Sequence.** light-72h-shortlist (frame 1) → cross-fade → light-ai-talent → cross-fade → dark-corridor → cross-fade → loop. Holds 3.5–4s each; each cross-fade 400–600ms in 6–8 intermediate frames. Total loop roughly 12–14s.

**Output.** `public/images/email/signature-animated.gif`, alongside the existing PNGs (measured: they exist at that path and serve from https://yallo.co/images/email/).

**Objective function, not hand-picked values.** Produce the smallest file satisfying all of: (a) frame 1 visually identical to `signature-light-72h-shortlist.png` at the chosen scale; (b) fade banding no worse than mild - GIF's 256-colour palette bands on light-to-dark fades, so dithering and fewer fade steps are the levers; (c) **300KB or less, measured**. Start at 2× (1200×340); if the budget cannot be met at 2×, drop to 1× (600×170) - frame-1 legibility for static-fallback recipients outranks retina sharpness, because those recipients only ever see frame 1.

**Tooling.** `sharp` should already be a dependency (expected, not verified this round) and libvips can encode animated GIF from joined frames; a dedicated encoder such as `gifenc` as a devDependency is permitted. No new runtime dependency. The generator extends `scripts/brand/signature-banners.mjs` or a sibling script in `scripts/brand/`, committed either way.

**Fonts.** The script loads `fonts/*.ttf` by relative path (measured in the script source). Locate the actual font directory before running; if the files cannot be found, stop and report rather than substituting system fonts - the brand faces are the banner.

## 3. The signature page

`public/signature.html`, a bare static document: no site layout, no nav, no footer, no instruction text. The reason is mechanical: staff select-all and copy, so anything on the page ships inside every employee's signature. Instructions live in Sumeet's email, not on the page. `<meta name="robots" content="noindex">` in the head. The page must not enter the sitemap or `llms.txt` (it will not, as a public/ static file - verify rather than assume).

Body, verbatim - the bracketed slots are deliberate edit points for staff, not placeholders to fill:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Yallo Talent - email signature</title></head>
<body style="margin:0;padding:24px;background:#ffffff;">
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
  <tr><td style="font-size:13px;color:#171718;line-height:19px;padding-bottom:14px;">
    Best regards,<br>[FIRST NAME]
  </td></tr>
  <tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#725612;padding-bottom:2px;">
    [FULL NAME]
  </td></tr>
  <tr><td style="font-size:12.5px;font-style:italic;color:#5d5d60;padding-bottom:8px;">
    [JOB TITLE]
  </td></tr>
  <tr><td style="font-size:13px;font-weight:bold;color:#171718;padding-bottom:8px;">
    Yallo Talent
  </td></tr>
  <tr><td style="font-size:12.5px;line-height:20px;padding-bottom:14px;">
    <span style="color:#906e16;">m:</span>&nbsp;<a href="tel:[PHONE-NO-SPACES]" style="color:#171718;text-decoration:none;">[PHONE]</a><br>
    <span style="color:#906e16;">e:</span>&nbsp;&nbsp;<a href="mailto:[EMAIL]" style="color:#171718;text-decoration:none;">[EMAIL]</a><br>
    <span style="color:#906e16;">w:</span>&nbsp;<a href="https://yallo.co/?utm_source=signature&amp;utm_medium=email&amp;utm_content=animated" style="color:#725612;text-decoration:none;">yallo.co</a>
  </td></tr>
  <tr><td>
    <a href="https://yallo.co/?utm_source=signature&amp;utm_medium=email&amp;utm_content=animated" target="_blank" rel="noopener">
      <img src="https://yallo.co/images/email/signature-animated.gif" width="600" height="170" alt="Yallo Talent - contract specialists shortlisted in 72 hours" style="display:block;border:0;outline:none;">
    </a>
  </td></tr>
</table>
</body>
</html>
```

Colour values are the Layer 1 tokens as used in `signature-banners.mjs` (`ink`, `ink3`, `goldInk`, `goldDeep`), hex-inlined deliberately: email clients cannot resolve CSS variables, and `public/` static files sit outside the app's token pipeline. If the raw-colour gate covers `public/**`, log it in the relay rather than weakening the gate.

## 4. Forbidden

- No change to the four existing PNGs or their copy.
- No em dashes in any authored text. UK English. "Yallo" capital Y only.
- No instruction text, headings or chrome on `/signature.html`.
- The bracketed slots (`[FULL NAME]` etc.) are exempt from any no-placeholder rule **on this page only** - that rule exists to stop invented people and dash-filled cells on content pages, and this is an internal template with deliberate edit points. The exemption does not extend anywhere else.
- No deploy. The branch stops green and pushed; Sumeet merges and verifies production personally.
