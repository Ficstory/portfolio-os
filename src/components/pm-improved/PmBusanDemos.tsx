"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./busanCase.module.css";

const demos = [
  {
    id: "onboarding",
    label: "사용자 유형 온보딩",
    video: "/pm-improved/busan/onboarding-v2.mp4",
    poster: "/pm-improved/busan/onboarding.jpg",
    summary: "이동 보조기기와 사용자 조건을 고르는 첫 설정 화면을 보여 줍니다.",
    roles: [{ label: "구현한 내용", detail: "초기 설정을 저장하고, 다음 실행부터 알맞은 화면으로 진입하는 분기" }],
  },
  {
    id: "route-search",
    label: "경로 탐색",
    video: "/pm-improved/busan/route-search-v2.mp4",
    poster: "/pm-improved/busan/route-search.jpg",
    summary: "목적지를 검색·선택하고 실제 지도에서 경로를 확인하는 흐름을 보여 줍니다.",
    roles: [
      { label: "구현한 내용", detail: "Kakao 지도 초기화·카메라·마커·경로선, 장소 검색, 경로 응답 변환과 길안내 상태 연결" },
    ],
  },
  {
    id: "font-size",
    label: "글자 크기",
    video: "/pm-improved/busan/font-size-v2.mp4",
    poster: "/pm-improved/busan/font-size.jpg",
    summary: "기본·크게·매우 크게 중 하나를 선택하면 글자 크기가 즉시 바뀌는 장면입니다.",
    roles: [{ label: "구현한 내용", detail: "공통 글자 크기 설정, 선택값 저장·즉시 적용과 관련 화면 오류 수정" }],
  },
  {
    id: "low-vision",
    label: "저시력 모드",
    video: "/pm-improved/busan/low-vision-v2.mp4",
    poster: "/pm-improved/busan/low-vision.jpg",
    summary: "색과 대비를 조정한 저시력 화면에서 지도 정보를 확인하는 전체 흐름입니다.",
    roles: [{ label: "구현한 내용", detail: "사용자 설정 저장·재진입 분기와 경로 음성 안내 기반" }],
  },
  {
    id: "report",
    label: "사용자 제보",
    video: "/pm-improved/busan/report.mp4",
    poster: "/pm-improved/busan/report.jpg",
    summary: "사진 첨부 전까지의 제보 입력 화면을 보여 줍니다.",
    roles: [
      { label: "구현한 내용", detail: "승인된 제보의 별도 지도 마커·상세 화면, API 응답 연결과 길안내 상태 보정" },
    ],
  },
  {
    id: "bookmark",
    label: "즐겨찾기",
    video: "/pm-improved/busan/bookmark-v2.mp4",
    poster: "/pm-improved/busan/bookmark.jpg",
    summary: "장소를 즐겨찾기에 저장하고 다시 확인하는 사용 흐름을 보여 줍니다.",
    roles: [{ label: "구현한 내용", detail: "서버 저장 결과를 기준으로 정리하고 로컬 임시 저장 경로를 제거해 상태 불일치 축소" }],
  },
] as const;

type PlayerStatus = "loading" | "waiting" | "error" | "ready";

function IsolatedDemoPlayer({
  id,
  label,
  poster,
  source,
}: {
  id: string;
  label: string;
  poster: string;
  source: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stallTimer: number | undefined;
    const clearStallTimer = () => {
      if (stallTimer) window.clearTimeout(stallTimer);
      stallTimer = undefined;
    };
    const startStallTimer = () => {
      clearStallTimer();
      stallTimer = window.setTimeout(() => {
        setStatus("error");
        console.warn("Demo video playback stalled.", {
          source,
          readyState: video.readyState,
          networkState: video.networkState,
          currentTime: video.currentTime,
        });
      }, 12_000);
    };
    const onLoadStart = () => {
      setStatus("loading");
      startStallTimer();
    };
    const onWaiting = () => {
      setStatus("waiting");
      startStallTimer();
    };
    const onLoadedMetadata = () => {
      clearStallTimer();
      setStatus("ready");
    };
    const onPlayable = () => {
      clearStallTimer();
      setStatus("ready");
    };
    const onError = () => {
      clearStallTimer();
      setStatus("error");
      console.error("Demo video could not be loaded.", {
        source,
        errorCode: video.error?.code,
        errorMessage: video.error?.message,
        readyState: video.readyState,
        networkState: video.networkState,
        currentTime: video.currentTime,
      });
    };

    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onPlayable);
    video.addEventListener("playing", onPlayable);
    video.addEventListener("error", onError);

    video.src = source;
    video.load();

    return () => {
      clearStallTimer();
      video.removeEventListener("loadstart", onLoadStart);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onPlayable);
      video.removeEventListener("playing", onPlayable);
      video.removeEventListener("error", onError);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [source, retryCount]);

  return (
    <div className={styles.videoPlayer}>
      <video
        key={`${id}-${retryCount}`}
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={`${label} 기능 시연`}
      >
        브라우저에서 영상을 재생할 수 없습니다.
      </video>
      <div className={styles.videoStatus} aria-live="polite">
        {status === "loading" && "영상을 불러오는 중입니다."}
        {status === "waiting" && "재생을 준비하고 있습니다. 잠시만 기다려 주세요."}
        {status === "error" && (
          <>
            <span>영상을 불러오지 못했습니다.</span>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)}>다시 시도</button>
          </>
        )}
      </div>
    </div>
  );
}

export function PmBusanDemos() {
  const [selectedId, setSelectedId] = useState<(typeof demos)[number]["id"]>("route-search");
  const selected = demos.find((demo) => demo.id === selectedId) ?? demos[0];

  return (
    <section className={styles.demoSection} aria-labelledby="busan-demo-title">
      <div className={styles.demoIntro}>
        <div>
          <p className={styles.kicker}>PRODUCT DEMO / 실제 앱 시연</p>
          <h2 id="busan-demo-title">실제 앱에서 확인하는 주요 기능</h2>
        </div>
        <p>직접 녹화한 앱 시연 · 무음</p>
      </div>

      <div className={styles.demoPicker} aria-label="시연 기능 선택">
        {demos.map((demo) => (
          <button
            key={demo.id}
            type="button"
            aria-pressed={demo.id === selected.id}
            onClick={() => setSelectedId(demo.id)}
          >
            {demo.label}
          </button>
        ))}
      </div>

      <div className={styles.demoStage}>
        <div className={styles.videoFrame}>
          <IsolatedDemoPlayer
            key={selected.id}
            id={selected.id}
            label={selected.label}
            poster={selected.poster}
            source={selected.video}
          />
        </div>
        <div className={styles.demoDescription} aria-live="polite">
          <h3>{selected.label}</h3>
          <p>{selected.summary}</p>
          <dl className={styles.roleList}>
            {selected.roles.map((role) => (
              <div key={role.label}>
                <dt>{role.label}</dt>
                <dd>{role.detail}</dd>
              </div>
            ))}
          </dl>
          <a href={selected.video} target="_blank" rel="noreferrer">영상 파일 새 탭에서 열기 ↗</a>
        </div>
      </div>
    </section>
  );
}
