# PM 포트폴리오 개선 구현·검증 기록

작업일: 2026-09-14. 대상은 기존 포트폴리오의 독립 복사본이다. 원본 `/pm/`과 상세 페이지, 루트, 이력서, `/PM1/`은 보호 대상이다.

이후 카피·캡션 정리와 부산이음길 기여 복원은 [후속 수정·검증 기록](pm-improved-copy-followup.md)에 정리했다. 아래는 최초 개선 작업의 기록이다.

## 경로와 구현 구조

| 구분 | 메인 | 상세 slug |
| --- | --- | --- |
| 원본 | `/pm/` | `smile-game`, `aekkim`, `busan-eumgil`, `play-pick` |
| 개선본 | `/PM/` | 동일한 네 slug |
| 개선본 내부 소스 라우트 | `src/app/pm-improved/` | `[slug]/page.tsx` |

Next.js 16.2.6 App Router, React 19, TypeScript, CSS Modules를 사용한다. `npm run build`는 `next build`, `npm run start`는 `next start`다. `next.config.ts`의 `trailingSlash: true`, 이미지 unoptimized 설정은 유지했다. README의 과거 정적 export 설명과 현재 설정은 다르다. 현재 설정에는 `output: "export"`가 없고, 운영 응답은 `server: Vercel`, `x-matched-path: /pm`이다.

새 `src/proxy.ts`는 요청 pathname이 정확히 `/PM`이거나 `/PM/`으로 시작할 때만 `/pm-improved`로 내부 rewrite한다. 문자열 비교는 대소문자를 구분하며 query를 보존한다. 정규식 matcher가 넓게 매칭하더라도 소문자 `/pm/`에는 `NextResponse.next()`를 반환한다. `/PM1/`은 대상이 아니다. 외부 URL은 `/PM/`으로 유지된다. 기존 trailing slash 정책을 그대로 사용한다. 허용된 네 slug도 대소문자를 구분해 검사한다. 검증 중 Windows의 정적 페이지 조회가 대문자 slug를 허용하는 경우를 발견해, 파일 조회 전 404를 반환하도록 보완했다.

이 방식은 Next 서버/Vercel 환경을 전제로 한다. 정적 export 파일 업로드만으로 proxy가 실행되지는 않는다. 참고: [Next.js Proxy 공식 문서](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).

기존 공용 파일을 수정하지 않고 라우트·컴포넌트·콘텐츠·CSS를 복제했다. 폴더를 `pm`/`PM`으로 만들지 않아 Windows 파일시스템에서 충돌하지 않는다. 기존 `/pm/fonts/`, `/pm/previews/`와 이미지 파일은 읽기 전용으로 공유한다. 복사본의 CSS Module 클래스는 별도 범위이며 전역 reset이나 body 스타일을 추가하지 않는다.

## 작업 전 기준선과 복제 순서

- 시작 HEAD: `bd1904b45555e47fc0b91bb208c6d17e58b8f4f3`.
- 기존 수정·미추적 파일은 [baseline.json](pm-improved/baseline.json)의 Git 상태에 기록했다. 기존 변경사항을 정리하거나 커밋하지 않았다.
- 기존 source/public/config 168개 파일 각각의 SHA-256은 [baseline-files.tsv](pm-improved/baseline-files.tsv)에 있다. manifest 자체의 digest도 baseline.json에 기록했다.
- 원본 라우트 3개와 editorial 컴포넌트·콘텐츠·CSS 10개를 먼저 바이트 단위로 복제하고 [clone-check.json](pm-improved/clone-check.json)에 대응 관계와 동일성을 기록했다.
- 그다음 복사본의 import 경로·공개 페이지 링크·canonical/OG만 변경했다. 개선 작업 전에 5개 페이지의 main 콘텐츠와 모든 main 링크가 원본과 같은지 브라우저로 검증했다. 영상 재생 버튼의 재생/일시정지 상태만 정규화했다. [clone-browser-check.json](pm-improved/clone-browser-check.json).
- 초기 비교에서 화면 크기에 따라 CSS로 숨긴 텍스트가 innerText에 다르게 포함됐다. 이를 콘텐츠 차이로 취급하지 않고 main.textContent로 모든 텍스트를 다시 대조해 5개 모두 동일함을 확인했다.
- 기준 캡처: [원본 데스크톱](pm-improved/original-local-desktop.png), [원본 모바일](pm-improved/original-local-mobile.png), [복제 직후 데스크톱](pm-improved/clone-desktop.png). 복제 직후 모바일 캡처는 뷰포트 전환 중 빈 화면으로 저장되어 검증 증거에서 제외했다. 복제본의 모바일 픽셀 동일성을 통과로 기록하지 않는다. 최종 개선본은 안정화된 모바일 화면으로 별도 검사한다.
- 개발 서버가 자동 생성한 `next-env.d.ts`의 라우트 타입 경로 차이는 최종 빌드 뒤 작업 전 바이트로 복원했다. SHA-256 `7b550dda9686c16f36a17bf9051d5dbf31e98555b30d114ac49fc49a1e712651`이 기준선과 일치한다. Git 상태의 기존 수정 표시는 남아 있으며 사용자 변경을 Git HEAD 버전으로 되돌리지 않았다.

