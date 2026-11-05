from __future__ import annotations

import hashlib
import json
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "sources" / "busan-marker-log-verbatim.txt"
OUTPUT = ROOT / "assets" / "busan9-marker-change-readable.png"
METADATA = ROOT / "sources" / "busan-marker-readable-derivation.json"
FONT = Path(r"C:\Windows\Fonts\malgun.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\malgunbd.ttf")


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    commit, date, author, subject = lines
    title = subject.split(": ", 1)[1]
    width, height, margin = 1000, 500, 44
    body = ImageFont.truetype(str(FONT_BOLD), 50)
    header = ImageFont.truetype(str(FONT), 22)
    meta = ImageFont.truetype(str(FONT), 24)
    footer = ImageFont.truetype(str(FONT), 18)
    image = Image.new("RGB", (width, height), "#FFFFFF")
    draw = ImageDraw.Draw(image)
    draw.text((margin, 26), "원문 발췌 · 원본 Git 텍스트 읽기용 렌더 · crop 아님", font=header, fill="#10213A")
    draw.text((margin, 60), f"{commit[:7]} · {date} · {author}", font=meta, fill="#546170")
    draw.line((margin, 98, width - margin, 98), fill="#C9CED6", width=1)
    words, rows, row = title.split(" "), [], ""
    for word in words:
        candidate = word if not row else f"{row} {word}"
        if draw.textlength(candidate, font=body) <= width - margin * 2:
            row = candidate
        else:
            rows.append(row)
            row = word
    rows.append(row)
    y = 136
    for row in rows:
        draw.text((margin, y), row, font=body, fill="#10213A")
        y += 68
    divider_y = height - 55
    if divider_y - y < 55:
        raise ValueError("Body is too close to footer")
    draw.line((margin, divider_y, width - margin, divider_y), fill="#C9CED6", width=1)
    draw.text((margin, height - 36), "원문: Git commit log subject · 태그/이슈 번호 표시는 생략", font=footer, fill="#546170")
    image.save(OUTPUT, "PNG", optimize=True)
    METADATA.write_text(json.dumps({
        "file": "assets/busan9-marker-change-readable.png",
        "dimensions": [width, height],
        "sha256": sha(OUTPUT),
        "source": "sources/busan-marker-log-verbatim.txt",
        "source_sha256": sha(SOURCE),
        "source_type": "original_git_text",
        "method": "Original commit subject rendered as readable text; the Fix tag and issue number are intentionally omitted from the displayed title only.",
        "displayed_verbatim_title": title,
        "displayed_metadata": {"commit": commit[:7], "date": date, "author": author},
        "crop": False,
        "proof_scope": "Shows the original Git commit subject and author/date metadata.",
        "limitations": "A commit-log render does not demonstrate runtime map behavior, user testing, or production deployment."
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
