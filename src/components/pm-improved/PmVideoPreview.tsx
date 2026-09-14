"use client";

import Image from "next/image";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useId, useRef, useState } from "react";

import styles from "./pm.module.css";

type Props = {
  name: string;
  file: "aekkim" | "busan" | "smile" | "play-pick";
  description: string;
  width: number;
  height: number;
  wide?: boolean;
};

export function PmVideoPreview({
  name,
  file,
  description,
  width,
  height,
  wide = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const descriptionId = useId();
  const src = `/pm/previews/${file}.mp4`;
  const poster = `/pm/previews/${file}.webp`;

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || failed) return;

    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div
      className={`${styles.videoPreview} ${
        wide ? styles.widePreview : styles.phonePreview
      }`}
    >
      <div
        className={styles.previewScreen}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {failed ? (
          <Image
            src={poster}
            alt={description}
            width={width}
            height={height}
            sizes={wide ? "(max-width: 767px) 90vw, 760px" : "240px"}
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            width={width}
            height={height}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`${name} 화면 미리보기`}
            aria-describedby={descriptionId}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        )}
      </div>
      <div className={styles.previewControls}>
        <button
          type="button"
          disabled={failed}
          onClick={() => void togglePlayback()}
          aria-label={`${name} 미리보기 ${playing ? "일시정지" : "재생"}`}
        >
          {playing ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
          {failed ? "영상 로드 실패" : playing ? "일시정지" : "재생"}
        </button>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          aria-label={`${name} 미리보기 크게 보기 (새 창)`}
        >
          크게 보기
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <p id={descriptionId} className={styles.visuallyHidden}>
        {description} 재생 버튼을 누르면 소리 없이 반복 재생됩니다.
      </p>
    </div>
  );
}
