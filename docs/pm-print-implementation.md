# /PM/ 통합 인쇄 포트폴리오 구현·검수 보고 (리비전 전 기준)

> 이 문서는 2026-09-14~15에 검증한 초기 13장 구성의 역사 기록입니다. 2026-09-15 리비전의 장표 순서·애낌 증빙 캡처·프로세스 근거·재검증 현황은 [pm-print-revision-2026-09-15.md](./pm-print-revision-2026-09-15.md)를 우선합니다. 아래의 164개 검사 통과 기록은 리비전 전 결과이며, 리비전 후 검증 통과를 뜻하지 않습니다.

작업·검수일: 2026-09-14~15. 로컬 구현과 검증 완료. 운영 사이트에는 배포하지 않았습니다.

## 구현 결과

- `/PM/`에서 Ctrl+P 또는 브라우저 인쇄를 실행하면 일반 웹 콘텐츠 대신 공통 13장 인쇄본을 출력합니다.
- `/PM/print/`는 같은 컴포넌트를 화면에서 보여 주며, 직접 접속·새로고침·인쇄를 지원합니다.
- 기존 Next.js의 `/PM/* → /pm-improved/*` proxy rewrite 구조를 유지했습니다. 새 페이지도 빌드 시 정적으로 생성됩니다. 현재 프로젝트는 `output: export`가 아닌 Next.js 서버 및 proxy 방식입니다. 별도 서버나 프레임워크를 추가하지 않았습니다.
- `PmPrintPortfolio`는 서버에서 13장 전체를 HTML에 렌더링합니다. 인쇄용 이미지에 eager loading을 사용하고, 미리보기 인쇄 버튼은 폰트·이미지를 확인한 후 `window.print()`를 호출합니다. `beforeprint` 조회나 페이지 이동을 사용하지 않습니다.
- 일반 홈과 인쇄 루트는 형제 요소입니다. 웹 콘텐츠·내비게이션·건너뛰기·푸터·미리보기 도구막대를 관련 인쇄 범위에서만 숨깁니다. 웹의 건너뛰기 링크와 모바일 메뉴를 유지했습니다.
- `@page pm-portfolio`를 사용해 다른 포트폴리오 경로에 페이지 크기가 전파되지 않도록 했습니다. 실제 크기는 320 × 180 mm, 내부 여백은 장표 패딩으로 관리합니다.
- 본문은 주로 13~15pt, 캡션·표의 보조 텍스트는 12pt 이상입니다. 잘라 숨기기, line-clamp, 전체 인쇄본 배율 축소를 사용하지 않습니다.
- 프로젝트 사실은 `selectedProjects`, 경력·교육·도구는 `resume-content`, 연락처는 기존 `links`를 참조합니다. 설문 수치와 영상·이미지 경로도 `survey`와 `pmMedia`로 공유합니다. 편집 문장은 인쇄 컴포넌트의 페이지 배열에서 관리합니다.

## 변경 파일

| 파일 | 변경 |
|---|---|
| `src/proxy.ts` | 대문자 경로에서 정확히 `print` 슬러그 허용 |
| `src/app/pm-improved/page.tsx` | 일반 홈 옆에 인쇄 루트 마운트 |
| `src/app/pm-improved/print/page.tsx` | 인쇄 미리보기 페이지·메타데이터 |
| `src/components/pm-improved/print/PmPrintPortfolio.tsx` | 13장 페이지 데이터·공통 HTML 렌더링 |
| `src/components/pm-improved/print/PmPrintPortfolio.module.css` | 장표·프린트·화면 미리보기 스타일 |
| `src/components/pm-improved/PmPrintToolbar.tsx` | 인쇄 버튼·에셋 준비·오류 안내 |
| `src/components/pm-improved/printPreview.module.css` | 미리보기 도구막대와 접근 가능한 화면 제목 |
| `src/components/pm-improved/PmHeader.tsx` | 데스크톱·모바일 인쇄 미리보기 링크 |
| `src/components/pm-improved/pm.module.css` | 관련 홈/미리보기 인쇄 시 웹 요소 숨김 |
| `src/components/pm-improved/content.ts` | 설문 핵심 수치와 에셋 경로 공유 |
| `src/components/pm-improved/PmSupportingCase.tsx` | 동일한 원문·에셋을 공유 데이터로 참조 |
| `src/components/pm-improved/PmVisuals.tsx` | 동일한 설문 수치를 공유 데이터로 참조 |
| `src/components/pm-improved/PmVideoPreview.tsx` | 동일한 영상·포스터 경로를 공유 데이터로 참조 |
| `scripts/check-pm-print.mjs` | 브라우저·레이아웃·회귀 검사와 전체 PDF 출력 |
| `scripts/check-pm-print-pdf.py` | 실제 PDF 페이지·텍스트 검사, 전 페이지 렌더링·비교 |

`src/app/pm`, 원본 `src/components/tracks/pm`, `/PM1/`은 수정하지 않았습니다. 기존 작업 파일은 유지했습니다.

## 리비전 후 13장 구성

