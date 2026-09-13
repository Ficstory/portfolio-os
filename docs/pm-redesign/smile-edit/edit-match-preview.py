"""Create the published preview from one original random-match recording."""

import argparse
import hashlib
import json
import subprocess
from pathlib import Path


CUTS = [
    (11.5, 23.0, "Matched players, READY, countdown, first attack"),
    (35.0, 41.5, "Opponent laughs, detection value, attack-success message"),
    (51.5, 71.0, "Defense failure, next attack, final 2–1 victory/defeat"),
]
POSTER_TIME = 37.6
TRANSFORM = "crop=1120:630:80:70,scale=1280:720:flags=lanczos,setsar=1"
SOURCE_SHA256 = "1d0bc67664a7725d46aed4a76fa1721de6d5a2895429bb0e8af779670b7e3ce4"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--ffmpeg", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    args = parser.parse_args()
    if sha256(args.source) != SOURCE_SHA256:
        raise SystemExit("Source hash differs from the reviewed original recording.")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    video = args.output_dir / "smile.mp4"
    poster = args.output_dir / "smile.webp"
    filters = ["[0:v]split=3[s0][s1][s2]"]
    for i, (start, end, _) in enumerate(CUTS):
        filters.append(
            f"[s{i}]trim=start={start}:end={end},setpts=PTS-STARTPTS,"
            f"fps=24,{TRANSFORM}[v{i}]"
        )
    filters.append("[v0][v1][v2]concat=n=3:v=1:a=0[out]")
    subprocess.run([
        str(args.ffmpeg), "-v", "error", "-y", "-i", str(args.source),
        "-filter_complex", ";".join(filters), "-map", "[out]", "-an",
        "-c:v", "libx264", "-preset", "slow", "-crf", "22",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(video),
    ], check=True)
    subprocess.run([
        str(args.ffmpeg), "-v", "error", "-y", "-ss", str(POSTER_TIME),
        "-i", str(args.source), "-vf", TRANSFORM, "-frames:v", "1",
        "-c:v", "libwebp", "-quality", "85", str(poster),
    ], check=True)
    subprocess.run([
        str(args.ffmpeg), "-v", "error", "-i", str(video), "-f", "null", "-",
    ], check=True)
    manifest = {
        "source": str(args.source),
        "source_sha256": SOURCE_SHA256,
        "cuts_seconds": [{"start": start, "end": end, "content": content}
                         for start, end, content in CUTS],
        "duration_seconds": sum(end - start for start, end, _ in CUTS),
        "poster_source_seconds": POSTER_TIME,
        "transform": TRANSFORM,
        "fps": 24,
        "audio": False,
        "speed": 1,
        "files": {p.name: {"bytes": p.stat().st_size, "sha256": sha256(p)}
                  for p in (video, poster)},
    }
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created and decoded {video.name}: {manifest['duration_seconds']} seconds, {video.stat().st_size} bytes.")


if __name__ == "__main__":
    main()
