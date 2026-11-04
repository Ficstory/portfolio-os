/* Verified sources: docs/ax/README.md J1–J3. */
/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { PrintSlide } from "./PmPrintPortfolio";
import p from "./PmPrintPortfolio.module.css";
import s from "./PmPrintAgentSlides.module.css";
function Evidence({ src, alt, caption, phone = false }: { src: string; alt: string; caption: string; phone?: boolean }) {
  return <figure className={`${p.evidenceImage} ${phone ? p.phoneImage : ""}`}><img src={src} alt={alt} loading="eager" /><figcaption>{caption}</figcaption></figure>;
}
function Meta({ period, team, role }: { period: string; team: string; role: string }) {
  return <dl className={p.projectMeta}><div><dt>자료 확인</dt><dd>{period}</dd></div><div><dt>구성</dt><dd>{team}</dd></div><div><dt>내 역할</dt><dd>{role}</dd></div></dl>;
}
function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return <li><span>{n}</span><div><strong>{title}</strong><p>{children}</p></div></li>;
}

export const agentSlides: PrintSlide[] = [
  {
    id: "pm-print-jos-intro",
    eyebrow: "Project 01 · 개인 AI Agent 플랫폼",
    title: "J-OS",
    content: (<div className={p.introGrid}><div className={p.introCopy}><p className={p.lead}>대화가 끝나도 이어지는 업무 맥락</p><p>기억·지식 검색부터 역할별 검토와 도구 실행까지, 개인용 AI Agent 플랫폼을 직접 기획·개발·운영했습니다.</p><section className={p.problemBox}><span>USER PROBLEM</span><p>새 대화마다 이전 결정과 자료를 다시 설명해야 했습니다. 필요한 근거를 찾아 다음 업무와 실행으로 연결하고자 했습니다.</p></section><Meta period="2026.11.04" team="개인 프로젝트" role="서비스 기획 · React 웹 · Fastify API · SQLite · 개인 운영" /></div><Evidence src="/pm-improved/evidence/jos-report-fixture.png" alt="J-OS 보고서와 인용 근거 표시 화면" caption="실제 서비스 화면 · 예시 원문과 응답으로 구성" /></div>),
  },
  {
    id: "pm-print-jos-memory",
    eyebrow: "J-OS · 핵심 기여 01",
    title: "요약과 원문을 구분하고, 검색 결과에 근거 위치를 붙였습니다.",
    content: (<div className={p.playFlowLayout}><ol className={p.pipeline}><li><span>01 · 입력</span><strong>대화와 등록 자료</strong><p>요청·이전 결정·원문을 보존</p></li><li><span>02 · 기억</span><strong>원문과 파생 정보 분리</strong><p>출처 해시·원문 범위·처리 위치 기록</p></li><li><span>03 · 검색</span><strong>근거 구절 선택</strong><p>범위·활성 버전·인용 위치 전달</p></li><li><span>04 · 응답·실행</span><strong>답변과 역할별 검토</strong><p>도구 실행 단계·결과 보존</p></li></ol><ol className={p.outputSteps}><Step n="01" title="요약을 원문과 같은 사실로 취급하지 않았습니다.">파생 기억의 출처를 남겨 원문으로 되짚을 수 있게 했습니다. 어떤 자료가 답변의 근거인지 확인하는 구조입니다.</Step><Step n="02" title="검색과 실행을 하나의 서비스 흐름으로 연결했습니다.">문서 버전·인용 ID와 구절을 전달합니다. API가 실행 모듈을 불러 수행하고 SQLite에 단계와 결과를 저장합니다.</Step></ol></div>),
  },
  {
    id: "pm-print-jos-execution",
    eyebrow: "J-OS · 핵심 기여 02",
    title: "중단된 작업을 이어가고, 완료한 결과는 보존했습니다.",
    content: (<div className={p.deliveryGrid}><ol className={p.outputSteps}><Step n="01" title="작업 순서와 실행 한도를 정했습니다.">먼저 끝나야 하는 작업과 독립적으로 진행할 작업을 나눴습니다. 단계별 결과를 저장하고 실행 시간과 모델 호출 횟수에 한도를 두었습니다.</Step><Step n="02" title="같은 작업을 중복 실행하지 않도록 했습니다.">요청과 실행 상태를 확인해 중복 실행을 막았습니다. 다시 시작할 때는 완료한 결과를 재사용하고, 실패한 작업과 관계없는 단계는 계속 진행하게 했습니다.</Step></ol><div className={p.documentStack}><span>EXECUTION STATE</span><p>완료 · 산출물·근거 보존</p><p>부분 완료 · 단계별 분리</p><p>실패 · 원인·재개 위치</p></div><div className={`${p.criteriaNotes} ${s.fullWidth}`}><section><span>중단·실패 상황을 재현해 확인했습니다.</span><p>취소 후 재시작, 일부 단계 실패, 호출 한도 초과를 재현했습니다. 완료된 결과와 남은 작업을 구분해 이어갈 수 있는지 확인했습니다.</p></section><section><span>업데이트 과정에서 데이터를 지켰습니다.</span><p>운영 서버에 새 버전을 적용하며 데이터베이스를 백업하고, 별도 환경에서 복원을 확인했습니다. 요청을 접수하는 방식도 개선해 서비스에 반영했습니다.</p></section></div></div>),
  },
];
