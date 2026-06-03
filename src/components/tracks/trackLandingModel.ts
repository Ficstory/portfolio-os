import { careerCases } from "../../data/careerCases";
import { projects } from "../../data/projects";
import {
  getTrackCareerCases,
  getTrackProjects,
  resolvePortfolioTrack,
  type PortfolioTrackId,
} from "../../lib/portfolioTrack";

export type TrackCtaLink = {
  label: string;
  href: string;
};

type TrackSectionCopy = {
  eyebrow: string;
  title: string;
  summary: string;
};

type TrackCaseSectionCopy = {
  primary: TrackSectionCopy;
  secondary: TrackSectionCopy;
};

export type TrackLandingModel = ReturnType<typeof getTrackLandingModel>;

const trackProofCopy: Record<
  PortfolioTrackId,
  {
    proofFocus: string[];
    cautionNotes: string[];
    ctaLinks: TrackCtaLink[];
    caseSections: TrackCaseSectionCopy;
  }
> = {
  default: {
    proofFocus: [
      "대표 프로젝트 상세",
      "공공정책 분석 경력 요약",
      "이력서와 연락처",
    ],
    cautionNotes: [
      "루트는 특정 지원 직무로 단정하지 않습니다.",
      "지원서에는 직무별 트랙 URL을 직접 첨부합니다.",
    ],
    ctaLinks: [
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "mailto:dlwo4367@gmail.com" },
    ],
    caseSections: {
      primary: {
        eyebrow: "Case Studies",
        title: "대표 프로젝트",
        summary:
          "루트 포트폴리오는 특정 지원 직무로 단정하지 않고, 프로젝트와 공공 경력 근거를 균형 있게 보여줍니다.",
      },
      secondary: {
        eyebrow: "Public-sector Evidence",
        title: "공공·의정 경력 근거",
        summary:
          "부산참여연대 경력은 공공 문제를 읽고 문서로 구조화한 기반 경험으로 분리합니다.",
      },
    },
  },
  publicDigital: {
    proofFocus: [
      "부산이음길 PRD와 요구사항명세",
      "부산참여연대 공공자료 분석 경력",
      "AEKKIM 화면명세와 API 협업 기준",
      "접근성·사용자 흐름·서비스 요구사항 정리",
    ],
    cautionNotes: [
      "정책 성과처럼 과장하지 않고 공공 문제를 서비스 요구사항으로 번역한 과정만 설명합니다.",
      "Play Pick은 배포 URL 검증 전까지 보조 사례로만 둡니다.",
      "기술 스택보다 공공 맥락, 사용자 문제, 실행 기준을 먼저 보여줍니다.",
    ],
    ctaLinks: [
      { label: "Case Studies", href: "#case-studies" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "mailto:dlwo4367@gmail.com" },
    ],
    caseSections: {
      primary: {
        eyebrow: "Public Digital Case",
        title: "공공디지털 대표 프로젝트",
        summary:
          "공공 문제를 사용자 조건, 접근성 흐름, 요구사항 기준으로 번역한 프로젝트를 먼저 보여줍니다.",
      },
      secondary: {
        eyebrow: "Public-sector Context",
        title: "공공 문제정의 경력 근거",
        summary:
          "부산참여연대 경력은 서비스 요구사항 이전의 공공자료 분석과 현장 문제정의 배경으로 연결합니다.",
      },
    },
  },
  pm: {
    proofFocus: [
      "AEKKIM 요구사항정의서와 화면명세 변경 이력",
      "README, FE 테스트 계획, 브랜치 전략",
      "웃지마게임 설문·피드백 기반 MVP 조정",
      "회의록과 구현 범위 조율 기록",
    ],
    cautionNotes: [
      "프로덕트 전체 총괄처럼 쓰지 않고 팀 프로젝트에서 맡은 문서화와 조율 범위를 명확히 씁니다.",
      "공공 경력은 배경으로 두고 서비스 산출물과 협업 기준을 앞세웁니다.",
      "기술 과시보다 화면, API, 데이터 흐름 이해를 강조합니다.",
    ],
    ctaLinks: [
      { label: "Case Studies", href: "#case-studies" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "mailto:dlwo4367@gmail.com" },
    ],
    caseSections: {
      primary: {
        eyebrow: "PM Case",
        title: "PM 대표 프로젝트",
        summary:
          "요구사항정의, 화면명세, API 협업 기준과 MVP 범위 조율 경험을 먼저 보여줍니다.",
      },
      secondary: {
        eyebrow: "Policy Context",
        title: "문제정의 배경 근거",
        summary:
          "공공 경력은 제품 총괄 경험이 아니라 복잡한 자료를 실행 문서로 정리한 배경 근거로 분리합니다.",
      },
    },
  },
  policy: {
    proofFocus: [
      "부산참여연대 지방자치본부 경력",
      "행정사무감사 의제와 질의 포인트 정리",
      "조례·예산·정책자료 분석 문서",
      "보도자료·논평·발제문 작성 경험",
    ],
    cautionNotes: [
      "정책을 직접 결정했다는 식의 표현은 사용하지 않습니다.",
      "부산참여연대 경력은 개발 프로젝트가 아니라 정책 실무 경력으로 분리합니다.",
      "검증되지 않은 수치는 화면 본문에 반복 노출하지 않습니다.",
    ],
    ctaLinks: [
      { label: "Career Cases", href: "#career-cases" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "mailto:dlwo4367@gmail.com" },
    ],
    caseSections: {
      primary: {
        eyebrow: "Career Evidence",
        title: "정책지원관 경력 브리프",
        summary:
          "조례, 예산, 행정사무감사, 회기 모니터링 경험을 정책지원 문서 역량으로 보여줍니다.",
      },
      secondary: {
        eyebrow: "Digital Literacy",
        title: "보조 디지털 프로젝트",
        summary:
          "디지털 프로젝트는 정책지원관 트랙에서 SW 협업 이해와 공공서비스 감각을 보여주는 보조 근거입니다.",
      },
    },
  },
  assembly: {
    proofFocus: [
      "의정감시와 회기 모니터링 기록",
      "보도자료·논평·질의형 문서 작성",
      "공공 이슈 조사와 쟁점 정리",
      "IT·AI 이슈를 이해할 수 있는 디지털 프로젝트 경험",
    ],
    cautionNotes: [
      "국회 실무를 직접 수행했다고 쓰지 않습니다.",
      "지방의회 의정감시 경험을 보좌 실무와 유사한 조사·문서화 경험으로 연결합니다.",
      "기술 프로젝트는 보조 근거로만 배치합니다.",
    ],
    ctaLinks: [
      { label: "Career Cases", href: "#career-cases" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "mailto:dlwo4367@gmail.com" },
    ],
    caseSections: {
      primary: {
        eyebrow: "Assembly Evidence",
        title: "국회 보좌 실무형 경력 브리프",
        summary:
          "회의 모니터링, 이슈 조사, 질의 방향 정리, 메시지 작성 경험을 보좌 실무와 가까운 순서로 보여줍니다.",
      },
      secondary: {
        eyebrow: "Digital Literacy",
        title: "보조 디지털 프로젝트",
        summary:
          "디지털 프로젝트는 국회 트랙에서 IT·AI 이슈를 이해하고 협업 언어를 다룰 수 있다는 보조 근거입니다.",
      },
    },
  },
};

export function getTrackLandingModel(trackId: PortfolioTrackId) {
  const track = resolvePortfolioTrack(trackId);
  const orderedProjects = getTrackProjects(projects, track.id);
  const orderedCareerCases = getTrackCareerCases(careerCases, track.id);
  const primaryCaseKind = track.kind === "careerDocument" ? "career" : "project";
  const primaryProjectCardKind =
    track.id === "pm"
      ? "pm"
      : track.id === "publicDigital"
        ? "publicDigital"
        : "standard";
  const firstEvidenceId =
    primaryCaseKind === "career"
      ? orderedCareerCases[0]?.id
      : orderedProjects[0]?.id;
  const copy = trackProofCopy[track.id];

  return {
    track,
    profile: track.profile,
    orderedProjects,
    orderedCareerCases,
    primaryCaseKind,
    primaryProjectCardKind,
    firstEvidenceId,
    proofFocus: copy.proofFocus,
    cautionNotes: copy.cautionNotes,
    ctaLinks: copy.ctaLinks,
    caseSections: copy.caseSections,
  };
}
