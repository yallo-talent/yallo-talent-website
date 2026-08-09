#!/usr/bin/env bash
# Fonts + renderer for the brand asset pipeline. Run from scripts/brand/.
set -euo pipefail
mkdir -p fonts
base="https://raw.githubusercontent.com/google/fonts/main/ofl"
curl -sL -o fonts/Newsreader-var.ttf "$base/newsreader/Newsreader%5Bopsz%2Cwght%5D.ttf"
curl -sL -o fonts/Inter-var.ttf "$base/inter/Inter%5Bopsz%2Cwght%5D.ttf"
curl -sL -o fonts/PlexMono-Regular.ttf "$base/ibmplexmono/IBMPlexMono-Regular.ttf"
curl -sL -o fonts/PlexMono-Medium.ttf "$base/ibmplexmono/IBMPlexMono-Medium.ttf"

python3 - << 'EOF'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
jobs = [
    ("fonts/Newsreader-var.ttf", {"wght":600, "opsz":40}, "fonts/Newsreader-600.ttf", "Newsreader Display SemiBold"),
    ("fonts/Newsreader-var.ttf", {"wght":500, "opsz":40}, "fonts/Newsreader-500.ttf", "Newsreader Display Medium"),
    ("fonts/Inter-var.ttf", {"wght":450, "opsz":16}, "fonts/Inter-450.ttf", "Inter Text"),
    ("fonts/Inter-var.ttf", {"wght":550, "opsz":16}, "fonts/Inter-550.ttf", "Inter Text Medium"),
]
for src, axes, out, fam in jobs:
    f = TTFont(src)
    avail = {a.axisTag: (a.minValue, a.maxValue) for a in f["fvar"].axes}
    pin = {k: max(min(v, avail[k][1]), avail[k][0]) for k, v in axes.items() if k in avail}
    instantiateVariableFont(f, pin, inplace=True)
    name = f["name"]
    for nid in (1, 16):
        name.setName(fam, nid, 3, 1, 0x409)
    for nid in (2, 17):
        name.setName("Regular", nid, 3, 1, 0x409)
    name.setName(fam, 4, 3, 1, 0x409)
    name.setName(fam.replace(" ", ""), 6, 3, 1, 0x409)
    f.save(out)
    print("pinned", out, pin)
EOF
# fontTools required: pip install fonttools (--break-system-packages if needed)
# renderer: npm install @resvg/resvg-js (local to this directory is fine)
echo "setup complete"
