# LOTTE AX Challenge 2026 제출용 포트폴리오

확인 기준: 2026-11-04, Asia/Seoul. 외부 배포·대회 제출 없이 콘텐츠 작성, 로컬 구현, PDF 제작과 검수를 수행했다.

## 결과물

- 웹: http://127.0.0.1:3227/ax/
- 인쇄 화면: http://127.0.0.1:3227/ax/print/
- 제출 PDF: `output/pdf/ax/lee-jaeho-lotte-ax-2026.pdf`
- 같은 본문 텍스트: `output/pdf/ax/lee-jaeho-lotte-ax-2026.txt`
- 공개 가능한 근거 설명: `public/ax/evidence/verification-summary.txt`
- PDF 수치 검수: `output/pdf/ax/lee-jaeho-lotte-ax-2026.qa.json`
- 최종 PDF: 2,655,449바이트(약 2.66MB), 12쪽. 모든 페이지는 16:9다.
- PDF 페이지 이미지: `output/pdf/ax/qa/page-01.png`부터 `page-12.png`
- HTTP 검사 기록: `docs/ax/link-check.json`
- Lighthouse 원 결과: `docs/ax/lighthouse.json`

사용자 수정 지시를 반영해 PDF를 전면 재편집했다. **PDF는 항상 16:9**로 유지하며, 현재 1280 × 720 CSS px / 960 × 540 PDF pt이다. 최종 검사 스크립트는 모든 페이지의 16:9 비율을 검사하고 다른 비율이면 실패한다. 12쪽은 편집 선택이며 공식 페이지 제한이 아니다.

웹은 기존 PM의 CSS·영상 컴포넌트를 직접 재사용하는 홈과 세 개 상세 페이지(`/ax/jos/`, `/ax/busan-eumgil/`, `/ax/aekkim/`)로 구성했다. PDF는 별도 `AxPrintDeck.tsx`에서 같은 근거를 16:9 화면에 맞춰 요약 편집한다. 웹과 PDF를 같은 긴 문서 레이아웃으로 강제하지 않는다. 기존 Next.js·React·CSS Modules·lucide를 사용했고 새 프레임워크나 프로젝트 의존성은 추가하지 않았다. 기존 `/pm/` 소스는 변경하지 않았고 새 경로는 noindex다.

AX 페이지의 글꼴은 기존 라이선스가 있는 Pretendard를 현재 AX·재사용 PM 컴포넌트의 문자로 부분 추출했다. 2,057,688바이트에서 101,292바이트로 줄였으며 파생 글꼴 이름은 AX Portfolio Sans로 변경하고 OFL 원문을 동봉했다. 기존 PM 글꼴은 보존했다. 일회성 변환 도구 fonttools·brotli는 `.codex_tmp/ax-font-tools`에만 설치했으며 프로젝트 의존성과 전역 Python 환경은 변경하지 않았다.

## 기존 구성에서 바꾼 판단

기존 `/pm/`의 큰 단독 표지, Selected Work, 프로젝트 제목·요약, 넓은 시연 패널, 사례 상세 이동을 직접 재사용했다. J-OS를 첫 사례로 배치하고 부산·애낌은 기존 영상 컴포넌트를 그대로 사용한다. PDF는 4:3 문서 배치를 폐기하고 큰 제목·핵심 판단·화면이 중심인 16:9로 다시 구성했다.

| 쪽 | 구성 | 분량을 정한 이유 |
| --- | --- | --- |
| 1 | 지원자 소개·대표 근거·목차 | 업무 이해, 구현, 검증의 흐름을 먼저 제시 |
| 2–5 | J-OS 소개 / 구조 / 검색 개선 / 실행·운영 | 개인 기여와 원 평가 산출물이 가장 깊음 |
| 6–7 | 부산이음길 인터뷰·접근성 / 지도·경로·TTS | 현장 요구가 앱 동작으로 옮겨지는 과정 |
| 8–9 | 애낌 분석 흐름 통합 / 상태 보존·실패 처리 | 팀 모델을 서비스 흐름으로 연결한 기여 |
| 10 | 웃지마게임·Play Pick | 조사 응답과 행동, 중립과 비선호 구분이라는 보완 근거 |
| 11 | 롯데칠성음료 과제 적용 | 현재 기획·설계 단계에 맞춘 구현·검증 방향 |
| 12 | 주요 주장·근거·한계·연락처 | 비공개 저장소 없이 판단할 수 있는 요약 |