2026-09-14 운영 사이트 `/pm/` 및 상세 4개, `/resume/`의 서버 렌더링 main 텍스트는 로컬 원본과 모두 일치했다. 운영 `/PM/`은 이 작업 전 HTTP 404이며 리다이렉트가 없었다. [production-baseline.json](pm-improved/production-baseline.json).

## 사실 확인과 표현 경계

근거는 현재 원본 페이지, `docs/pm-redesign/2026-09-11-editorial-audit.md`, 기존 기록 발췌 및 데모 capture manifest다. 이번 작업에서 프로젝트 원본 전체나 원응답 데이터·공식 상장을 새로 검증한 것으로 표현하지 않는다. 미공개 source 발췌에 대한 새 공개 링크는 추가하지 않는다.

| 프로젝트 | 개인 작업으로 표현 가능한 범위 | 팀·공동 작업 및 제한 |
| --- | --- | --- |
| 웃지마게임 | 설문 설계·168건 분석, 기획·결정 기록, 친구 초대방 생성·입장·대기와 오류 수정 | 친구 우선·랜덤 병행은 팀 결정. AI 모델·배틀 판정 연동은 다른 담당자. 랜덤 매칭 영상은 팀 시연. 출시 후 참여율·모델 정확도 자료 없음 |
| 애낌 | 사후 요구사항·화면명세 갱신, 초기 후보 확인 UI, 제외 상태, 중복 후보·미확인 결제 건수 표시 | 생성 요청·실패 처리는 김응서, 번들은 박규빈의 보완. 최종 데모는 공동 결과. Android MVP·우수상은 팀 결과. 절감액·실사용자 지표 없음 |
| 부산이음길 | FE·문서 담당, 글자 크기 즉시 저장, 승인 제보 마커·하단 패널, 상태·사진 조건 및 구현 범위 갱신 | 경로 계산·공간 데이터 구축은 팀 BE·AI 범위. 온보딩 영상은 지도 제보나 현장 보행 증거가 아님. 이동 안전성·경로 품질 미검증 |
| Play Pick | 팀장·FE·온보딩 응답 저장, 선호 저장 처리, 완료 후 다음 화면 연결 | 핵심 검색·추천 엔진과 데이터 수집·배포는 임경수 담당. 예시 계정·보관 데이터 로컬 재현. 추천 품질·전환율 미측정 |

경력은 부산참여연대 `2021-05-01~2025-02-28`로 기존 경력증명서 점검 기록과 `career-scope.txt`가 일치한다. 3년 10개월은 공공자료 분석 실무 기간이며 PM 재직 기간으로 표시하지 않는다.

숫자: 웃지마게임 Q7 흥미 긍정 92/168, Q8 사용 의향 긍정 75/168, Q9 얼굴 공개 꽤/매우 부담 112/168이다. 66.7%는 112÷168×100의 소수 첫째 자리 반올림이며 서로 다른 문항 간 차이는 이탈률이 아니다. 설문은 분석 PDF 기준이고 원응답은 확보되지 않았다. Play Pick의 호불호 8개는 명세상 완료 규칙이며 실험으로 검증된 최적값이 아니다.

## 공개 화면에서 제외하거나 한정한 내용

