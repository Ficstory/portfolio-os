from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
SOURCES = ROOT / "sources" / "original-docs"
FONT = Path(r"C:\Windows\Fonts\malgun.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\malgunbd.ttf")
SYMBOL_FONT = Path(r"C:\Windows\Fonts\seguisym.ttf")


SPECS = [
    {
        "filename": "p07-requirements-readable.png",
        "source": "2026-03-21_요구사항정의서_v2_AEKKIM.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\docs\2026-03-21_요구사항정의서_v2_AEKKIM.md",
        "page": "p07",
        "groups": [[[83, 83]], [[87, 87]], [[100, 100]], [[107, 107]]],
        "subtitle": "문서 버전: v2.6 · 기준 일자: 2026-03-29",
        "font_size": 48,
        "width": 1500,
        "max_height": 850,
        "limitation": "현행 요구사항 문서의 선택 발췌다. 문서의 구현 상태는 개인 기여나 라이브 서비스 동작의 증거가 아니다.",
    },
    {
        "filename": "p07-screen-spec-readable.png",
        "source": "2026-03-21_화면명세서_v2_AEKKIM.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\docs\2026-03-21_화면명세서_v2_AEKKIM.md",
        "page": "p07",
        "groups": [[[99, 99], [103, 103], [105, 105]], [[126, 126], [130, 130], [132, 132]]],
        "subtitle": "문서 버전: v2.6 · 기준 일자: 2026-03-29",
        "font_size": 48,
        "width": 1500,
        "max_height": 850,
        "limitation": "화면명세서의 선택 발췌다. 실제 실행 화면이나 개인별 완료 작업을 주장하지 않는다.",
    },
    {
        "filename": "p05-meeting-readable.png",
        "source": "260114_회의록.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\2. 공통pjt\S14P11E207\docs\이재호\회의록\260114_회의록.md",
        "page": "p05",
        "groups": [[[32, 45]]],
        "subtitle": "회의록 · 결정 사항",
        "font_size": 45,
        "width": 1700,
        "max_height": None,
        "limitation": "회의록의 결정 블록 발췌다. 개인별 역할이나 이후 구현 완료를 보여주지 않는다.",
    },
]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def flat_ranges(spec: dict) -> list[list[int]]:
    return [item for group in spec["groups"] for item in group]


def selected_lines(path: Path, groups: list[list[list[int]]]) -> list[tuple[str, bool]]:
    raw = path.read_text(encoding="utf-8").splitlines()
    result: list[tuple[str, bool]] = []
    for index, group in enumerate(groups):
        if index:
            result.append(("[중간 생략]", True))
        for start, end in group:
            result.extend((raw[number - 1], False) for number in range(start, end + 1))
    return result


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    if not text or draw.textlength(text, font=font) <= max_width:
        return [text]
    words = text.split(" ")
    rows: list[str] = []
    row = ""
    for word in words:
        proposal = word if not row else f"{row} {word}"
        if draw.textlength(proposal, font=font) <= max_width:
            row = proposal
        else:
            if row:
                rows.append(row)
            row = word
    if row:
        rows.append(row)
    return rows


def render(spec: dict) -> dict:
    source = SOURCES / spec["source"]
    regular = ImageFont.truetype(str(FONT), spec["font_size"])
    bold = ImageFont.truetype(str(FONT_BOLD), spec["font_size"])
    symbol = ImageFont.truetype(str(SYMBOL_FONT), spec["font_size"])
    header = ImageFont.truetype(str(FONT_BOLD), 28)
    subheader = ImageFont.truetype(str(FONT), 23)
    footer_font = ImageFont.truetype(str(FONT), 20)
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1), "white"))
    content_width = spec["width"] - 120
    rows: list[tuple[str, ImageFont.FreeTypeFont, str]] = []
    for text, omitted in selected_lines(source, spec["groups"]):
        font = bold if text.startswith(("#", "**", "✅")) else regular
        color = "#6D7480" if omitted else "#10213A"
        rows.extend((part, font, color) for part in wrap(probe, text, font, content_width))
    heights = [int(font.size * (1.36 if text else 0.7)) for text, font, _ in rows]
    content_height = sum(heights)
    # Header ends at y=102. A 60px minimum gap separates body from the footer divider.
    natural_height = 122 + content_height + 60 + 62
    height = max(natural_height, 850 if spec["max_height"] else 1050)
    if spec["max_height"] and height > spec["max_height"]:
        raise ValueError(f"{spec['filename']} would be {height}px, above its {spec['max_height']}px cap")
    image = Image.new("RGB", (spec["width"], height), "#FFFFFF")
    draw = ImageDraw.Draw(image)
    draw.text((60, 32), "원문 발췌 · Markdown 렌더", font=header, fill="#10213A")
    draw.text((60, 68), spec["subtitle"], font=subheader, fill="#546170")
    draw.line((60, 102, spec["width"] - 60, 102), fill="#C9CED6", width=2)
    y = 122
    for (text, font, color), row_height in zip(rows, heights):
        if text.startswith("✅"):
            draw.text((60, y), "✅", font=symbol, fill=color)
            x = 60 + draw.textlength("✅", font=symbol) + 10
            draw.text((x, y), text[1:].lstrip(), font=font, fill=color)
        else:
            draw.text((60, y), text, font=font, fill=color)
        y += row_height
    divider_y = height - 62
    if divider_y - y < 60:
        raise ValueError(f"{spec['filename']} body is too close to footer ({divider_y - y}px)")
    draw.line((60, divider_y, spec["width"] - 60, divider_y), fill="#C9CED6", width=1)
    ranges = ", ".join(f"{start}–{end}" for start, end in flat_ranges(spec))
    draw.text((60, height - 45), f"원문: {spec['source']} · 줄 {ranges}", font=footer_font, fill="#546170")
    output = ASSETS / spec["filename"]
    image.save(output, "PNG", optimize=True)
    return {
        "file": f"assets/{spec['filename']}",
        "page": spec["page"],
        "dimensions": list(image.size),
        "sha256": digest(output),
        "source_local_path": spec["source_original_path"],
        "copied_source_path": f"sources/original-docs/{spec['source']}",
        "source_sha256": digest(source),
        "source_line_ranges": flat_ranges(spec),
        "inserted_display_text": "[중간 생략]" if len(spec["groups"]) > 1 else None,
        "source_type": "original_markdown",
        "rendering": "Original text rendered from copied Markdown source with visual line wrapping only. No wording was changed.",
        "footer_clearance_px": divider_y - y,
        "limitations": spec["limitation"],
    }


def main() -> None:
    items = [render(spec) for spec in SPECS]
    data = {
        "collection": "Canva PM portfolio concise readable Markdown excerpt renders",
        "render_label": "원문 발췌 · Markdown 렌더",
        "handling": {
            "new_variants_only": True,
            "generated_ui": False,
            "source_body_text_verbatim": True,
            "omission_marker": "[중간 생략] appears only between declared noncontiguous source ranges."
        },
        "assets": items,
    }
    (ROOT / "document_assets_readable.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
