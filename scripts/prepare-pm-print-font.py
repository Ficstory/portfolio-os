"""Subset the existing licensed font to the PM print deck's authored characters.

Run with fonttools and brotli available (or in .codex_tmp/ax-font-tools).
Re-run after editing PM print copy. Other pages keep the original full font.
"""
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / '.codex_tmp/ax-font-tools'))
from fontTools import subset
from fontTools.ttLib import TTFont

source = root / 'public/pm/fonts/PretendardVariable.woff2'
destination = root / 'public/pm/fonts'
destination.mkdir(parents=True, exist_ok=True)
text = ''.join(chr(c) for c in range(32, 127))
text += ''.join(p.read_text(encoding='utf-8') for p in (root / 'src/components/pm-improved').rglob('*') if p.suffix in ('.ts', '.tsx'))
for name in ('profile.ts', 'links.ts'):
    text += (root / 'src/data' / name).read_text(encoding='utf-8')
font = TTFont(source)
options = subset.Options()
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
# The source's OFL reserves its primary name. Rename the derivative's names.
for record in font['name'].names:
    if record.nameID in (1, 3, 4, 6, 16, 21, 25):
        name = 'PmPrintSans' if record.nameID in (3, 6, 25) else 'Pm Print Sans'
        record.string = name.encode(record.getEncoding())
font.flavor = 'woff2'
target = destination / 'PmPrintSans.woff2'
font.save(target)
# Existing OFL license remains beside the original and subset fonts.
print(f'{source.stat().st_size} -> {target.stat().st_size} bytes; {len(set(text))} source characters')
