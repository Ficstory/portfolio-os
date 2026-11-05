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


DOCUMENTS = [
    {
        "filename": "p05-meeting-decisions-markdown.png",
        "source": "260114_회의록.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\2. 공통pjt\S14P11E207\docs\이재호\회의록\260114_회의록.md",
        "page": "p05",
        "ranges": [[32, 45]],
        "subtitle": "회의록 · 결정 사항",
        "font_size": 42,
        "canvas_width": 1700,
        "min_height": 950,
        "limitation": "회의록의 결정 블록 발췌다. 개인별 역할이나 이후 구현 완료를 보여주지 않는다.",
    },
    {
        "filename": "p07-requirements-fr03-fr05-markdown.png",
        "source": "2026-03-21_요구사항정의서_v2_AEKKIM.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\docs\2026-03-21_요구사항정의서_v2_AEKKIM.md",
        "page": "p07",
        "ranges": [[83, 89], [100, 110]],
        "subtitle": "문서 버전: v2.6 · 기준 일자: 2026-03-29",
        "font_size": 34,
        "canvas_width": 1700,
        "min_height": 1050,
        "limitation": "현행 요구사항 문서 발췌다. 문서의 구현 상태 표기는 개인 기여나 라이브 서비스 동작의 증거가 아니다.",
    },
    {
        "filename": "p07-screen-spec-manual-mapping-markdown.png",
        "source": "2026-03-21_화면명세서_v2_AEKKIM.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\docs\2026-03-21_화면명세서_v2_AEKKIM.md",
        "page": "p07",
        "ranges": [[99, 106], [126, 133]],
        "subtitle": "문서 버전: v2.6 · 기준 일자: 2026-03-29",
        "font_size": 34,
        "canvas_width": 1700,
        "min_height": 1080,
        "limitation": "화면명세서의 화면 목적·요소·액션 발췌다. 실제 실행 화면이나 개인별 완료 작업을 주장하지 않는다.",
    },
    {
        "filename": "p08-design-review-execution-order-markdown.png",
        "source": "2026-03-28_FE_디자인리뷰_반영_우선순위_및_작업계획서.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\FE\docs\archive\planning-history\2026-03-28_FE_디자인리뷰_반영_우선순위_및_작업계획서.md",
        "page": "p08",
        "ranges": [[164, 173]],
        "subtitle": "디자인리뷰 반영 우선순위 및 작업계획서",
        "font_size": 40,
        "canvas_width": 1600,
        "min_height": 830,
        "limitation": "권장 실행 순서를 적은 계획 문서 발췌다. 계획된 항목이 완료되었음을 증명하지 않는다.",
    },
    {
        "filename": "p08-mvp-test-yearly-monthly-copy-markdown.png",
        "source": "2026-03-24_MVP_테스트_개선사항_정리.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\docs\2026-03-24_MVP_테스트_개선사항_정리.md",
        "page": "p08",
        "ranges": [[26, 35]],
        "subtitle": "MVP 테스트 개선사항 정리 · 팀 QA",
        "font_size": 40,
        "canvas_width": 1600,
        "min_height": 850,
        "limitation": "팀 QA 문서의 문제·해결 방안 발췌다. 이 기록을 이재호 개인의 완료 작업으로 귀속하지 않는다.",
    },
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_lines(path: Path, ranges: list[list[int]]) -> list[tuple[str, bool]]:
    lines = path.read_text(encoding="utf-8").splitlines()
    result: list[tuple[str, bool]] = []
    for i, (start, end) in enumerate(ranges):
        if i:
            result.append(("[중간 생략]", True))
        result.extend((lines[index - 1], False) for index in range(start, end + 1))
    return result


def split_to_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, width: int) -> list[str]:
    if not text:
        return [""]
    if draw.textlength(text, font=font) <= width:
        return [text]
    words = text.split(" ")
    rows: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=font) <= width:
            current = candidate
            continue
        if current:
            rows.append(current)
            current = word
        while draw.textlength(current, font=font) > width:
            cut = len(current)
            while cut > 1 and draw.textlength(current[:cut], font=font) > width:
                cut -= 1
            rows.append(current[:cut])
            current = current[cut:]
    if current:
        rows.append(current)
    return rows