- 애낌 팀 인원·정확한 시작/종료일은 확인되지 않아 추정하지 않는다. 원본의 `2026.03`과 파트 구성만 사용한다.
- 애낌 수상은 기존 `프로젝트 우수상 · 팀 수상` 명칭만 유지한다. 공식 상장 미확보 상태에서 수상 등급·순위·규모를 새로 붙이지 않는다.
- 웃지마게임의 오래된 `smile-decisions.txt` 마지막 문장은 공개 영상을 친구 초대 시연으로 설명하지만 현재 영상 컴포넌트·미디어 편집 기록은 랜덤 매칭을 가리킨다. 현재 미리보기를 친구 초대 직접 증거로 사용하지 않는다. 기록 기반 흐름 정리는 실제 화면 캡처로 표시하지 않는다.
- Play Pick 온보딩 명세 초안의 작성일 `2024-12-22`와 구현 커밋 `2025-12-22`가 다르다. 현재 페이지와 커밋에 맞춰 `2025.12` 구현 시기를 유지한다.
- 부산이음길 현장 사용자 테스트, 애낌 비용 절감, 웃지마게임 참여·재대결 지표, Play Pick 추천 품질·전환 개선은 확인된 성과로 넣지 않는다.
- 회고 경험·개인 제안·협업 의사결정 근거를 창작하지 않는다. 후속 확인은 향후 검증 계획으로 표시한다.

## 주요 구현 파일과 변경 내용

| 새 파일/범위 | 역할 |
| --- | --- |
| `src/app/pm-improved/page.tsx`, `layout.tsx`, `[slug]/page.tsx` | 별도 페이지 진입점과 네 상세 경로. canonical·OG URL은 `/PM/`, 기존 noindex/nofollow 정책 유지 |
| `src/proxy.ts` | 대문자 공개 경로만 내부 개선본으로 연결하는 최소 공용 진입점 |
| `src/components/pm-improved/content.ts` | 순서, 문제, 역할·행동, 개인 산출물·팀 결과, 확인된 기간·인원 |
| `PmEditorialHome.tsx`, `home.module.css` | 지원자 중심 Hero, 짧은 경력 연결, 같은 순서의 카드, Experience |
| `PmCaseStudy.tsx`, `caseStudy.module.css` | 공통 상단 요약과 일곱 본문 섹션, 목차·다음 프로젝트 |
| `PmSupportingCase.tsx`, `PmAekkimCase.tsx`, `PmPlayPickCase.tsx`, `playPick.module.css` | 네 프로젝트의 근거·판단·실행·협업·검증 범위 |
| `PmVisuals.tsx`, `visuals.module.css` | 설문·친구 초대 결정 흐름, 부산 설정·제보 표시 조건 등 근거와 맞는 대표 자료 |
| `PmVideoPreview.tsx`, `PmHeader.tsx`, `PmShell.tsx`, `pm.module.css` | 수동 영상 재생, `/PM/` 내 내비게이션, 접근성·기존 디자인을 유지한 독립 복사본 |
| `scripts/check-pm-improved.mjs` | 원본 해시·HTML·URL·링크·메타데이터·RSC 검증 재실행 도구 |

위 컴포넌트 파일은 모두 `src/components/pm-improved/` 아래에 있다. `next.config.ts`, 공용 CSS·데이터·기존 컴포넌트는 수정하지 않았다. 새 의존성을 설치하지 않았다.

Hero는 이름·PM 직무와 조사 → 요구사항 → 화면·API의 연결을 먼저 보여주고, 공공자료 분석 경력을 별도로 설명한다. 카드 순서는 웃지마게임 → 애낌 → 부산이음길 → Play Pick이며 문제 → MY ROLE·행동 → RESULT(개인/팀) → 기간·구성 → 상세 CTA → 자료 순서로 통일했다. 상세는 상단 결론 뒤 Problem, Evidence, Decision, Action, Collaboration, Result & Validation, Learning을 배치했다. 기술 세부사항은 Play Pick의 접이식 보조 영역으로 옮겼다.

기존 크림 배경, 파란 강조색, Pretendard, 선을 활용한 편집형 레이아웃과 자산을 유지했다. 영상은 모두 기본 정지 상태이며 사용자가 누르면 재생된다. 웃지마게임의 랜덤 매칭 영상과 부산 온보딩 영상은 팀/보조 시연으로 내려, 개인 담당 작업의 직접 증거처럼 보이지 않게 했다.

## 최종 검증

최종 프로덕션 빌드를 `next start`로 `http://127.0.0.1:3211`에서 실행해 확인했다.

