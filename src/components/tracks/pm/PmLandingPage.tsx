import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  GitBranch,
  Layers,
  Mail,
  Network,
  Route,
  Search,
  Users,
} from "lucide-react";

import { PmArtifactStack } from "@/components/tracks/pm/PmArtifactStack";
import { PmComparisonTable } from "@/components/tracks/pm/PmComparisonTable";
import {
  pmCaseStudies,
  pmCollaborationModel,
  pmFaqs,
  pmFinalCta,
  pmFitSegments,
  pmHero,
  pmMetrics,
  pmNavItems,
  pmOperatingSystem,
  pmProblemFrames,
  pmProductArtifacts,
  pmPublicBridge,
} from "@/components/tracks/pm/pmLandingContent";

type SectionHeadingProps = {
  eyebrow: string;
  summary: string;
  title: string;
  tone?: "light" | "dark";
};

const processIcons = [Search, Route, Layers, ClipboardList, Users, GitBranch] as const;

function SectionHeading({
  eyebrow,
  summary,
  title,
  tone = "light",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className="min-w-0 max-w-3xl">
      <p
        className={`break-words text-xs font-bold uppercase tracking-normal ${
          isDark ? "text-sky-200" : "text-sky-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-2 break-words text-2xl font-bold leading-tight sm:text-3xl ${
          isDark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-3 break-words text-sm leading-6 sm:text-base sm:leading-7 ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {summary}
      </p>
    </div>
  );
}

function CtaLink({
  href,
  icon,
  label,
  variant = "secondary",
}: {
  href: string;
  icon?: ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const className =
    variant === "primary"
      ? "border-slate-950 bg-slate-950 text-white hover:bg-slate-800"
      : variant === "ghost"
        ? "border-slate-300 bg-white text-slate-900 hover:border-sky-400 hover:text-sky-800"
        : "border-slate-300 bg-sky-50 text-slate-950 hover:border-sky-400 hover:text-sky-800";

  return (
    <Link
      className={`inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)] sm:w-auto ${className}`}
      href={href}
    >
      {icon}
      <span className="min-w-0 break-words">{label}</span>
    </Link>
  );
}

function SectionShell({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`border-t border-slate-200 ${className}`} id={id}>
      <div className="mx-auto w-full max-w-[100vw] px-5 py-12 sm:px-6 md:max-w-6xl md:px-8 md:py-16">
        {children}
      </div>
    </section>
  );
}

export function PmLandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav
          aria-label="PM 포트폴리오 섹션 이동"
          className="mx-auto flex w-full max-w-[100vw] flex-col gap-3 px-5 py-3 sm:px-6 md:max-w-6xl md:flex-row md:items-center md:justify-between md:px-8"
        >
          <Link
            className="min-w-0 break-words text-sm font-black uppercase tracking-normal text-slate-950"
            href="/pm"
          >
            LEE JAEHO / PM Portfolio
          </Link>
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {pmNavItems.map((item) => (
              <Link
                className="rounded-md px-2.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
              href="/resume"
            >
              <FileText aria-hidden="true" size={14} strokeWidth={2.4} />
              Resume
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[100vw] gap-8 px-5 py-12 sm:px-6 md:max-w-6xl md:grid-cols-[1.02fr_0.98fr] md:px-8 md:py-16 lg:gap-12">
          <div className="flex min-w-0 flex-col justify-center">
            <p className="break-words text-xs font-bold uppercase tracking-normal text-sky-700">
              {pmHero.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[calc(100dvw-2.5rem)] break-words text-3xl font-black leading-tight text-slate-950 [overflow-wrap:anywhere] sm:max-w-full sm:text-5xl">
              {pmHero.title}
            </h1>
            <p className="mt-5 max-w-[calc(100dvw-2.5rem)] break-words text-base leading-7 text-slate-700 [overflow-wrap:anywhere] sm:max-w-2xl sm:text-lg sm:leading-8">
              {pmHero.summary}
            </p>
            <div className="mt-7 flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
              <CtaLink
                href={pmHero.primaryCta.href}
                icon={<ArrowRight aria-hidden="true" size={16} strokeWidth={2.5} />}
                label={pmHero.primaryCta.label}
                variant="primary"
              />
              <CtaLink
                href={pmHero.secondaryCta.href}
                icon={<ClipboardList aria-hidden="true" size={16} strokeWidth={2.5} />}
                label={pmHero.secondaryCta.label}
              />
              <CtaLink
                href={pmHero.tertiaryCta.href}
                icon={<FileText aria-hidden="true" size={16} strokeWidth={2.5} />}
                label={pmHero.tertiaryCta.label}
                variant="ghost"
              />
            </div>
          </div>
          <PmArtifactStack />
        </div>
      </section>

      <SectionShell className="bg-slate-50">
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pmMetrics.map((metric) => (
            <article
              className="min-w-0 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              key={metric.label}
            >
              <p className="break-words text-2xl font-black text-slate-950 [overflow-wrap:anywhere]">
                {metric.value}
              </p>
              <h2 className="mt-2 break-words text-sm font-bold text-slate-950">
                {metric.label}
              </h2>
              <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                {metric.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeading
          eyebrow="Where I Create PM Impact"
          summary="채용자가 바로 판단할 수 있도록, 제가 강점을 보이는 제품 문제를 먼저 분리했습니다."
          title="제가 강점을 보이는 제품 문제"
        />
        <div className="mt-7 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          {pmFitSegments.map((segment, index) => (
            <article
              className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4"
              key={segment.title}
            >
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-white text-sm font-black text-sky-700 ring-1 ring-slate-200">
                {index + 1}
              </span>
              <h3 className="mt-4 break-words text-base font-bold text-slate-950">
                {segment.title}
              </h3>
              <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                {segment.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-slate-950 text-white">
        <SectionHeading
          eyebrow="Problem Framing"
          summary="단순히 기능을 만드는 사람이 아니라, 무엇이 흐름을 막고 비용을 만드는지 먼저 분해합니다."
          title="흩어진 요구를 PM 문제로 다시 정의합니다"
          tone="dark"
        />
        <div className="mt-7 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
          {pmProblemFrames.map((frame) => (
            <article
              className="min-w-0 rounded-md border border-white/15 bg-white/[0.06] p-5"
              key={frame.title}
            >
              <p className="break-words text-xs font-bold uppercase tracking-normal text-sky-200">
                {frame.title}
              </p>
              <h3 className="mt-2 break-words text-xl font-bold text-white">
                {frame.subtitle}
              </h3>
              <p className="mt-4 break-words text-sm leading-6 text-slate-300">
                {frame.problem}
              </p>
              <div className="mt-5 rounded-md border border-white/15 bg-slate-900 p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-sky-200">
                  PM 적용
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-white">
                  {frame.approach}
                </p>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white" id="process">
        <SectionHeading
          eyebrow="PM Operating System"
          summary="프로세스 소개가 아니라 판단 순서입니다. 문제를 정의하고, 흐름을 맞추고, 구현 가능한 범위로 줄입니다."
          title="저는 이렇게 제품 문제를 실행 기준으로 바꿉니다"
        />
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pmOperatingSystem.map((step, index) => {
            const Icon = processIcons[index] ?? ClipboardList;

            return (
              <article
                className="grid min-w-0 grid-cols-[auto_1fr] gap-4 rounded-md border border-slate-200 bg-slate-50 p-5"
                key={step.title}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-sky-700 ring-1 ring-slate-200">
                  <Icon aria-hidden="true" size={18} strokeWidth={2.4} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 break-words text-lg font-bold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell className="bg-slate-50" id="work">
        <SectionHeading
          eyebrow="Featured PM Case Studies"
          summary="기술 스택보다 문제 정의, 역할, PM 판단, 산출물을 먼저 볼 수 있도록 대표 프로젝트를 재구성했습니다."
          title="대표 프로젝트를 PM 관점으로 검증할 수 있게 정리했습니다"
        />
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
          {pmCaseStudies.map((caseStudy, index) => (
            <article
              className="flex min-w-0 flex-col rounded-md border border-slate-200 bg-white shadow-sm"
              key={caseStudy.title}
            >
              <div className="min-w-0 border-b border-slate-200 bg-slate-50 p-5">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                    PM Case {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
                    검증 가능 산출물 중심
                  </span>
                </div>
                <h3 className="mt-4 break-words text-2xl font-black leading-tight text-slate-950">
                  {caseStudy.title}
                </h3>
                <p className="mt-3 break-words text-sm leading-6 text-slate-700">
                  {caseStudy.summary}
                </p>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    Problem
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                    {caseStudy.problem}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    My Role
                  </p>
                  <p className="mt-2 break-words text-sm font-bold leading-6 text-slate-950">
                    {caseStudy.role}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    PM Judgment
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                    {caseStudy.decision}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    Artifacts
                  </p>
                  <ul className="mt-2 flex min-w-0 flex-wrap gap-1.5">
                    {caseStudy.artifacts.map((artifact) => (
                      <li
                        className="max-w-full break-words rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
                        key={artifact}
                      >
                        {artifact}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-auto break-words rounded-md bg-sky-50 p-3 text-sm leading-6 text-slate-700">
                  {caseStudy.outcome}
                </p>
              </div>
              <div className="border-t border-slate-200 p-5">
                <Link
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-950 transition hover:border-sky-400 hover:text-sky-800"
                  href={caseStudy.href}
                >
                  상세 보기
                  <ArrowRight aria-hidden="true" size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeading
          eyebrow="Before / After Impact"
          summary="수치를 과장하지 않고, PM 방식으로 정리했을 때 무엇이 명확해지는지 구분해 보여줍니다."
          title="개선 효과는 검증 가능한 표현으로만 씁니다"
        />
        <div className="mt-7">
          <PmComparisonTable />
        </div>
      </SectionShell>

      <SectionShell className="bg-slate-50" id="artifacts">
        <SectionHeading
          eyebrow="Product Artifacts"
          summary="원문 공개가 어려운 자료는 허위 링크를 만들지 않고, 어떤 상황에서 어떤 산출물을 만들었는지 유형으로 설명합니다."
          title="PM 역량은 산출물 유형으로 확인할 수 있습니다"
        />
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pmProductArtifacts.map((artifact) => (
            <article
              className="flex min-w-0 flex-col rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              key={artifact.title}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                  <FileText aria-hidden="true" size={17} strokeWidth={2.4} />
                </span>
                <h3 className="min-w-0 break-words text-base font-bold text-slate-950">
                  {artifact.title}
                </h3>
              </div>
              <p className="mt-4 break-words text-sm leading-6 text-slate-700">
                {artifact.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {artifact.items.map((item) => (
                  <li className="flex min-w-0 gap-2" key={item}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-emerald-600"
                      size={15}
                      strokeWidth={2.5}
                    />
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 text-xs font-bold uppercase tracking-normal text-slate-500">
                관련 프로젝트
              </p>
              <p className="mt-1 break-words text-sm font-bold text-slate-950">
                {artifact.project}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeading
          eyebrow="Collaboration Model"
          summary="PM은 혼자 문서를 쓰는 사람이 아니라, 직군별 판단 기준을 같은 곳에 정렬하는 사람이라고 봅니다."
          title="협업자는 다르지만 판단 기준은 하나로 맞춥니다"
        />
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pmCollaborationModel.map((model) => (
            <article
              className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-5"
              key={model.partner}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-sky-700 ring-1 ring-slate-200">
                  <Network aria-hidden="true" size={17} strokeWidth={2.4} />
                </span>
                <p className="break-words text-xs font-bold uppercase tracking-normal text-sky-700">
                  {model.partner}
                </p>
              </div>
              <h3 className="mt-4 break-words text-lg font-bold text-slate-950">
                {model.title}
              </h3>
              <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                {model.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-slate-950 text-white">
        <div className="grid min-w-0 gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-sky-200">
              Public-service Bridge
            </p>
            <h2 className="mt-2 break-words text-2xl font-bold leading-tight text-white sm:text-3xl">
              {pmPublicBridge.title}
            </h2>
            <p className="mt-4 break-words text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              {pmPublicBridge.summary}
            </p>
          </div>
          <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            {pmPublicBridge.points.map((point) => (
              <li
                className="flex min-w-0 gap-3 rounded-md border border-white/15 bg-white/[0.06] p-4 text-sm leading-6 text-slate-200"
                key={point}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-sky-200"
                  size={16}
                  strokeWidth={2.5}
                />
                <span className="min-w-0 break-words">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell className="bg-white" id="faq">
        <SectionHeading
          eyebrow="FAQ"
          summary="채용자가 전환 직전에 가질 수 있는 의문을 먼저 답합니다."
          title="과장 없이 PM 역량을 검증하는 방식"
        />
        <div className="mt-7 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          {pmFaqs.map((faq) => (
            <article
              className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-5"
              key={faq.question}
            >
              <h3 className="break-words text-base font-bold text-slate-950">
                {faq.question}
              </h3>
              <p className="mt-3 break-words text-sm leading-6 text-slate-700">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-slate-50" id="contact">
        <div className="grid min-w-0 gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
              Contact
            </p>
            <h2 className="mt-2 break-words text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
              {pmFinalCta.title}
            </h2>
            <p className="mt-3 break-words text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
              {pmFinalCta.summary}
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end">
            {pmFinalCta.links.map((link, index) => (
              <CtaLink
                href={link.href}
                icon={
                  index === 2 ? (
                    <Mail aria-hidden="true" size={16} strokeWidth={2.5} />
                  ) : index === 1 ? (
                    <FileText aria-hidden="true" size={16} strokeWidth={2.5} />
                  ) : (
                    <ArrowRight aria-hidden="true" size={16} strokeWidth={2.5} />
                  )
                }
                key={link.href}
                label={link.label}
                variant={index === 0 ? "primary" : "ghost"}
              />
            ))}
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
