# Brand asset pipeline — signature banners

Derived, not hand-made: these scripts render the four email signature banners
from the design-system tokens and the real flower mark geometry, so the assets
regenerate identically anywhere. Ratified by Sumeet 8 Aug 2026 (four variants,
copy and hues locked; the Measured variant carries SAP · Oracle · Microsoft ·
Salesforce · AWS · Azure · GCP by his ruling).

Usage, from this directory:

    bash setup.sh            # fonts (google/fonts, pinned instances) + resvg
    node signature-banners.mjs

Output: `public/images/email/signature-{variant}.png` at 1200x340 (2x of
600x170). Variants: light-72h-shortlist, light-ai-talent, dark-measured,
dark-corridor. The team's email signature snippet points at these paths.

Do not edit the PNGs by hand; change this script and re-render. Copy changes
need Sumeet's sign-off, as with any published copy.