| 검사 | 실제 결과 |
| --- | --- |
| 보호 파일 | 기준선 168개 모두 SHA-256 동일. 원본·자산·루트·이력서·기존 사용자 변경 보존 |
| 기존 테스트 | `node --test`로 `src`의 기존 `*.test.mjs` 실행: 74 통과, 0 실패 |
| 타입 | `npx tsc --noEmit --pretty false` 통과. 최종 Next 빌드의 TypeScript 검사도 통과 |
| lint | `npm run lint`: 오류 0, 기존 무관한 파일의 경고 92개. 개선본·proxy·검증 스크립트 오류 없음 |
| build | `npm run build` 성공. 정적 페이지 25개 및 Proxy 생성 |
| 기존 링크 검사 | `node scripts/check-pm-links.mjs http://127.0.0.1:3211`: 기존 14페이지, 로컬 대상 46개 통과 |
| 개선본 검사 | `node scripts/check-pm-improved.mjs http://127.0.0.1:3211 docs/pm-improved/http-checks.json`: 13경로, 로컬 대상 62개, slash/query 리다이렉트 5개, RSC 요청 4개 통과 |
| 대소문자 | `/pm/`은 원본, `/PM/`은 개선본. `/PM`은 308로 `/PM/`에 연결. 미등록·잘못된 대문자 slug는 404 |
| 직접 접근·새로고침 | 네 상세 모두 H1·대문자 canonical 유지 |
| 내부 이동 | 홈 카드 → 상세 → 다음 프로젝트 4개 순환, 상세 뒤로 가기, 로고 모두 `/PM/` 유지 |
| 반응형 | 너비 1440·768·390·360 × 메인/상세 5페이지 = 20조합에서 문서 가로 넘침·깨진 이미지 없음 |
| 영상 | 기본 정지·자동재생 없음. 네 영상 수동 재생 및 정지 성공, readyState 4, 미디어 오류 없음 |
| 키보드 | 첫 Tab이 본문 건너뛰기 링크, Enter로 main 포커스. 메뉴 Enter 열기, Escape 닫기·summary 포커스 복귀, 링크 선택 후 닫기. 파란 3px 포커스 표시 확인 |
| 원본 동작 | 원본 `/pm/` H1·canonical 유지. 기존 루트 잠금 해제 성공, 원본 이력서 정상 표시 |
| 콘솔 | 최종 프로덕션 QA 탭에서 오류·경고 0 |
| 콘텐츠 | 역할·결과가 미디어보다 앞에 있음, 개인/팀 구분, 프로젝트별 역량 차이, 일곱 본문 섹션, placeholder·미공개 source 링크 없음 |

세부 결과: [HTTP 검사](pm-improved/http-checks.json), [반응형 검사](pm-improved/responsive-checks.json), [브라우저 조작 검사](pm-improved/browser-checks.json).

반응형 측정에서 발견된 내부 scrollWidth 차이는 의도적으로 1px로 숨긴 접근성 설명뿐이며 실제 문서 너비는 모두 일치했다. 첫 홈 로드의 폰트 스왑 중 한 측정은 fontLoaded=false였고, 최종 홈에서 Pretendard 로드 후 너비와 화면을 다시 확인해 캡처했다. 영상 검사에서는 새로고침 직후 첫 클릭 한 번이 재생으로 이어지지 않아 실제 상태를 확인한 뒤 안정화된 페이지에서 재생을 재검증했다. 이후 세 영상은 load 완료를 기다린 뒤 한 번의 클릭으로 재생됐다.

동일한 데스크톱 크기의 [원본 최종 화면](pm-improved/original-final-desktop.png)과 [개선본 최종 화면](pm-improved/improved-desktop.png)을 비교했다. [개선본 전체](pm-improved/improved-desktop-full.png), [모바일 메인](pm-improved/improved-mobile.png), [웃지마게임 모바일](pm-improved/smile-game-mobile.png), [애낌 데스크톱](pm-improved/aekkim-desktop.png), [부산이음길 모바일](pm-improved/busan-eumgil-mobile.png), [Play Pick 데스크톱](pm-improved/play-pick-desktop.png)도 직접 육안 점검했다.

실제 모바일 기기·Safari·다른 브라우저의 검증이나 채용담당자를 대상으로 한 사용자 테스트는 수행하지 않았다. 아래는 메인 화면과 카드를 읽으며 수행한 30초 질문 자체 점검이다.

