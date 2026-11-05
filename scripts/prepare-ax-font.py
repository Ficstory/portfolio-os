"""Subset the existing licensed font to the AX page's authored characters.

Run with fonttools and brotli available (or in .codex_tmp/ax-font-tools).
Re-run after editing AX copy. Other pages keep the original full font.
"""
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / '.codex_tmp/ax-font-tools'))
from fontTools import subset
from fontTools.ttLib import TTFont

source = root / 'public/pm/fonts/PretendardVariable.woff2'
destination = root / 'public/ax/fonts'
destination.mkdir(parents=True, exist_ok=True)
text = ''.join(chr(c) for c in range(32, 127))
text += ''.join(p.read_text(encoding='utf-8') for p in (root / 'src/components/ax').rglob('*') if p.suffix in ('.ts', '.tsx'))
for name in ('PmVisuals.tsx', 'PmVideoPreview.tsx', 'content.ts'):
    text += (root / 'src/components/tracks/pm/editorial' / name).read_text(encoding='utf-8')
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
        name = 'AXPortfolioSans' if record.nameID in (3, 6, 25) else 'AX Portfolio Sans'
        record.string = name.encode(record.getEncoding())
font.flavor = 'woff2'
target = destination / 'AxPortfolioSans.woff2'
font.save(target)
shutil.copyfile(source.with_name('LICENSE.txt'), destination / 'LICENSE.txt')
print(f'{source.stat().st_size} -> {target.stat().st_size} bytes; {len(set(text))} source characters')
