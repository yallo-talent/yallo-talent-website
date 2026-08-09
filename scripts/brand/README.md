# Brand asset pipeline — signature banners

Derived, not hand-made: these scripts render the four email signature banners
from the design-system tokens and the real flower mark geometry, so the assets
regenerate identically anywhere. Ratified by Sumeet 8 Aug 2026 (four variants,
copy and hues locked; the Measured variant carries SAP · Oracle · Microsoft ·
Salesforce · AWS · Azure · GCP by his ruling).

Usage, from this directory:

    bash setup.sh            # fonts (google/fonts, pinned instances)
    npm install              # resvg, local to this directory and not shipped
    node signature-banners.mjs
    node signature-gif.mjs

Output: `public/images/email/signature-{variant}.png` at 1200x340 (2x of
600x170). Variants: light-72h-shortlist, light-ai-talent, dark-measured,
dark-corridor. The team's email signature snippet points at these paths.

`signature-gif.mjs` writes `public/images/email/signature-animated.gif`, the
one banner the standardised signature actually carries: three of those
variants cross-faded, 600x170, frame 1 the light 72h-shortlist banner. It
measures what it encodes and exits non-zero if the result misses frame-1
fidelity, fade quality or the file-size budget, so the encoder settings cannot
quietly stop being the right ones. `--search` re-runs the sweep those settings
came from. Ratified by Sumeet 9 Aug 2026; frame 1 is fixed, because recipients
whose client will not animate see frame 1 and nothing else.

Both scripts render the fonts from `fonts/`, explicitly and with system fonts
switched off. If that directory is missing, run `setup.sh` rather than letting
anything substitute: the brand faces are the banner.

Do not edit the PNGs by hand; change this script and re-render. Copy changes
need Sumeet's sign-off, as with any published copy.
