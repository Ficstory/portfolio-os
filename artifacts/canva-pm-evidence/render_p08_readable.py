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

SPECS = [
    {
        "filename": "p08-plan-readable.png",
        "source": "2026-03-28_FE_디자인리뷰_반영_우선순위_및_작업계획서.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\FE\docs\archive\planning-history\2026-03-28_FE_디자인리뷰_반영_우선순위_및_작업계획서.md",
        "groups": [[[166, 166], [168, 168]], [[175, 175], [177, 177]], [[181, 181]]],
        "title": "디자인리뷰 반영 우선순위 및 작업계획서",
        "limitation": "권장 실행 순서를 적은 계획 문서 발췌다. 계획된 항목이 완료되었음을 증명하지 않는다.",
    },
    {
        "filename": "p08-qa-readable.png",
        "source": "2026-03-24_MVP_테스트_개선사항_정리.md",
        "source_original_path": r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106\docs\2026-03-24_MVP_테스트_개선사항_정리.md",
        "groups": [[[26, 26], [30, 30]], [[35, 35]]],
        "title": "MVP 테스트 개선사항 정리 · 팀 QA",
        "limitation": "팀 QA 문서의 문제·해결 방안 발췌다. 이 기록을 이재호 개인의 완료 작업으로 귀속하지 않으며, 화면이 해결을 입증하지 않는다.",
    },
]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def ranges(spec: dict) -> list[list[int]]:
    return [item for group in spec["groups"] for item in group]


def rows(path: Path, groups: list[list[list[int]]]) -> list[tuple[str, bool]]:
    source = path.read_text(encoding="utf-8").splitlines()
    output: list[tuple[str, bool]] = []
    for index, group in enumerate(groups):
        if index:
            output.append(("[중간 생략]", True))
        for start, end in group:
            output.extend((source[n - 1], False) for n in range(start, end + 1))
    return output


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, width: int) -> list[str]:
    if not text or draw.textlength(text, font=font) <= width:
        return [text]
    words, result, current = text.split(" "), [], ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=font) <= width:
            current = candidate
        else:
            if current:
                result.append(current)
            current = word
    if current:
        result.append(current)
    return result


def render(spec: dict) -> dict:
    width, height, margin = 1100, 620, 40
    source = SOURCES / spec["source"]
    regular = ImageFont.truetype(str(FONT), 48)
    bold = ImageFont.truetype(str(FONT_BOLD), 48)
    title_font = ImageFont.truetype(str(FONT), 25)
    footer_font = ImageFont.truetype(str(FONT), 17)
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1), "white"))
    rendered: list[tuple[str, ImageFont.FreeTypeFont, str]] = []
    for text, omitted in rows(source, spec["groups"]):
        font = bold if text.startswith("#") else regular
        color = "#6D7480" if omitted else "#10213A"
        rendered.extend((line, font, color) for line in wrap(probe, text, font, width - margin * 2))
    line_height = 54
    needed = 72 + line_height * len(rendered) + 56
    if needed > height:
        raise ValueError(f"{spec['filename']} needs {needed}px; limit is {height}px")
    image = Image.new("RGB", (width, height), "#FFFFFF")
    draw = ImageDraw.Draw(image)
    draw.text((margin, 22), "원문 발췌 · Markdown 렌더", font=title_font, fill="#10213A")
    draw.text((margin, 49), spec["title"], font=title_font, fill="#546170")
    draw.line((margin, 82, width - margin, 82), fill="#C9CED6", width=1)
    y = 98
    for text, font, color in rendered:
        draw.text((margin, y), text, font=font, fill=color)
        y += line_height
    divider_y = height - 44
    if divider_y - y < 30:
        raise ValueError(f"{spec['filename']} body is too close to footer")
    draw.line((margin, divider_y, width - margin, divider_y), fill="#C9CED6", width=1)
    line_refs = ", ".join(f"{start}–{end}" for start, end in ranges(spec))
    draw.text((margin, height - 31), f"원문 줄 {line_refs}", font=footer_font, fill="#546170")
    target = ASSETS / spec["filename"]
    image.save(target, "PNG", optimize=True)
    return {
        "file": f"assets/{spec['filename']}",
        "dimensions": [width, height],
        "source_local_path": spec["source_original_path"],
        "copied_source_path": f"sources/original-docs/{spec['source']}",
        "source_sha256": sha(source),
        "source_line_ranges": ranges(spec),
        "inserted_display_text": "[중간 생략]",
        "sha256": sha(target),
        "source_type": "original_markdown",
        "rendering": "Original source text rendered with visual line wrapping only; no wording was changed.",
        "limitations": spec["limitation"],
    }


def main() -> None:
    data = {"collection": "Canva PM p08 concise readable Markdown renders", "assets": [render(spec) for spec in SPECS]}
    (ROOT / "p08_readable_assets.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
