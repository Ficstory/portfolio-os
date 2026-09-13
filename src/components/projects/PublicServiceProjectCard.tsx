import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CircleDot, FileText, Route, Users } from "lucide-react";

import type { Project } from "@/types/portfolio";

type PublicServiceProjectCardProps = {
  href: string;
  index: number;
  project: Project;
};

const publicDigitalCaseCopy: Record<
  string,
  {
    policyContext: string;
    requirementTranslation: string;
    userFlow: string;
  }
> = {
  "busan-eumgil": {
    "policyContext": "경로 계산과 공간 데이터 구축은 팀의 백엔드·AI 담당 범위입니다. 실제 통행 안전성을 확인한 사용자 검증 자료는 없습니다.",
    "requirementTranslation": "제보 사진과 처리 상태를 PRD·기능·화면명세에 반영하고 구현 상태를 갱신했습니다.",
    "userFlow": "개인 구현은 글자 크기 설정과 마이페이지 연결, 승인된 제보 마커와 상세 패널입니다."
  },
  "aekkim": {
    "policyContext": "팀은 구독 관리 Android 앱을 만들었고 프로젝트 우수상을 받았습니다. 알림 권한 QA 개선은 팀원의 작업입니다.",
    "requirementTranslation": "구독 후보·미연결 결제처·등록 완료 상태를 요구사항과 화면명세에 반영했습니다.",
    "userFlow": "후보 확인과 수동 추가 화면·API 연동, 후보 개수 표시 오류 수정을 맡았습니다."
  },
  "smile-game": {
    "policyContext": "AI 웃음 감지 모델은 양한빈 팀원이 개발했습니다. 저는 조사·기획 문서와 친구 초대방 화면을 맡았습니다.",
    "requirementTranslation": "168건의 사전 설문과 회의를 바탕으로 친구 매칭을 우선하는 결정을 기획서와 기능명세에 반영했습니다.",
    "userFlow": "친구 초대방 생성·입장·대기를 구현하고 초대한 상대가 보이지 않는 문제를 수정했습니다."
  },
  "play-pick": {
    "policyContext": "2인 팀에서 저는 프론트엔드와 온보딩 저장 흐름을, 임경수 팀원은 공연 데이터·검색·추천·배포를 주로 담당했습니다.",
    "requirementTranslation": "첫 추천에 사용할 취향을 모으기 위해 선호·비선호 선택을 저장하는 화면과 API를 구현했습니다.",
    "userFlow": "선호·비선호 합계 8개 이상을 모아 저장하고 완료 처리 후 추천 화면으로 이동합니다. 건너뛰기는 응답 수에 포함하지 않습니다."
  }
};

function EvidenceBlock({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-md border border-slate-200 bg-white p-3">
      <h4 className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-normal text-slate-500">
        {icon}
        <span className="min-w-0 break-words">{title}</span>
      </h4>
      {children}
    </section>
  );
}

export function PublicServiceProjectCard({
  href,
  index,
  project,
}: PublicServiceProjectCardProps) {
  const caseCopy = publicDigitalCaseCopy[project.id];
  const requirementTranslation =
    caseCopy?.requirementTranslation ?? project.valueStatement;
  const userFlow = caseCopy?.userFlow ?? project.summary;
  const policyContext = caseCopy?.policyContext ?? project.valueStatement;

  return (
    <Link
      aria-label={`${project.title} 공공디지털 사례 상세 보기`}
      className="group grid h-full min-w-0 max-w-full overflow-hidden rounded-lg border border-emerald-200/80 bg-white text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] md:grid-rows-[auto_1fr_auto]"
      href={href}
    >
      <div className="min-w-0 border-b border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span className="max-w-full break-words rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase tracking-normal text-emerald-800">
            Public Digital Case {String(index).padStart(2, "0")}
          </span>
          <span className="max-w-full break-words rounded-md border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
            문제정의·사용자흐름·요구사항
          </span>
        </div>
        <h3 className="mt-4 text-pretty break-words text-2xl font-bold leading-tight text-slate-950">
          {project.title}
        </h3>
        <p className="mt-3 break-words text-sm leading-6 text-slate-700">
          {project.summary}
        </p>
      </div>

      <div className="min-w-0 space-y-3 p-4 sm:p-5">
        <EvidenceBlock
          icon={<Users aria-hidden="true" size={14} strokeWidth={2.4} />}
          title="서비스의 문제"
        >
          <p className="mt-2 break-words text-sm leading-6 text-slate-700">
            {project.problem}
          </p>
        </EvidenceBlock>

        <div className="grid gap-3 md:grid-cols-2">
          <EvidenceBlock
            icon={<Route aria-hidden="true" size={14} strokeWidth={2.4} />}
            title="개인 구현"
          >
            <p className="mt-2 break-words text-xs leading-5 text-slate-700">
              {userFlow}
            </p>
          </EvidenceBlock>

          <EvidenceBlock
            icon={<FileText aria-hidden="true" size={14} strokeWidth={2.4} />}
            title="문서·기획 작업"
          >
            <p className="mt-2 break-words text-xs leading-5 text-slate-700">
              {requirementTranslation}
            </p>
          </EvidenceBlock>
        </div>

        <section className="rounded-md border border-emerald-100 bg-emerald-50/50 p-3">
          <h4 className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-normal text-emerald-800">
            <CircleDot aria-hidden="true" size={13} strokeWidth={2.5} />
            <span className="min-w-0 break-words">협업 범위</span>
          </h4>
          <p className="mt-2 break-words text-xs leading-5 text-slate-600">
            {policyContext}
          </p>
        </section>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2 border-t border-emerald-100 p-4 sm:p-5">
        {project.stack.slice(0, 4).map((tech) => (
          <span
            className="max-w-full break-words rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800"
            key={tech}
          >
            {tech}
          </span>
        ))}
        <span className="inline-flex basis-full items-center justify-end gap-1 text-xs font-bold text-emerald-800 sm:ml-auto sm:basis-auto">
          상세 보기
          <ArrowRight aria-hidden="true" size={14} strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  );
}