def is_heading(text: str) -> bool:
    return text.startswith("#") or text.startswith("**") or text.startswith("✅")


def render(spec: dict) -> dict:
    source_path = SOURCES / spec["source"]
    probe = Image.new("RGB", (1, 1), "white")
    probe_draw = ImageDraw.Draw(probe)
    regular = ImageFont.truetype(str(FONT), spec["font_size"])
    heading = ImageFont.truetype(str(FONT_BOLD), spec["font_size"])
    symbol = ImageFont.truetype(str(SYMBOL_FONT), spec["font_size"])
    header_font = ImageFont.truetype(str(FONT_BOLD), 28)
    subtitle_font = ImageFont.truetype(str(FONT), 23)
    footer_font = ImageFont.truetype(str(FONT), 20)
    content_width = spec["canvas_width"] - 120
    rendered: list[tuple[str, ImageFont.FreeTypeFont, str]] = []
    for text, omission in source_lines(source_path, spec["ranges"]):
        font = heading if is_heading(text) else regular
        color = "#6D7480" if omission else "#10213A"
        for row in split_to_width(probe_draw, text, font, content_width):
            rendered.append((row, font, color))
    line_heights = [int(font.size * 1.45) if text else int(spec["font_size"] * 0.7) for text, font, _ in rendered]
    content_height = sum(line_heights)
    height = max(spec["min_height"], 92 + content_height + 84)
    image = Image.new("RGB", (spec["canvas_width"], height), "#FFFFFF")
    draw = ImageDraw.Draw(image)
    draw.text((60, 32), "원문 발췌 · Markdown 렌더", font=header_font, fill="#10213A")
    draw.text((60, 68), spec["subtitle"], font=subtitle_font, fill="#546170")
    draw.line((60, 102, spec["canvas_width"] - 60, 102), fill="#C9CED6", width=2)
    y = 126
    for (text, font, color), line_height in zip(rendered, line_heights):
        if text.startswith("✅"):
            draw.text((60, y), "✅", font=symbol, fill=color)
            marker_width = draw.textlength("✅", font=symbol)
            draw.text((60 + marker_width + 10, y), text[1:].lstrip(), font=font, fill=color)
        else:
            draw.text((60, y), text, font=font, fill=color)
        y += line_height
    footer = f"원문: {spec['source']} · 줄 {', '.join(f'{a}–{b}' for a, b in spec['ranges'])}"
    draw.line((60, height - 62, spec["canvas_width"] - 60, height - 62), fill="#C9CED6", width=1)
    draw.text((60, height - 45), footer, font=footer_font, fill="#546170")
    output = ASSETS / spec["filename"]
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "PNG", optimize=True)
    return {
        "file": f"assets/{spec['filename']}",
        "page": spec["page"],
        "dimensions": list(image.size),
        "sha256": sha256(output),
        "source_local_path": spec["source_original_path"],
        "copied_source_path": f"sources/original-docs/{spec['source']}",
        "source_sha256": sha256(source_path),
        "source_line_ranges": spec["ranges"],
        "inserted_display_text": "[중간 생략]" if len(spec["ranges"]) > 1 else None,
        "source_type": "original_markdown",
        "rendering": "Original text rendered from copied Markdown source with Markdown headings/bullets and automatic visual wrapping. No wording was changed.",
        "limitations": spec["limitation"],
    }


def main() -> None:
    if not FONT.exists() or not FONT_BOLD.exists():
        raise FileNotFoundError("Malgun Gothic font files are required for this renderer.")
    assets = [render(spec) for spec in DOCUMENTS]
    metadata = {
        "collection": "Canva PM portfolio verbatim Markdown excerpt renders",
        "render_label": "원문 발췌 · Markdown 렌더",
        "handling": {
            "source_copies_preserved": True,
            "generated_ui": False,
            "editor_or_app_screenshots": False,
            "body_text_policy": "Source body text is verbatim. [중간 생략] appears only between noncontiguous declared source ranges."
        },
        "assets": assets,
    }
    (ROOT / "document_assets.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