## 주요 주장과 원 근거

아래의 로컬 경로는 작성·검수용이다. 제출 PDF에는 원 자료의 식별명, 집계, 구조와 역할 경계를 담고 비공개 자료 본문은 싣지 않았다.

| ID | 채택한 주장과 근거 | 범위·제외한 주장 |
| --- | --- | --- |
| J1 | `ai-agent-platform/docs/foundation/ARCHITECTURE.md`의 memory/knowledge/실행 구조와 README. React/Vite, Fastify, SQLite 및 API가 불러 쓰는 실행 모듈 | 별도 분산 실행 큐로 설명하지 않음 |
| J2 | `KNOWLEDGE_EVIDENCE_COVERAGE_20261024.md`, `oracle-baseline.json`, `oracle-candidate.json`, `local-oracle-evaluate.mjs`. 코퍼스·기준 해시 대조, strictPass 6→10/14 재집계 | 기본 325개, 미끼 검사는 고정 합성 1개를 더한 326개. 산술 질문의 검색 필요 판정 불일치를 실패에 포함. 최종 답변 정확도·운영 성능으로 일반화하지 않음 |
| J3 | `EXECUTION_FOUNDATION_20261010.md`, `YUNA_ENTRY_DEPLOYMENT_20261030.md`, README. 실행 키·의존관계·임대·예산·산출물 기록과 백업·릴리스 운영 기록 | 로컬 fixture와 실제 외부 시스템 완료를 분리. Docker 부재로 막힌 종단 검증을 완료로 쓰지 않음 |
| B1 | 부산이음길 4/10 함세상 인터뷰 결과, 4/9 PRD, 9/26 기여 분석 v2. 문서 Git 작성 기록 fdf5c02a·7f4940ef | 최초 연락·인터뷰 진행은 본인 확인 기록. 팀 의사결정 전체를 개인 소유로 쓰지 않음 |
| B2 | `RouteGeometryParser.kt`, `TextToSpeechController.kt`, `TextSizeSettingViewModel.kt`, 인증·정리 관련 커밋과 원 시연 | 본인 Android FE·기획과 팀 AI 탐지·경로 서버 구분. 현장 안전성·이동 시간 효과 미측정 |
| A1 | `AnalysisPipelineOrchestrator.kt`, `OnDeviceAiResolver.kt`, 기여 분석 v2, c516317·9f193c3·97ac7e3 | FastText·XGBoost·추론 엔진은 백수연 구현. 본인은 분석 흐름·계약·대체 처리·결과 상태·확인 화면 통합 |
| A2 | `SubscriptionRepository.kt`와 d5ffadd의 동일 seed 재초기화 방지. `OnDeviceAiContractsTest.kt`의 기존 JSON 계약 검사. 오프라인 데모 기록. 3/30 상장 원본 이미지 | Android 테스트를 이번에 재실행하지 않음. UI 데모는 실제 결제·모델 추론의 검증이 아님. 후속 등록 실패 처리는 팀원 기여 포함. 우수상은 5인 팀 수상 |
| S1 | 원본 `260115_설문조사결과_분석.pdf` 전체 텍스트 확인: 1쪽 n=168, 3쪽 흥미 92, 4쪽 의향 75, 7쪽 공개 부담 56+56. 15쪽 작성자 이재호 | 원 응답 데이터 미확보. 성별·연령 편중을 표시. 기존 분석 보고서의 예상 전환 효과나 인과 주장은 채택하지 않음 |
| S2 | 원본 온보딩 명세·커밋과 `docs/pm-redesign/play-pick-demo/README.md`. 8개 저장과 첫 추천 조회 기록 | 8개는 구현 기준. 추천 엔진은 팀원. 정확도·전환율 최적화로 쓰지 않음 |
| L1 | 11/4 공식 공고와 펼친 FAQ를 브라우저에서 확인. 과제 요구·마감·공개 평가축 | 평가축을 예선 확정 배점으로 쓰지 않음. 로그인된 최신 제출폼의 첨부 개수·용량 단위 미확인 |
| L2 | 롯데 프로젝트의 `application-draft-2026-11-04.md`, `persona-choice-architecture-2026-11-03.md`, README | Nemotron 소스 검토·구조 설계와 데이터 분석·구현 완료를 분리. 시장 DB·1만 명 실행·시뮬레이터는 미완료 |

