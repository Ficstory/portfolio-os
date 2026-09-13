"""Capture the verified flow on the dedicated 1080x2340 demo emulator."""
from pathlib import Path
import subprocess
import time

ROOT = next(parent for parent in Path(__file__).resolve().parents if (parent / "package.json").is_file())
ADB = Path(r"C:\Users\ljh43\AppData\Local\Android\Sdk\platform-tools\adb.exe")
OUT = ROOT / ".codex_tmp/aekkim-demo-output"
SHOTS = ROOT / "docs/pm-redesign/aekkim-demo/screenshots"
OUT.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)
BASE = [str(ADB), "-s", "emulator-5560"]

def adb(*args):
    return subprocess.run([*BASE, *map(str, args)], check=True, capture_output=True)

def shot(name):
    (SHOTS / f"{name}.png").write_bytes(adb("exec-out", "screencap", "-p").stdout)
    print(f"Captured {name}", flush=True)

def tap(x, y):
    adb("shell", "input", "tap", x, y)

assert "AekkimDemo" in adb("emu", "avd", "name").stdout.decode(), "Use the dedicated AekkimDemo emulator."
adb("shell", "uiautomator", "dump", "/sdcard/aekkim-start.xml")
initial = adb("shell", "cat", "/sdcard/aekkim-start.xml").stdout.decode("utf-8")
assert 'package="com.ssafy.e106.demo"' in initial and "54,400" in initial, "Start the demo on its initial dashboard before recording."
adb("shell", "settings", "put", "system", "show_touches", "1")
record = subprocess.Popen([*BASE, "shell", "screenrecord", "--time-limit", "28", "--bit-rate", "6000000", "/sdcard/aekkim-demo-recording.mp4"])
started = time.monotonic()

def at(second, action):
    time.sleep(max(0, started + second - time.monotonic()))
    action()

at(1, lambda: shot("01-dashboard-before"))
at(3, lambda: tap(540, 780))
at(5, lambda: tap(960, 440))
at(6, lambda: shot("02-review-payment"))
at(8, lambda: tap(215, 770))
at(10.5, lambda: shot("03-select-service"))
at(12, lambda: tap(875, 1730))
at(13.5, lambda: shot("04-review-resolved"))
at(15, lambda: tap(85, 197))
at(17, lambda: shot("05-dashboard-after"))
at(19, lambda: tap(540, 1650))
at(21, lambda: shot("06-subscription-detail"))
at(24, lambda: tap(540, 800))
record.wait(timeout=20)
if record.returncode:
    raise RuntimeError(f"screenrecord failed: {record.returncode}")
adb("pull", "/sdcard/aekkim-demo-recording.mp4", OUT / "aekkim-demo-original.mp4")
adb("shell", "settings", "put", "system", "show_touches", "0")
print(f"Recording saved to {OUT}", flush=True)
