"""Verify the complete PDFs and render every page for visual review.

Usage: python scripts/check-pm-print-pdf.py [output/pdf]
Requires pypdf, Pillow, and Poppler (pdftoppm).
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader

output = Path(sys.argv[1] if len(sys.argv) > 1 else "output/pdf")
qa = output / "qa"
qa.mkdir(parents=True, exist_ok=True)
report = {"pdfs": [], "identical_text": False, "identical_renderings": False}
texts = []
pixels = []
for filename, prefix in [
    ("lee-jaeho-pm-portfolio.pdf", "main"),
    ("lee-jaeho-pm-portfolio-preview.pdf", "preview"),
]:
    pdf = output / filename
    reader = PdfReader(pdf)
    assert len(reader.pages) == 13, f"{filename}: actual page count {len(reader.pages)} != 13"
    pages = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text()
        assert len(text.strip()) > 100, f"{filename}: blank/sparse page {index}"
        assert "\ufffd" not in text, f"{filename}: replacement glyph on page {index}"
        assert abs(float(page.mediabox.width) - 320 / 25.4 * 72) < 1
        assert abs(float(page.mediabox.height) - 180 / 25.4 * 72) < 1
        for unwanted in ["본문으로 건너뛰기", "머리글과 바닥글 해제", "PDF 저장·인쇄", "프로젝트 상세 보기"]:
            assert unwanted not in text, f"{filename}: unwanted UI on page {index}: {unwanted}"
        pages.append({"page": index, "width_pt": float(page.mediabox.width), "height_pt": float(page.mediabox.height), "text": text})
    normalized = [re.sub(r"\s+", "", page["text"]) for page in pages]
    assert all(token in "".join(normalized) for token in ["이재호", "168", "함세상", "PlayPick", "dlwo4367@gmail.com"])
    texts.append(normalized)
    subprocess.run(["pdftoppm", "-r", "120", "-png", str(pdf), str(qa / prefix)], check=True)
    rendered = sorted(qa.glob(f"{prefix}-*.png"))
    assert len(rendered) == 13, f"expected 13 rendered pages for {filename}"
    hashes = []
    for image_path in rendered:
        with Image.open(image_path) as image:
            hashes.append(hashlib.sha256(image.tobytes()).hexdigest())
    pixels.append(hashes)
    report["pdfs"].append({"file": str(pdf), "page_count": len(pages), "pages": pages, "rendered_pages": [str(item) for item in rendered]})
    if prefix == "main":
        for start in range(0, 13, 4):
            subset = rendered[start:start + 4]
            sheet = Image.new("RGB", (1600, ((len(subset) + 1) // 2) * 482), "#dededb")
            draw = ImageDraw.Draw(sheet)
            for position, image_path in enumerate(subset):
                with Image.open(image_path) as image:
                    image.thumbnail((780, 439))
                    x, y = (position % 2) * 800 + 10, (position // 2) * 482 + 30
                    sheet.paste(image, (x, y))
                    draw.text((x, y - 22), f"PAGE {start + position + 1:02d}", fill="#171717")
            sheet.save(qa / f"overview-{start+1:02d}-{start+len(subset):02d}.png")
report["identical_text"] = texts[0] == texts[1]
report["identical_renderings"] = pixels[0] == pixels[1]
assert report["identical_text"], "main and preview PDF page text differs"
assert report["identical_renderings"], "main and preview PDF page renderings differ"
(qa / "pdf-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print("PASS: two complete 13-page PDFs; 320 x 180 mm; searchable Korean text; identical text and rendered pixels; all 26 pages rendered.")
