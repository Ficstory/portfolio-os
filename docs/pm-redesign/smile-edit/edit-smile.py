from pathlib import Path
import subprocess
import sys
import json

ROOT = next(p for p in Path(__file__).resolve().parents if (p / "package.json").is_file())
sys.path.insert(0, str(ROOT / ".codex_tmp/media-tools"))
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
SOURCE = Path(r"C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\2. 공통pjt\캡처\초대배틀.mp4")
OUT = ROOT / ".codex_tmp/smile-edit"
OUT.mkdir(parents=True, exist_ok=True)
count_filter = "trim=start=13.30:end=17.45,setpts=PTS-STARTPTS,fps=24"

# Locate the white pointer in the otherwise dark area below/right of the title.
# Work on decoded video frames; preserve the original title and its animation.
roi_w, roi_h, roi_x, roi_y = 104, 160, 736, 392
raw = subprocess.run([FF,"-v","error","-i",str(SOURCE),"-vf",f"{count_filter},crop={roi_w}:{roi_h}:{roi_x}:{roi_y}","-f","rawvideo","-pix_fmt","rgb24","-"],check=True,capture_output=True).stdout
frame_bytes = roi_w * roi_h * 3
cleanup = []
boxes = []
for frame in range(len(raw) // frame_bytes):
    data = raw[frame*frame_bytes:(frame+1)*frame_bytes]
    hits = []
    for pixel in range(roi_w * roi_h):
        r,g,b = data[pixel*3:pixel*3+3]
        if min(r,g,b) > 155 and max(r,g,b)-min(r,g,b) < 30:
            hits.append((pixel % roi_w + roi_x, pixel // roi_w + roi_y))
    if not hits or min(y for _,y in hits) >= 530:
        continue
    assert len(hits) < 400, "Unexpected bright content in the pointer region."
    x = min(x for x,_ in hits)-8
    y = min(y for _,y in hits)-8
    w = max(px for px,_ in hits)-x+9
    h = max(py for _,py in hits)-y+9
    cleanup.append(f"delogo=x={x}:y={y}:w={w}:h={h}:show=0:enable='eq(n,{frame})'")
    boxes.append(dict(frame=frame,x=x,y=y,w=w,h=h))

filters = (
    "[0:v]split=2[room][start];"
    "[room]trim=start=8.9:end=11.45,setpts=PTS-STARTPTS,crop=664:510:304:130,pad=720:540:28:15:black,scale=960:720:flags=lanczos,setsar=1,fps=24[ready];"
    f"[start]{count_filter}," + ",".join(cleanup) +
    ",crop=480:360:400:170,scale=960:720:flags=lanczos,setsar=1,select='between(n,6,13)+between(n,30,37)+between(n,54,61)+gte(n,80)',setpts='if(lt(N,24),2*N,N+24)/(24*TB)',fps=24[count];"
    "[ready][count]concat=n=2:v=1:a=0,fade=t=in:st=0:d=0.15,fade=t=out:st=5.05:d=0.25[out]"
)
(OUT/"edit-filter.txt").write_text(filters,encoding="utf-8")
(OUT/"cursor-cleanup.json").write_text(json.dumps(boxes,indent=2),encoding="utf-8")
subprocess.run([FF,"-v","error","-y","-i",str(SOURCE),"-filter_complex",filters,"-map","[out]","-an","-map_metadata","-1","-c:v","libx264","-preset","medium","-crf","21","-pix_fmt","yuv420p","-movflags","+faststart",str(OUT/"smile-clean.mp4")],check=True)
subprocess.run([FF,"-v","error","-y","-i",str(OUT/"smile-clean.mp4"),"-vf","fps=2,scale=320:240,tile=4x4","-frames:v","1",str(OUT/"clean-overview.png")],check=True)
subprocess.run([FF,"-v","error","-y","-ss","1.45","-i",str(OUT/"smile-clean.mp4"),"-frames:v","1","-c:v","libwebp","-quality","90",str(OUT/"smile-clean.webp")],check=True)
print(json.dumps({"cleanedPointerFrames":len(boxes),"videoBytes":(OUT/"smile-clean.mp4").stat().st_size,"posterBytes":(OUT/"smile-clean.webp").stat().st_size}),flush=True)