| 장 | 프로젝트/내용 | 핵심 근거 |
|---|---|---|
| 1 | 표지 | 지원 직무와 조사·요구사항·화면/데이터 흐름 역량 |
| 2~4 | 부산이음길 | Agile 방식의 기획·MVP 선정·지도 프론트엔드와 문서 최신화 |
| 5~7 | AEKKIM · 애낌 | Waterfall 맥락, 중도 팀 이탈·MVP 범위 변경·예상보다 느린 진행과 다음 프로젝트의 프로세스 개선 |
| 8~10 | 웃지마게임 | 설문 근거, 팀 결정 기록, 친구 초대방 구현 |
| 11~12 | Play Pick | 온보딩 선택·저장·성공/실패 흐름 |
| 13 | 마무리 | 부산참여연대 경력·교육·도구·연락처 |

애낌 개요에는 `public/pm-improved/evidence/aekkim-dashboard-capture.png`, 기여 장표에는 `public/pm-improved/evidence/aekkim-candidate-review-capture.png`를 사용합니다. 두 이미지는 2026-09-11에 기존 Android Compose 앱을 전용 에뮬레이터에서 오프라인 예시 데이터로 실행해 캡처한 화면입니다. 실제 계정·결제 데이터나 AI 추론 결과를 보여 주는 자료는 아닙니다.

## 역사적 13장 구성 (리비전 전)

| 장 | 제목 | 주요 내용 |
|---|---|---|
| 1 | 팀이 같은 기준으로 일하도록, 기획과 개발을 연결합니다. | 이름·지원 직무·조사, 요구사항, 화면과 데이터 흐름의 역량 |
| 2 | 웃지마게임 | 화상 게임 소개·참여 문제·기간·7인 팀·개인 역할·팀 시연 |
| 3 | 흥미와 참여 의향, 얼굴 공개 부담을 분리해 물었습니다. | 168건 설문·흥미 92건·참여 의향 75건·노출 부담 112건·팀 우선순위 |
| 4 | 팀의 결정을 문서와 친구 초대방 구현으로 남겼습니다. | 결정 기록·방 생성/입장/대기·개인 구현과 팀 모델/배틀 영역 구분 |
| 5 | AEKKIM · 애낌 | 구독 관리 흐름·기간·PM/FE·대표 화면·팀 우수상 |
| 6 | 후보 상태별 처리 기준을 요구사항과 화면명세에 맞췄습니다. | 후보 확인/제외/수동 매핑 처리 기준과 문서 갱신 |
| 7 | 후보 확인 UI와 제외·중복·남은 건수 표시를 수정했습니다. | 초기 확인 UI·제외 상태·표시 정합성·팀원 구현 구분 |
| 8 | 부산이음길 | 보행약자/저시력자·기간·7인 팀·기획과 FE 역할·지도 화면 |
| 9 | 기관을 직접 섭외해 현장 의견을 MVP 범위로 연결했습니다. | 초기 기획·함세상 센터 직접 섭외/인터뷰·MVP 선정·미팅 사진 |
| 10 | 지도 마커를 고정하고 카메라 제스처와 동기화했습니다. | 선택 핀과 지도·접근성 설정/승인 제보·팀 공간 데이터 영역 구분 |
| 11 | Play Pick | 첫 추천을 위한 온보딩·기간·2인 팀·개인 역할·화면 재현 데모 |
| 12 | 선택의 의미를 지키며 저장 성공 뒤에만 추천으로 이동했습니다. | 호감/비호감/판단 보류·8개 유효 응답·API/선호 저장·성공/실패 흐름 |
| 13 | 분석 실무를 제품의 요구사항과 구현 기준으로 확장했습니다. | 부산참여연대 경력·교육·팀 수상·도구·이메일/포트폴리오/GitHub |

기본안에서 페이지를 합치거나 추가하지 않았습니다. 중복 역량 태그를 줄이고 메타정보를 재배치해 하단 페이지 번호와 본문이 겹치지 않게 했습니다.

## 검증 환경과 결과

Windows, Next.js 16.2.6 production build 및 `next start`, Playwright로 검증했습니다.

