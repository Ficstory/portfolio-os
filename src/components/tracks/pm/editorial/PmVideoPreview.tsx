"use client";

import Image from "next/image";
import { Pause, Play, ArrowUpRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./pm.module.css";

type Props = {
  name: string;
  file: "aekkim" | "busan" | "smile" | "play-pick";
  description: string;
  width: number;
  height: number;
  wide?: boolean;
};

export function PmVideoPreview({ name, file, description, width, height, wide = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const descriptionId = useId();
  const src = `/pm/previews/${file}.mp4`;
  const poster = `/pm/previews/${file}.webp`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = false;
    let preference: "auto" | "play" | "pause" = "auto";
    let disposed = false;
    const shouldPlay = () => visible && !document.hidden &&
      (preference === "play" || (preference === "auto" && !motion.matches && !connection?.saveData));
    const sync = () => {
      if (!shouldPlay()) { video.pause(); return; }
      void video.play().then(() => {
        // A play request can finish after the user pauses or leaves the viewport.
        if (disposed || !shouldPlay()) video.pause();
      }).catch(() => { /* The play button remains available if autoplay is blocked. */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    const onMotionChange = () => { preference = "auto"; sync(); };
    toggleRef.current = () => {
      preference = video.paused ? "play" : "pause";
      sync();
    };
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", onMotionChange);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", onMotionChange);
      toggleRef.current = () => {};
      video.pause();
    };
  }, [src, failed]);

  return <div className={`${styles.videoPreview} ${wide ? styles.widePreview : styles.phonePreview}`}>
    <div className={styles.previewScreen} style={{ aspectRatio: `${width} / ${height}` }}>
      {failed ? <Image src={poster} alt={description} width={width} height={height} sizes={wide ? "(max-width: 767px) 90vw, 760px" : "240px"} /> :
        <video ref={videoRef} src={src} poster={poster} width={width} height={height} muted loop playsInline preload="none"
          aria-label={`${name} 화면 미리보기`} aria-describedby={descriptionId}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => { setFailed(true); setPlaying(false); }} />}
    </div>
    <div className={styles.previewControls}>
      <button type="button" disabled={failed} onClick={() => toggleRef.current()} aria-label={`${name} 미리보기 ${playing ? "일시정지" : "재생"}`}>
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        {failed ? "영상 로드 실패" : playing ? "일시정지" : "재생"}
      </button>
      <a href={src} target="_blank" rel="noreferrer" aria-label={`${name} 미리보기 크게 보기 (새 창)`}>크게 보기<ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
    <p id={descriptionId} className={styles.visuallyHidden}>{description} 소리 없이 반복 재생됩니다.</p>
  </div>;
}
