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
          "네 개 팀 프로젝트에서 맡은 조사, 문서 작성, 화면 구현을 소개합니다.",
      },
      secondary: {
        eyebrow: "Public-sector Evidence",
        title: "공공·의정 경력 근거",
        summary:
          "부산참여연대에서 예산·결산 자료와 의회 활동을 조사하고 보고서와 발제 자료를 작성했습니다.",
      },
    },
  },
  publicDigital: {
    proofFocus: [
      "부산이음길 PRD·요구사항정의서",
      "부산이음길 사용자별 화면과 글자 크기 설정",
      "부산참여연대 공공자료 분석 경험",
      "AEKKIM 요구사항·화면명세 변경 이력",
      "의정평가 보고서·발제 자료 작성 경험",
    ],
    cautionNotes: [
      "정책 성과처럼 보이는 표현은 피하고, 실제 산출물과 기획 판단 중심으로 설명합니다.",
      "운영기관처럼 보이는 표현은 쓰지 않고, 프로젝트 내 역할과 협업 범위를 명확히 합니다.",
      "검증되지 않은 정량 성과는 반복 노출하지 않습니다.",
    ],
    ctaLinks: [
      { label: "대표 사례 보기", href: "#case-studies" },
      { label: "맡은 작업 보기", href: "#operating-model" },
      { label: "이력서 보기", href: "/resume" },
      { label: "연락하기", href: "mailto:dlwo4367@gmail.com" },
    ],
    caseSections: {
      primary: {
        eyebrow: "Public Digital Case",
        title: "공공디지털 대표 프로젝트",
        summary:
          "이동약자 길안내 앱을 비롯해, 사용자별 화면과 상태·API를 다룬 팀 프로젝트입니다.",
      },
      secondary: {
        eyebrow: "Public-sector Context",
        title: "공공자료 조사·작성 경력",
        summary:
          "지방자치본부·재정감시센터에서 맡은 자료 조사와 보고서 작성 업무입니다.",
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
          "구독 확인, 이동 조건별 길안내, 친구 초대 게임, 첫 공연 추천에서 맡은 작업입니다.",
      },
      secondary: {
        eyebrow: "Policy Context",
        title: "문제정의 배경 근거",
        summary:
          "공공자료를 비교·분석하고 보고서와 발제 자료로 정리한 경력입니다.",
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
        title: "정책지원관 지원 · 주요 경력",
        summary:
          "부산참여연대에서 수행한 예산·결산 분석, 의정평가, 행정사무감사 시민의제 취합 업무입니다.",
      },
      secondary: {
        eyebrow: "Digital Literacy",
        title: "보조 디지털 프로젝트",
        summary:
          "요구사항을 문서로 정리하고 화면과 API를 구현한 팀 프로젝트입니다.",
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
        title: "국회 보좌직 지원 · 주요 경력",
        summary:
          "지방의회 의정감시와 공공 이슈 조사, 보고서·발제·대외 설명 자료 작성 경험입니다.",
      },
      secondary: {
        eyebrow: "Digital Literacy",
        title: "보조 디지털 프로젝트",
        summary:
          "화상 게임과 추천 서비스에서 맡은 기획·구현을 통해 데이터와 AI 기능을 다룬 경험입니다.",
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
