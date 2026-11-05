/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Trophy } from "lucide-react";
import { AekkimVisual, BusanVisual } from "@/components/tracks/pm/editorial/PmVisuals";
import p from "@/components/tracks/pm/editorial/pm.module.css";
import s from "./axEditorial.module.css";
import { axProjects } from "./axEditorialContent";

export function JosEditorialVisual() {
  return <div className={s.josVisual}>
    <div className={s.josStatement}><span className={p.visualLabel}>J-OS · PERSONAL AI AGENT</span><p>기억한 맥락을,<br /><em>다음 업무로.</em></p><span>대화·자료 → 근거 선택 → 검토·실행</span></div>
    <a href="/ax/evidence/jos-report-fixture.png" target="_blank" rel="noreferrer" aria-label="J-OS 합성 자료 UI 검증 화면 크게 보기"><img src="/ax/evidence/jos-report-fixture.png" alt="출처와 적용 한계를 함께 보여주는 J-OS 보고서 UI" width={1280} height={720} /></a>
  </div>;
}

export function AxEditorialHome() {
  return <main id="ax-content" tabIndex={-1} className={p.container}>
    <section className={p.hero} aria-labelledby="ax-title">
      <p className={p.eyebrow}>이재호 · LOTTE AX Challenge 2026</p>
      <h1 id="ax-title">업무의 맥락을 읽고,<br /><span>AI 서비스를 구현합니다.</span></h1>
      <div className={p.heroBottom}><p>사용자의 요구를 화면과 데이터 흐름으로 옮기고,<br className={p.desktopBreak} /> AI가 찾은 근거와 실행 결과를 확인하며 개선했습니다.</p><a className={p.heroCta} href="#work">구현과 검증 사례 보기<ArrowDown size={19} aria-hidden="true" /></a></div>
    </section>
    <section className={p.work} id="work" aria-labelledby="work-heading">
      <div className={p.workHeading}><h2 id="work-heading">Selected Work<span>선택한 작업</span></h2><span>3개의 프로젝트</span></div>
      {axProjects.map((project, index) => <article key={project.slug} id={project.slug} className={p.project}>
        <div className={p.projectMeta}><div className={p.projectIdentity}><p><span>{String(index + 1).padStart(2, "0")}</span>{project.name}</p>{project.slug === "aekkim" && <span className={p.projectAward}><Trophy size={16} aria-hidden="true" />SSAFY 특화 프로젝트 우수상 · 팀 수상</span>}</div><span>{project.category}</span></div>
        <Link className={p.projectTitleLink} href={`/ax/${project.slug}/`}><h3>{project.title[0]}<br />{project.title[1]}</h3><ArrowUpRight className={p.projectArrow} aria-hidden="true" /></Link>
        <p className={p.projectSummary}>{project.summary}</p>
        <figure>{project.slug === "jos" ? <JosEditorialVisual /> : project.slug === "busan-eumgil" ? <BusanVisual /> : <AekkimVisual />}<figcaption>{project.caption}</figcaption></figure>
        <div className={p.projectBottom}><p>{project.contribution}</p><Link href={`/ax/${project.slug}/`}>사례 읽기<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </article>)}
    </section>
    <section className={p.method} id="approach" aria-labelledby="approach-heading">
      <div className={p.methodIntro}><h2 id="approach-heading">For LOTTE Chilsung</h2><p>같은 조건에서,<br />신제품의 선택 변화를.</p></div>
      <ol>
        <li><span className={p.methodNumber}>01</span><div><h3>시장·패널·상황을 고정해 비교하겠습니다.</h3><p>기존 시장에 신제품을 넣기 전후의 반응을 비교하는 가상시장을 기획하고 있습니다. NVIDIA Nemotron-Personas-Korea 기반 고유 가상 소비자 최소 1만 명을 구성할 계획입니다.</p><Link href="/ax/jos/">J-OS의 근거·버전·실행 관리<ArrowUpRight size={16} aria-hidden="true" /></Link></div></li>
        <li><span className={p.methodNumber}>02</span><div><h3>유효 반응·보류·기술 실패를 구분하겠습니다.</h3><p>가격·상황별 변화와 경쟁·대체 관계를 읽고, 현업이 후속 검증할 질문을 좁히는 것이 목표입니다. 사용할 수 있는 기업 자료가 있으면 보정과 별도 검증을 연결하겠습니다.</p><Link href="/ax/aekkim/">분석 결과와 사용자 판단을 잇는 흐름<ArrowUpRight size={16} aria-hidden="true" /></Link></div></li>
        <li><span className={p.methodNumber}>03</span><div><h3>현재는 기획·설계 단계입니다.</h3><p>공식 요건·공개 자료를 검토하고 지원서와 구조를 설계했습니다. 시장 DB·시뮬레이터 구축과 1만 명 실행은 미완료이며, 실제 소비자 예측 정확도는 미검증입니다.</p><a href="/ax/evidence/verification-summary.txt">공개용 근거 요약<ArrowUpRight size={16} aria-hidden="true" /></a></div></li>
      </ol>
    </section>
    <section className={s.supporting} aria-labelledby="supporting-heading"><h2 id="supporting-heading">More Work</h2><div><Link href="/pm/smile-game/"><span>웃지마게임 · PM·조사·FE</span><strong>흥미와 참여 의향을 따로 읽은<br />168건의 설문 분석</strong><ArrowUpRight aria-hidden="true" /></Link><Link href="/pm/play-pick/"><span>Play Pick · 팀장·FE</span><strong>선호·중립·비선호를 구분한<br />첫 추천 온보딩</strong><ArrowUpRight aria-hidden="true" /></Link></div></section>
  </main>;
}
