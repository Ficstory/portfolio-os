import type { Metadata } from "next";
import { baseUrl } from "@/lib/seo";
import PortfolioDocument from "./PortfolioDocument";

const title = "이재호 | 경험과 프로젝트 포트폴리오";
const description = "부산참여연대의 자료 분석·문서 작성·대외 협의 경험과 SSAFY 팀 프로젝트의 조사·기획·구현 경험을 담았습니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${baseUrl}/portfolio/` },
  openGraph: { title, description, url: `${baseUrl}/portfolio/`, type: "website", images: [] },
  twitter: { card: "summary", title, description, images: [] },
  robots: { index: false, follow: false },
};

const projects = [
  {
    id: "aekkim", number: "01", name: "애낌", period: "2026.02–03",
    category: "요구사항 · 작업계획 · 구현",
    heading: "정리한 기준이 실제 화면까지 이어지도록",
    description: "결제 내역과 앱 사용 정보를 바탕으로 구독 현황을 파악하고 불필요한 지출을 줄이도록 돕는 서비스입니다.",
    role: "팀장 · PM · 프론트엔드",
    actions: [
      "요구사항정의서와 화면명세서를 작성하고, 프론트엔드 작업 순서와 처리 기준을 정리했습니다.",
      "사용자가 분석 결과를 확인·제외하고 구독으로 등록하는 화면을 구현했습니다. 매칭되지 않은 결제 내역을 직접 연결하는 흐름도 다뤘습니다.",
      "구현 중 달라진 동작과 예외 처리 기준을 명세에 반영하며 문서와 화면을 함께 관리했습니다.",
    ],
    output: "요구사항정의서 · 화면명세서 · 작업계획 · 구독 확인·등록 화면",
    result: "SSAFY 특화 프로젝트 우수상 수상 (2026.03, 팀 수상)",
    image: "/pm-improved/evidence/aekkim-dashboard-original.jpg", alt: "애낌 초기 대시보드: 구독료 52,548원과 검토가 필요한 결제 내역 3건", href: "/PM/aekkim/",
    portrait: true, width: 1080, height: 2284, caption: "초기 대시보드 · GitHub 저장소 원본 캡처",
  },
  {
    id: "busan-eumgil", number: "02", name: "부산이음길", period: "2026.04–05",
    category: "기관 협의 · 요구사항 · UX",
    heading: "현장에서 들은 조건을 이용 흐름으로",
    description: "휠체어 사용자·저시력자를 위한 길찾기입니다. 팀은 로드뷰의 볼라드·점자블록을 AI로 식별해 경로 가중치용 데이터를 만들었습니다.",
    role: "기관 연락·인터뷰 · 요구사항 정리 · UX 설계 · 프론트엔드",
    actions: [
      "인적 네트워크와 공문으로 9개 기관에 협조를 요청했습니다. 거절 이후에도 접촉을 이어가 시각장애인 협회와 추가 인터뷰를 진행했습니다.",
      "현장에서 들은 경사·단차·보행로 폭 등의 조건을 정리하고, 안전한 길과 최단거리를 비교·선택하는 흐름과 지도·길안내 화면 구현에 참여했습니다.",
      "프로젝트 이후에는 기존 결과물을 정리하고 데이터 기반 수익구조를 보완해 공공데이터 공모전에 출품했습니다.",
    ],
    output: "기관 인터뷰 정리 · 요구사항·UX 설계 · 지도·길안내 화면 · 후속 사업계획",
    result: "인터뷰와 시제품 구현까지 진행했습니다. 실사용 데이터 확보에는 이르지 못해 실제 이용 효과는 검증하지 못했습니다.",
    image: "/pm-improved/evidence/busan-route-map.png", alt: "부산이음길의 접근성 시설과 최근 목적지를 표시하는 지도 화면", href: "/PM/busan-eumgil/",
    portrait: true, width: 720, height: 1560, caption: "지도·시설 탐색 · 팀 서비스 구현 화면",
  },
  {
    id: "smile-game", number: "03", name: "웃지마게임", period: "2026.01–02",
    category: "사용자 조사 · 의사결정 · 문서화",
    heading: "만들고 싶은 기능보다 참여할 조건을 먼저",
    description: "얼굴 표정을 활용해 함께 웃음을 참는 실시간 게임입니다.",
    role: "팀장 · PM · 사용자 조사 · 프론트엔드",
    actions: [
      "설문 초안 작성·배포·분석을 맡아 168건의 응답을 살폈습니다. 이 중 112명이 얼굴 노출에 부담을 느낀다는 점을 확인했습니다.",
      "조사 결과를 팀과 논의해 친구·지인과의 참여 흐름을 우선하는 방향으로 기획을 조정했습니다.",
      "기획서·기능명세서·회의록·발표자료를 정리하고, 초대·로그인·대기실 흐름 구현에 참여했습니다.",
    ],
    output: "설문·분석 자료 · 기획서 · 기능명세서 · 회의록 · 참여 화면",
    result: "설문 결과를 기능 우선순위와 참여 흐름에 반영했습니다.",
    image: "/pm/previews/smile.webp", alt: "웃지마게임 서비스의 참여 화면", href: "/PM/smile-game/",
    portrait: false, width: 1280, height: 720, caption: "팀 서비스 시연 · 랜덤 매칭",
  },
  {
    id: "play-pick", number: "04", name: "PlayPick", period: "2025.12",
    category: "화면 설계 · 구현 · 발표",
    heading: "취향을 남기는 첫 단계부터 추천 화면까지",
    description: "이용자의 취향에 맞는 공연을 탐색하고 공유하는 추천·커뮤니티 서비스입니다.",
    role: "팀장 · UI/UX · 프론트엔드 · 문서·발표",
    actions: [
      "2인 팀에서 사용자 화면 설계와 프론트엔드 구현, 문서 정리와 발표를 맡았습니다.",
      "온보딩에서 취향을 선택하고 응답을 저장한 뒤 추천 화면으로 이동하는 흐름을 구현했습니다.",
      "팀원이 담당한 추천·검색 기능을 사용자 화면과 연결하며 서비스의 이용 흐름을 완성했습니다.",
    ],
    output: "온보딩·추천 연결 화면 · UI/UX 설계 · 프로젝트 문서 · 발표자료",
    result: "취향 입력부터 공연 탐색까지 이어지는 서비스 화면을 구현했습니다.",
    image: "/pm/previews/play-pick.webp", alt: "PlayPick 서비스의 공연 탐색 화면", href: "/PM/play-pick/",
    portrait: false, width: 1280, height: 960, caption: "",
  },
];

export default function PortfolioPage() {
  return <PortfolioDocument projects={projects} />;
}