확인한 원 저장소:

- J-OS: `C:\Users\ljh43\OneDrive\Desktop\workspace\개인PJT\ai-agent-platform`
- 롯데: `C:\Users\ljh43\OneDrive\Desktop\workspace\개인PJT\롯데 AX챌린지`
- 부산이음길: `C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\4. 자율pjt\S14P31E102`
- 애낌: `C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\3. 특화pjt\S14P21E106`
- 웃지마게임: `C:\Users\ljh43\OneDrive\Desktop\workspace\SSAFY\프로젝트\2. 공통pjt\S14P11E207`

J-OS 검색 평가의 원 자료는 `data/knowledge-consolidation-20261024/local-retrieval-review/`에 있고 평가 구현은 `.codex-run/knowledge-consolidation-20261024/`에 있다. 다른 원본 파일·커밋·팀 역할의 상세는 공개용 근거 요약의 ID와 대응한다.

## 이미지·시연 출처

| 사용 자산 | 출처·변환 | 해석 |
| --- | --- | --- |
| jos-report-fixture.png | J-OS `reports/link-intent-desktop.png` 복사 | 실제 컴포넌트에 합성 원문·모델 결과를 넣은 UI 검사 |
| busan-low-vision.png | 기존 공개 `/pm/` 자산 그대로 | 원본 사용자 유형 설정 |
| busan-font-size.jpg | `font-size-v2.mp4` 10초 추출 | 원본 글자 크기 설정 |
| busan-route-29s.jpg | `route-search-v2.mp4` 29초 추출 | 전환 중 프레임을 제외하고 안정된 지도·구간 안내 화면 선택 |
| aekkim-candidate-review-capture.png | 기존 공개 시연 캡처 | 예시 API 응답을 주는 오프라인 앱 UI |
| aekkim-dashboard-after.png | `docs/pm-redesign/aekkim-demo/screenshots/05-dashboard-after.png` 복사 | 같은 데모의 웨이브 등록 후 화면. 65,300원은 예시 합계 |
| play-pick.webp | 기존 `/pm/previews/` 자산 | 원본 UI·예시 계정·보관 데이터 로컬 시연. 연결된 영상은 대기 구간을 줄인 편집본 |

영상은 보충 링크로만 사용했다. PDF는 정지 화면·캡션·처리 흐름만으로 핵심 내용을 읽을 수 있다.

## 실제 수행한 검수

- 변경한 AX 파일 대상 ESLint 통과. TypeScript 및 `npm run build`의 prebuild/build/postbuild 통과. 새 상세 페이지 3개 생성, 26개 배포 trace의 기존 TIL 개인정보 검사 통과.
- 최종 웹의 Lighthouse 데스크톱 로컬 검사: Performance 100, Accessibility 100, Best Practices 100. `lighthouse.json`에 원 기록을 남겼다. 실제 사용자 환경의 성능이나 접근성 전체를 보장하는 수치는 아니다.
- 시스템 Node 24.11.1로 기존 prebuild 실행 시 비정상 종료가 있었고, 같은 작업을 Codex 번들 Node 24.22.1로 실행해 통과했다. 전역 설정은 바꾸지 않았다. 기존 MODULE_TYPELESS_PACKAGE_JSON 경고는 남아 있다.
- 웹 홈은 큰 표지와 3개 프로젝트, 원본 영상 2개를 확인했다. 세 상세 페이지의 제목·목차와 J-OS 사례 읽기 이동도 확인했다.
- 1425px 데스크톱 화면을 직접 시각 확인. 390px viewport에서 홈 문서 폭과 scrollWidth 일치, 제목·문단·figure 오른쪽 넘침 0. 모바일 메뉴 열기→선택→닫힘을 실제 클릭으로 확인했다. 실제 휴대전화 검사는 아니다.
- 부산이음길 원본 미리보기의 재생(readyState 4·시간 진행)과 일시정지 버튼 동작을 확인했다. 상세의 원본 경로 영상은 조작 가능한 controls와 정지 화면을 갖는다.
- 로컬 화면·상세·이미지·영상·근거 파일과 PDF 외부 링크 총 20개 HTTP 200. 메일 링크는 발송하지 않았다. 상세 응답은 `link-check.json`.
- PDF 12쪽 전부 **960 × 540pt, 16:9**. 번호 01–12 연속, 빈 페이지 없음, 한글 텍스트 추출 가능, 대체문자·미매핑 PUA 문자 없음, 페이지 밖 텍스트 0. 모든 쪽을 PNG로 렌더해 전체 축소판과 주요 상세 페이지를 시각 검수했다.
- 본문과 바닥글의 겹침, 이미지와 캡션이 시연 패널을 벗어나는지 실제 브라우저 배치와 PDF로 확인했다. 제출 PDF에는 localhost 링크가 없다.
- 초기 PDF에서 Type3 폰트 렌더러 경고가 있었고 글꼴 부분 추출 후 최종 Poppler 렌더링 경고는 0건이다. PDF 파서에는 FontBBox·객체 수 관련 경고가 남지만 재열기·텍스트 추출·모든 쪽 렌더링에서 누락·깨짐·겹침을 발견하지 않았다. 프로덕션 서버 stderr는 비어 있다. 개발 브라우저에는 HWP 확장이 html 속성을 삽입한 hydration 경고가 있었으며 AX 기능 오류로 처리하지 않았다.
- 기존 `/pm/` 경로 HTTP 200, 해당 소스 diff 없음. 기존 사용자 수정·미추적 파일은 보존했다.

