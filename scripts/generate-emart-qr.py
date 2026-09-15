"""Generate demo QR PNGs with existing ReportLab and Pillow; no app dependency."""
from pathlib import Path
from PIL import Image, ImageDraw
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel

target = Path(__file__).resolve().parents[1] / "public/event/emart"
target.mkdir(parents=True, exist_ok=True)
for filename, url in {
    "qr-default.png": "https://ficstory.dev/event/emart/",
    "qr-zh.png": "https://ficstory.dev/event/emart/?lang=zh",
}.items():
    code = QRCode(None, QRErrorCorrectLevel.M)
    code.addData(url)
    code.make()
    count = code.getModuleCount()
    scale, border = 16, 4
    image = Image.new("RGB", ((count + border * 2) * scale,) * 2, "white")
    draw = ImageDraw.Draw(image)
    for row in range(count):
        for col in range(count):
            if code.isDark(row, col):
                x, y = (col + border) * scale, (row + border) * scale
                draw.rectangle((x, y, x + scale - 1, y + scale - 1), fill="black")
    image.save(target / filename)
    print(f"{filename}: {url} ({image.width}x{image.height})")
