"""Make the browser-exported AX PDF portable and check the final artifact.

Usage: python scripts/finalize-ax-pdf.py <pdf>
Requires the bundled pypdf and pdfplumber packages. Does not access the network.
"""
import json
import logging
import sys
from pathlib import Path
from urllib.parse import urlparse

import pdfplumber
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, NameObject, RectangleObject, TextStringObject

path = Path(sys.argv[1]).resolve()
logging.basicConfig(filename=path.with_suffix('.parser-warnings.log'), filemode='w', level=logging.WARNING, force=True)
reader = PdfReader(path)
writer = PdfWriter(clone_from=reader)
removed, rewritten = 0, 0
# Chromium rounds CSS millimetres to its PDF pixel grid. Restore the PM print
# sheet's exact 320 × 180 mm box without scaling or distorting its contents.
target_width, target_height = 320 / 25.4 * 72, 180 / 25.4 * 72
exported_boxes = []
for page in writer.pages:
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    exported_boxes.append([width, height])
    assert abs(width - target_width) < 1.1 and abs(height - target_height) < 1.1, 'Unexpected export page size'
    page.mediabox = RectangleObject([0, 0, target_width, target_height])
    page.cropbox = RectangleObject([0, 0, target_width, target_height])
    annotations = ArrayObject()
    for ref in page.get('/Annots', []):
        annotation = ref.get_object()
        action = annotation.get('/A', {})
        uri = str(action.get('/URI', ''))
        parsed = urlparse(uri)
        if parsed.hostname in ('127.0.0.1', 'localhost'):
            # Only existing published /pm assets have a valid public destination.
            if parsed.path.startswith(('/pm/', '/pm-improved/')):
                action[NameObject('/URI')] = TextStringObject('https://ficstory.dev' + parsed.path)
                rewritten += 1
            else:
                # The new /ax route is local-only. Keep embedded content, remove dead links.
                removed += 1
                continue
        annotations.append(ref)
    if '/Annots' in page:
        page[NameObject('/Annots')] = annotations
writer.add_metadata({'/Title': '이재호 | LOTTE AX Challenge 2026 포트폴리오', '/Author': '이재호'})
temporary = path.with_suffix('.finalizing.pdf')
with temporary.open('wb') as stream:
    writer.write(stream)
temporary.replace(path)

final = PdfReader(path)
expected_pages = 14
assert len(final.pages) == expected_pages, f'Expected {expected_pages} pages, got {len(final.pages)}'
for i, page in enumerate(final.pages, 1):
    ratio = float(page.mediabox.width) / float(page.mediabox.height)
    assert abs(ratio - 16 / 9) < 0.0001, f'Page {i} must be 16:9, got {ratio}'
texts = [p.extract_text() for p in final.pages]
assert all(len(t) > 150 for t in texts), 'Blank or missing-text page'
assert all(f'{i:02d}/{expected_pages:02d}' in t.replace(' ', '') for i, t in enumerate(texts, 1)), 'Page numbering mismatch'
assert not any('\ufffd' in t or any(0xE000 <= ord(c) <= 0xF8FF for c in t) for t in texts), 'Unmapped text glyph'
assert path.stat().st_size < 100_000_000, 'Exceeds historical 100 MB guidance'
links = []
for page in final.pages:
    for ref in page.get('/Annots', []):
        uri = str(ref.get_object().get('/A', {}).get('/URI', ''))
        if uri:
            assert urlparse(uri).hostname not in ('127.0.0.1', 'localhost'), uri
            links.append(uri)
outside = []
with pdfplumber.open(path) as document:
    for i, page in enumerate(document.pages, 1):
        for char in page.chars:
            if char['text'].strip() and (char['x0'] < -1 or char['x1'] > page.width + 1 or char['top'] < -1 or char['bottom'] > page.height + 1):
                outside.append({'page': i, 'text': char['text']})
assert not outside, f'Text outside page: {outside[:10]}'
report = {
    'pdf': path.name, 'pages': len(final.pages), 'bytes': path.stat().st_size,
    'page_mm': [round(float(final.pages[0].mediabox.width) / 72 * 25.4, 1), round(float(final.pages[0].mediabox.height) / 72 * 25.4, 1)],
    'local_links_removed': removed, 'public_links_rewritten': rewritten,
    'unique_external_links': sorted(set(links)), 'page_text_lengths': [len(t) for t in texts],
    'text_outside_page': outside, 'aspect_ratio': '16:9 (all pages checked)', 'requires_visual_review': True,
    'chromium_export_boxes_pt': exported_boxes, 'box_normalization': 'Exact 320 × 180 mm; content not scaled',
}
path.with_suffix('.qa.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
copy = '\n\n'.join(f'[{i:02d} / {expected_pages}]\n{t}' for i, t in enumerate(texts, 1))
path.with_suffix('.txt').write_text(copy, encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