| 질문 | 메인에서 찾을 수 있는 답 |
| --- | --- |
| 지원 직무 | 이재호 · Product Manager |
| 차별적인 강점 | 공공자료 분석 경험을 요구사항·화면·API로 연결한 작업 |
| 대표 프로젝트 | 첫 카드 웃지마게임: 조사·문제 정의·우선순위 |
| 직접 한 일 | 설문 설계·168건 분석, 기획·결정 기록, 친구 초대방 생성·입장·대기 구현 |
| 면접에서 물을 경험 | 참여 부담과 팀 우선순위의 관계, 명세와 구현의 변경 관리, 중립 응답·저장 실패·완료 조건 처리 |

## 배포 상태

현재 작업은 로컬 소스 구현 및 검증 범위다. 운영 배포·Git push·commit은 수행하지 않았다. 기존 Vercel 프로젝트의 승인된 배포 절차와 대상 브랜치가 이 작업에서 확인되지 않았으므로 새 프로젝트나 배포 경로를 임의로 만들지 않았다. `https://ficstory.dev/PM/`에 반영됐다고 보고하지 않는다. 배포 후에는 위 대문자 메인·상세 직접 접근·새로고침·RSC 이동·slash/query와 원본 경로를 다시 확인해야 한다.

작업 분담은 실제 세션 turn_context로 Luna/medium(근거 조사), Terra/medium(복제·메인 초반), Sol/high(상세·메인 마무리)을 확인했고, 전체 판단과 최종 검증은 Astra/xhigh에서 수행했다. Terra 메인 작업이 완료되지 않아 정책에 따라 Sol이 마무리했다. 외부 유료 API 경로·프로바이더·설정 변경은 없다.

## 후속 반영: 사용자 이력서 연결

2026-09-14 사용자가 제공한 `[PM 신입·주니어 지원]이재호_이력서.docx`를 개선본 경력·이력서에 연결했다. 같은 폴더의 동일 이름 PDF는 2쪽이며, Word의 모든 비어 있지 않은 문단이 PDF 추출 텍스트에 포함됨을 확인했다. 두 PDF 페이지를 렌더링해 글자·페이지 경계도 확인했다. 문서 내용은 수정하지 않았다.

- 자산은 `public/pm-improved/resume/lee-jaeho-pm-resume.pdf` 및 `.docx`로 복사했다. 원본과 복사본의 SHA-256이 각각 동일하다.
- `resume.ts`에 파일 경로를 두고 `PmHeader.tsx`의 데스크톱·모바일 이력서 링크를 PDF 새 탭 열기로 연결했다.
- `PmEditorialHome.tsx`의 Experience에 `이력서 보기 (PDF)`와 `Word 원본 다운로드`를 추가했다. Hero의 경력·이력서 버튼은 기존처럼 경력 섹션으로 연결한다.
- `home.module.css`에서 모바일 두 버튼을 44px 높이와 전체 너비로 배치했다. 새 탭 안내, 다운로드 파일명, 기존 포커스 표시와 모바일 메뉴 닫기를 유지했다.
- `/pm/`, `/resume/`, 원본 문서는 수정하지 않았다. 첨부 이력서의 내용을 근거로 기존 프로젝트 설명이나 숫자를 추가 변경하지 않았다.

추가 검증: 대상 파일 lint 및 최종 프로덕션 build/TypeScript 통과. 보호 파일 168개 동일, 13경로·로컬 대상 63개·slash 5개·RSC 4개 재검증 통과. PDF/DOCX 모두 HTTP 200, 올바른 MIME과 원본 바이트 일치. PDF 버튼과 모바일 메뉴에서 새 탭 열기 및 메뉴 닫기 확인. 390px 모바일에서 문서 가로 넘침 없음, 두 버튼 331×44px 확인. 콘솔 오류·경고 없음. 작업자 실제 turn_context는 `gpt-5.6-terra` / `medium`으로 확인했다.

검증 기록: [경로 검사](pm-improved/resume-http-checks.json), [파일 응답·해시](pm-improved/resume-assets-check.json), [브라우저 검사](pm-improved/resume-browser-checks.json). 로컬 서버만 재빌드·재시작했으며 운영 배포는 수행하지 않았다.
