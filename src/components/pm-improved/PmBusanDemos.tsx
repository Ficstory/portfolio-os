"use client";

import { useState } from "react";
import styles from "./busanCase.module.css";

const demos = [
  {
    id: "onboarding",
    label: "사용자 유형 온보딩",
    video: "/pm-improved/busan/onboarding.mp4",
    poster: "/pm-improved/busan/onboarding.jpg",
    owner: "TEAM",
    summary: "이동 보조기기와 사용자 조건을 먼저 확인해 이후 경로 탐색의 기준으로 삼는 팀 구현입니다.",
  },
  {
    id: "route-search",
    label: "경로 탐색",
    video: "/pm-improved/busan/route-search.mp4",
    poster: "/pm-improved/busan/route-search.jpg",
    owner: "MY ROLE + TEAM",
    summary: "저는 지도 렌더링과 선택 마커 고정, 카메라 제스처 동기화를 맡았고 경로 알고리즘과 공간 데이터는 팀원이 담당했습니다.",
  },
  {
    id: "font-size",
    label: "글자 크기",
    video: "/pm-improved/busan/font-size.mp4",
    poster: "/pm-improved/busan/font-size.jpg",
    owner: "MY ROLE",
    summary: "기본·크게·매우 크게 중 선택한 값을 바로 저장하고 화면에 적용하는 접근성 설정을 구현했습니다.",
  },
  {
    id: "low-vision",
    label: "저시력 모드",
    video: "/pm-improved/busan/low-vision.mp4",
    poster: "/pm-improved/busan/low-vision.jpg",
    owner: "TEAM",
    summary: "색과 대비를 조정해 지도 정보를 구분하는 저시력 모드는 팀이 함께 완성한 서비스 기능입니다.",
  },
  {
    id: "report",
    label: "사용자 제보",
    video: "/pm-improved/busan/report.mp4",
    poster: "/pm-improved/busan/report.jpg",
    owner: "MY ROLE + TEAM",
    summary: "제보 화면·입력 흐름 약 15초 · 사진 첨부 화면 이전까지의 발췌입니다. 저는 승인된 제보를 시설과 다른 마커로 표시하고 하단 패널에서 내용을 읽는 화면을 맡았으며, 입력·승인 흐름 전체는 팀 산출물입니다.",
  },
  {
    id: "bookmark",
    label: "즐겨찾기",
    video: "/pm-improved/busan/bookmark.mp4",
    poster: "/pm-improved/busan/bookmark.jpg",
    owner: "TEAM",
    summary: "자주 확인하는 장소를 다시 찾기 쉽게 저장하는 팀 구현입니다.",
  },
] as const;

export function PmBusanDemos() {
  const [selectedId, setSelectedId] = useState<(typeof demos)[number]["id"]>("route-search");
  const selected = demos.find((demo) => demo.id === selectedId) ?? demos[0];

  return (
    <section className={styles.demoSection} aria-labelledby="busan-demo-title">
      <div className={styles.demoIntro}>
        <div>
          <p className={styles.kicker}>PRODUCT DEMO / 실제 팀 산출물</p>
          <h2 id="busan-demo-title">기능 하나씩, 담당 범위와 함께 봅니다.</h2>
        </div>
        <p>직접 녹화한 실제 앱 화면 · 무음. 아래 기능을 선택하면 해당 영상만 불러옵니다.</p>
      </div>

      <div className={styles.demoPicker} aria-label="시연 기능 선택">
        {demos.map((demo, index) => (
          <button
            key={demo.id}
            type="button"
            aria-pressed={demo.id === selected.id}
            onClick={() => setSelectedId(demo.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {demo.label}
          </button>
        ))}
      </div>

      <div className={styles.demoStage}>
        <div className={styles.videoFrame}>
          <video
            key={selected.id}
            controls
            playsInline
            preload="none"
            poster={selected.poster}
            aria-label={`${selected.label} 기능 시연`}
          >
            <source src={selected.video} type="video/mp4" />
            브라우저에서 영상을 재생할 수 없습니다.
          </video>
        </div>
        <div className={styles.demoDescription} aria-live="polite">
          <p className={styles.ownerLabel}>{selected.owner}</p>
          <h3>{selected.label}</h3>
          <p>{selected.summary}</p>
          <a href={selected.video} target="_blank" rel="noreferrer">영상 파일 새 탭에서 열기 ↗</a>
        </div>
      </div>
    </section>
  );
}