- Edge 153.0.4234.32: 164개 검사 통과.
- Chrome 154.0.8037.17: 같은 164개 검사 통과. 두 PDF 모두 실제 13장 확인.
- 빌드/TypeScript, 변경 파일 ESLint, `git diff --check` 통과.
- 기존 `check-pm-improved.mjs`: 보호 파일 168개 해시 일치, 13개 기존 경로, 66개 로컬 링크/에셋, 대소문자·trailing slash·RSC 확인 통과.
- 일반 홈의 본문 텍스트와 크기는 변경 전과 일치했습니다. 데스크톱 1440px에서 main 높이 9397.8125px, 모바일 390px에서 10686.3125px로 동일합니다. 본문 및 기존 반응형 디자인을 변경하지 않았습니다.
- 최종 두 경로 모두 페이지 상단에서 스크롤 없이 13장 준비. eager 이미지 모두 로딩, 폰트 완료 확인. 실제 PDF의 본문과 한국어 검색 텍스트 확인.
- 두 경로 PDF를 모두 끝까지 출력하고 26개 페이지를 PNG로 렌더링했습니다. 페이지별 텍스트와 렌더링 픽셀 해시가 일치합니다.
- 13장 전체를 개별 이미지로 육안 검수했습니다. 빈 장·제목/본문/이미지 잘림·페이지 번호 겹침·깨진 한글을 발견하지 못했습니다. 캡션까지 원본 비율을 유지합니다.
- DOM 페이지 크기·스크롤 크기·자식 경계·푸터와 본문 간격 확인. 최소 본문/푸터 간격 10.5px, 최소 검사 텍스트 16 CSS px(12pt).
- 인쇄 매체에서 웹 건너뛰기·내비게이션·도구막대 미출력. 화면 매체 복귀 후 홈 표시·키보드 건너뛰기·모바일 메뉴/Escape 동작 확인.
- Poppler는 일부 Type 3 글리프 bounding box 경고를 출력합니다. 실제 렌더링과 추출 텍스트에서 누락/깨짐은 발견하지 못했습니다.

검증 중 발견했던 미리보기 추가 2장 문제는 화면용 루트 여백·최소 높이가 print CSS보다 우선하던 원인이었습니다. 해당 규칙을 `@media screen`으로 제한해 해결했습니다. 개발 서버와 배포 빌드의 CSS 순서 차이는 최종 production 검증에서 기존 레이아웃과 같음을 확인했습니다.

## 산출물·재검증

- 제출용: `output/pdf/lee-jaeho-pm-portfolio.pdf`
- 경로 대조용: `output/pdf/lee-jaeho-pm-portfolio-preview.pdf`
- 전체 페이지 PNG: `output/pdf/qa/main-01.png`~`main-13.png`, `preview-01.png`~`preview-13.png`
- 전체 장표 모아보기: `output/pdf/qa/overview-*.png`
- 웹 화면: `output/pdf/qa/desktop.png`, `mobile.png`, `preview.png`
- 검사 원본: `output/pdf/qa/dom-report.json`, `pdf-report.json`, `web-regression.json`

프로젝트 환경에 Playwright와 Python의 pypdf/Pillow, Poppler가 있어야 합니다. 로컬에서는 Codex 번들 의존성을 이용했습니다.

```powershell
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3216
node scripts/check-pm-print.mjs http://127.0.0.1:3216
python scripts/check-pm-print-pdf.py
node scripts/check-pm-improved.mjs http://127.0.0.1:3216
```

`PM_PRINT_BROWSER=chrome`으로 Chrome 검사를 선택할 수 있습니다. `PM_PRINT_OUTPUT`은 검증 산출물 위치를 바꿉니다. 개발 중에만 쓰는 `PM_PRINT_LAYOUT_DIAGNOSTICS=1`은 일부 레이아웃 단언을 생략하며 보고서에 diagnosticOnly를 표시합니다. 최종 검증은 이 옵션 없이 실행했습니다.

## 확인 사항과 환경 제한

1. Play Pick 현재 사이트 기간 및 관련 커밋은 `2025.12`이나 `public/pm/sources/play-pick-onboarding.txt`에 인용된 명세 헤더는 `2024-12-22`입니다. 기존 공유 기간을 유지했고 충돌을 임의로 교정하지 않았습니다.
2. 애낌 팀 인원은 현재 원문에서 확인되지 않아 숫자를 만들지 않고 생략했습니다.
3. 웃지마게임 친구 초대방 및 애낌 후보 확인/제외의 전용 증거 캡처는 추가 확보하면 좋습니다. 현재는 기존 팀 시연/예시 데이터 포스터임을 표시하고, 기여 자체는 검증된 문서·구현 기록에 기반한 HTML 표와 흐름으로 설명했습니다.
4. 운영 URL은 검증 환경에서 네트워크 연결이 실패했습니다. 로컬 저장소와 보관된 원문으로 콘텐츠를 대조했으며 운영 배포·운영 URL 출력 성공을 주장하지 않습니다.
5. 실제 OS 인쇄 대화상자의 취소 조작, 물리 프린터, Safari/Firefox는 실행하지 않았습니다. 인쇄 매체 전환 후 화면/포커스 복귀는 자동화로 확인했습니다.
6. 사용자의 브라우저 머리글·바닥글, 배경 그래픽 설정을 CSS로 강제하지 않습니다. 화면 안내에 따라 각각 해제/활성화해야 합니다.

## 위임 기록

L0 자료 확인은 Luna/medium, L1 경로 연결·공유 데이터 참조는 Terra/medium, L2 인쇄 레이아웃은 Sol/high로 명시 요청했습니다. 도구의 작업자 상태 응답은 모델 런타임 메타데이터를 노출하지 않아 실제 라우팅을 독립 검증할 수 없었습니다. 추가 검증 작업자 생성은 작업 수 제한으로 거절되어 최종 PDF 생성·검수는 루트가 직접 수행했습니다.
