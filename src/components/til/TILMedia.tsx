"use client";

import { ChevronRight, Maximize2, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TILBlock } from "@/types/til";
import styles from "./til-reader.module.css";

type MediaBlock = Exclude<TILBlock, { type: "paragraph" }>;

export function TILMedia({ block }: { block: MediaBlock }) {
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    const triggerElement = trigger.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus({ preventScroll: true });
    };
  }, [expanded]);

  // Only canonical, validated YouTube watch URLs may become iframe sources.
  const youtubeId = block.type === "youtube"
    ? /^https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$/.exec(block.src)?.[1]
    : undefined;

  return (
    <figure className={styles.media}>
      {block.type === "image" ? (
        <>
          {failed ? <p className={styles.mediaFallback}>이미지를 불러오지 못했습니다. {block.alt}</p> : (
            <button type="button" className={styles.imageButton} ref={trigger}
              aria-label={`이미지 확대: ${block.alt}`} onClick={() => { setZoomed(false); setExpanded(true); }}>
              {/* Authored width and height preserve the image's intrinsic ratio. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.src} alt={block.alt} width={block.width} height={block.height}
                loading="lazy" decoding="async" onError={() => setFailed(true)} />
              <span className={styles.expandLabel}><Maximize2 size={14} aria-hidden="true" /> 확대해서 보기</span>
            </button>
          )}
          {expanded ? (
            <dialog ref={dialog} className={styles.lightbox} aria-label={`확대 이미지: ${block.alt}`}
              onCancel={() => setExpanded(false)} onClose={() => setExpanded(false)}>
              <div className={styles.lightboxToolbar}>
                <button type="button" className={styles.zoomToggle} aria-pressed={zoomed}
                  aria-label="이미지 크게 보기" onClick={() => setZoomed((value) => !value)}>
                  <Maximize2 size={17} aria-hidden="true" /> {zoomed ? "전체 보기" : "크게 보기"}
                </button>
                <button type="button" className={styles.closeLightbox} onClick={() => setExpanded(false)} autoFocus>
                  <X size={20} aria-hidden="true" /> 닫기
                </button>
              </div>
              <div className={styles.imageViewport} data-zoomed={zoomed} role="region"
                aria-label={zoomed ? "확대 이미지 — 방향키로 이동" : "전체 이미지"} tabIndex={zoomed ? 0 : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt} width={block.width} height={block.height}
                  style={zoomed ? { width: `max(100%, ${block.width}px)` } : undefined} />
              </div>
              {block.caption ? <p>{block.caption}</p> : null}
              <a href={block.src} target="_blank" rel="noopener noreferrer">원본 이미지 열기 (새 창)</a>
            </dialog>
          ) : null}
        </>
      ) : block.type === "video" ? (
        <video aria-label={block.title} controls preload="none" playsInline poster={block.poster}
          width={block.width} height={block.height} onError={() => setFailed(true)}>
          <source src={block.src} />
          이 브라우저에서는 영상을 재생할 수 없습니다.
        </video>
      ) : playing && youtubeId ? (
        <iframe className={styles.youtubeFrame} src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={block.title} width={block.width} height={block.height}
          style={{ aspectRatio: `${block.width} / ${block.height}` }}
          allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button type="button" className={styles.youtubePlaceholder} disabled={!youtubeId}
          style={{ aspectRatio: `${block.width} / ${block.height}` }} onClick={() => setPlaying(true)}>
          <Play size={32} aria-hidden="true" />
          <strong>{block.title}</strong>
          <span>{youtubeId ? "YouTube 플레이어 열기" : "아래 원본 링크에서 영상을 확인하세요."}</span>
        </button>
      )}
      {block.caption || block.prompt ? (
        <figcaption>
          {block.prompt ? (
            <details className={styles.promptDetails}>
              <summary aria-label={`${block.caption ? `${block.caption} — ` : ""}사용한 프롬프트: ${block.type === "image" ? block.alt : block.title}`}>
                <span>{block.caption || "사용한 프롬프트"}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </summary>
              <pre className={styles.promptText}>{block.prompt}</pre>
            </details>
          ) : block.caption}
        </figcaption>
      ) : null}
      {block.type !== "image" || failed ? (
        <p className={styles.mediaSource}>
          {failed && block.type === "video" ? "영상을 불러오지 못했습니다. " : null}
          <a href={block.src} target="_blank" rel="noopener noreferrer">
            {block.type === "image" ? "원본 이미지 열기" : "원본 영상 열기"} (새 창)
          </a>
        </p>
      ) : null}
    </figure>
  );
}