## 제출 전 필수 확인

1. 로그인된 실제 제출폼에서 허용 확장자·첨부 개수·100MB가 파일별인지 전체인지 확인. 100MB 이하는 기존 입력폼 확인 기록이고 이번에 최신 폼을 재확인한 결과는 아니다.
2. 최종 지원서와 이름·연락처·프로젝트 역할 표현을 함께 검토하고 PDF 업로드 뒤 사이트 미리보기에서 한글·12쪽·16:9 표시 확인.
3. 제출 시점에 공식 마감 시간을 다시 확인. 11/4 확인한 공고는 2026-11-04 23:59 마감이다. 페이지 수 제한은 확인되지 않았다.

공식 안내: https://lotteaxchallenge.com/jobs/RC20261015037730 / https://lotteaxchallenge.com/faq

## 마감 이후 개선

- J-OS: 검색 평가의 남은 실패·변형 질문을 분리 추적하고, 최종 답변 품질·운영 환경 검사까지 별도로 연결.
- 부산이음길: 빌드·기기·경로·사용자 조건별 현장 관찰과 접근성 QA 기록 보강.
- 애낌: 실패 재현·복구의 기기별 QA와 모델 추론 검증을 역할별로 추가. UI 데모와 실제 모델 실행 시연을 별도 유지.
- 롯데: 데이터 이용 조건·고유 패널 구성부터 구현하고 입력 정합성·반복 실행·비용·실패를 검사. 기업 자료를 사용할 수 있을 때 실제 선택과 보정·검증 연결.

## 재실행

일반 환경에서는 `npm run build` 후 `npm run start -- --hostname 127.0.0.1 --port 3227`. 이 PC에서는 위에 기록한 번들 Node를 해당 실행의 PATH 앞에 두어 빌드했다. 실행 중인 로컬 서버를 종료하면 미리보기는 닫히지만 PDF는 독립적으로 열린다.

웹은 `AxEditorialHome.tsx`, `AxEditorialCase.tsx`, `axEditorialContent.ts`와 기존 PM CSS를 사용한다. PDF는 `AxPrintDeck.tsx`, `axPrint.module.css`에서 편집한다. `/ax/print/`의 인쇄 기능에서 배경 그래픽을 켜고 머리글·바닥글을 끈다. 제출 PDF를 다시 만들었다면 `python scripts/finalize-ax-pdf.py <PDF 절대경로>`로 **모든 페이지 16:9**, 로컬 링크·번호·텍스트를 검사하고 PNG 렌더링을 다시 검토한다. 스크립트는 번들 pypdf·pdfplumber를 사용하며 네트워크에 접근하지 않는다.

본문에 새로운 문자를 추가하면 `python scripts/prepare-ax-font.py`도 실행한다. 필요한 변환 도구가 없는 다른 PC에서는 fonttools·brotli가 있는 Python 환경을 사용한다. 원 글꼴을 다시 내려받지 않으며 저장소의 기존 글꼴과 라이선스만 읽는다.
