# PM 포트폴리오 1차 구현 인계

작성일: 2026-09-09. 운영 배포·Git push·commit은 하지 않았다.

## 구현한 범위

- `/pm/`: Header → Hero → Selected Work → How I Work → About → Contact.
- `/pm/aekkim/`: 역할·기록·상태, 상황, 판단, 산출물, 구현 연결, 결과·한계, 출처, 다음 프로젝트.
- `/pm/busan-eumgil/`, `/pm/smile-game/`, `/pm/play-pick/`: 근거와 한계를 포함한 요약 상세. AEKKIM에 비해 자료와 서술 깊이를 추가 보완할 수 있다.
- 모바일 메뉴, 키보드 조작 가능한 원문 발췌 아코디언, 앵커, 이력서·이메일 연결.
- 실제 원본 목업·시연 썸네일, HTML로 작성한 흐름도·설문 차트, 읽을 수 있는 원문 발췌 6개.

기존 `/projects/*`, `/`, `/public-digital/`, `/policy/`, `/assembly/`, `/resume/` 코드는 변경하지 않았다. 원래 존재하던 미커밋 변경은 보존했다. 기존 `src/components/tracks/pm/PmLandingPage.tsx`, `pmLandingContent.ts`, `PmArtifactStack.tsx`, `PmComparisonTable.tsx`도 보존하고 새 전용 컴포넌트로 진입점을 바꿨다.

## 이어받은 상태와 점검

Next.js 16.2.6 App Router, React 19, TypeScript, Tailwind 4, npm/package-lock.json 기반이다. 작업 시작 시 여러 미커밋 변경과 PM 초기 리디자인이 있었지만, 운영 `/pm/`은 이전 TrackLandingPage 형태였다.

첨부에서는 요청문만 확인했다. 인계 ZIP, `ASTRA_HANDOFF_PROMPT.md`, 지정된 시안 4장은 현재 첨부·작업 폴더에서 발견되지 않았다. 기존 `analysis-assets/home-*.png`는 다른 사이트 조사 자료로 구분하고 인계 시안으로 사용하지 않았다.

[Devin Elston](https://devinelston.com/)과 [기존 PM 페이지](https://ficstory.dev/pm/)를 브라우저에서 직접 확인했다. 레퍼런스의 큰 제목, 짧은 소개, 넓은 프로젝트 비주얼과 모바일 재배치를 참고했다. 타인의 이미지·브랜딩·경력은 가져오지 않았다. 기존 PM 페이지의 긴 역량 소개와 내부 편집 지침 중심 구성을 프로젝트 중심으로 재편했다.

기존 robots 설정 `noindex, nofollow`는 보존했다. 이번 구현을 공개 배포하기 전 색인 허용 여부를 별도로 결정할 수 있다. PM별 title·description·canonical을 지정하고 OS 공유 이미지 상속은 제거했다.

## 디자인 기준

배경 `#F7F6F2`, 텍스트 `#171717`, 보조 텍스트 `#666666`, 선 `#D8D6D0`, 링크·강조 `#2457FF`.

Pretendard Variable v1.3.9를 공식 저장소에서 받아 PM 경로에만 자체 호스팅한다. 라이선스는 `public/pm/fonts/LICENSE.txt`에 포함했다. 폰트의 원본은 [Pretendard](https://github.com/orioncactus/pretendard)다.

콘텐츠 실제 최대 폭 1280px, 상세 본문 최대 폭 720px. 모바일 본문 16px, 상세 데스크톱 본문 17px. CSS Modules로 PM 스타일을 격리했다. 요청의 종이 배경 방향에 따라 밝은 테마를 고정했다. 자동 재생·스크롤 하이재킹·등장 애니메이션은 없고, 작은 hover/active 효과는 `prefers-reduced-motion: no-preference`일 때만 적용한다. JS 또는 모션 없이도 본문과 기본 details 메뉴를 읽을 수 있다.

전체 캡처 중 소개 섹션의 호환 앵커가 그리드 칸을 차지하는 문제를 발견하고, 절대 위치 앵커로 수정한 뒤 재검사했다.

## 원본 자료와 검증 수준

원본 작업 폴더 기준: `C:/Users/ljh43/OneDrive/Desktop/workspace/SSAFY/프로젝트/`.

| 콘텐츠 | 확인한 원본 | 이번에 확인한 범위 |
| --- | --- | --- |
| AEKKIM 요구사항 | `3. 특화pjt/S14P21E106/docs/2026-03-21_요구사항정의서_v2_AEKKIM.md` | 파일 내부 버전 v2.6, 기준일 2026-03-29. FR-03·FR-05, 포함/미지원 범위 |
| AEKKIM 문서 기여 | 같은 저장소 Git log | `9c0fb29`, LeeJaeho, 2026-03-29 문서 현행화 커밋. 전체 문서의 단독 작성이나 팀 총괄 성과를 뜻하지 않음 |
| AEKKIM 화면명세 | `docs/2026-03-21_화면명세서_v2_AEKKIM.md` | SCR-002-2 후보 확인, 대시보드, 수동 추가·매핑 |
| AEKKIM 구현 | `FE/app/src/main/java/com/ssafy/e106/feature/subscriptionconfirm/SubscriptionConfirmViewModel.kt`, `data/api/SubscriptionApi.kt` | 제외·생성·오류·진행 중 상태와 API 호출 코드를 읽음. Android 런타임 재검증은 안 함 |
| AEKKIM QA | `docs/2026-03-24_MVP_테스트_개선사항_정리.md` | 알림 권한·수신 토글, 연간/월간 금액, 추천 이동, 외부 링크 보류 기록. ‘해결’은 해당 문서의 기록 상태 |
| AEKKIM 대표 이미지 | `FE/Mock-up/SCR-004 구독 상세.png` | 초기 목업이며 실기기 캡처가 아님. 기존 자소서 산출물의 복사본과 원본 SHA-256이 일치 |
| 부산이음길 | `4. 자율pjt/S14P31E102/README.md`, `Docs/media/low-vision_thumb.png` | 사용자 유형별 흐름과 시연 썸네일. 경로 통행·현장 사용성 검증 아님 |
| 웃지마게임 | `2. 공통pjt/S14P11E207/docs/이재호/260115_설문조사결과_분석.pdf` | 원본 PDF 1쪽 조사 개요, 7쪽 Q9 인원수. 7쪽 렌더링도 확인. 응답 원데이터는 확보 못 함 |
| Play Pick | 기존 포트폴리오 `src/data/projects.ts` | 기존 기획·개발·REST API 연동 기록. PM 총괄 기여나 현재 운영 상태는 주장하지 않음 |

AEKKIM 목업 원본 SHA-256: `947c831c397b1e3e4e57034f2ece416b05bf46ca0600f609c737bf0aef0e39e6`.

AEKKIM의 Before/Decision/After와 대안 비교는 현재 원본 문서·구현을 설명하기 위한 재구성이라고 상세에 명시했다. 당시 의사결정 회의록을 읽은 것처럼 표현하지 않았다. 팀원 이탈 시점·팀 인원·정확한 수행 기간은 이번에 확인하지 못해 구체적으로 쓰지 않았다.

설문은 항목별 반올림 비율을 더하지 않고 인원수로 계산했다. 꽤·매우 부담은 `(56+56)/168 = 66.7%`, 조금 부담 포함은 `(56+56+35)/168 = 87.5%`다. 기존 인계문의 66.6%·87.4%와 차이가 나는 이유다. 서비스 성공률, 개선율 또는 전환 증가로 쓰지 않았다.

원문 발췌는 `public/pm/sources/*.txt`에 있다. 관련 문서·코드 일부만 담고 시스템 자격 증명·개인 연락처·서술형 개인 응답을 포함하지 않았다. 부산 지도 썸네일은 구체적인 위치가 표시되어 사용하지 않았고, 개인정보가 없는 사용자 유형 선택 화면을 사용했다. 이미지 생성은 하지 않았다.

## 변경 파일

| 경로 | 역할 |
| --- | --- |
| `src/app/pm/page.tsx` | 신규 홈 진입점 |
| `src/app/pm/layout.tsx` | PM 공통 셸, 메타데이터 |
| `src/app/pm/[slug]/page.tsx` | 4개 상세 정적 생성, 존재하지 않는 slug 차단 |
| `src/components/tracks/pm/editorial/content.ts` | 프로젝트 순서·핵심 서술·설문 인원수·업무 방식 |
| `PmEditorialHome.tsx` | 홈 구성 |
| `PmAekkimCase.tsx` | 우선 완성한 AEKKIM 상세 |
| `PmSupportingCase.tsx` | 나머지 요약 상세 |
| `PmHeader.tsx`, `PmShell.tsx` | 내비게이션·모바일 메뉴·푸터 |
| `PmVisuals.tsx` | 실제 이미지·정확한 HTML 차트·흐름도 |
| `pm.module.css` | 격리된 토큰·레이아웃·반응형·포커스·모션 정책 |
| `public/pm/` | 자체 호스팅 폰트·라이선스·원본/최적화 이미지·출처 발췌 |
| `scripts/check-pm-links.mjs` | 실행 중인 서버의 내부 링크·앵커·이미지·canonical 점검 |
| `package-lock.json` | 기존 `npm ci` 실패를 유발한 @emnapi 계열 간접 의존성 누락·충돌 보완. 직접 의존성과 package.json은 변경하지 않음 |
| `docs/pm-redesign/` | 이 문서·캡처·검사 결과 |

표에서 짧게 표시한 TSX/CSS 파일은 모두 `src/components/tracks/pm/editorial/` 아래에 있다. 작업 전 PM 진입 파일과 `next-env.d.ts` 사본은 무시되는 `.codex_tmp/pm-before/`에 보존했다.

## 실행 방법

```powershell
npm ci
npm run dev -- --port 3210
```

프로덕션 확인:

```powershell
npm run build
npm run start -- --port 3210
```

[PM 홈](http://localhost:3210/pm/) / [AEKKIM 상세](http://localhost:3210/pm/aekkim/).

현재 검증용 프로덕션 서버는 3210 포트로 실행했다. 해당 프로세스가 종료되면 위 start 명령으로 다시 열 수 있다.

```powershell
npx eslint src/app/pm src/components/tracks/pm/editorial scripts/check-pm-links.mjs --max-warnings=0
node scripts/check-pm-links.mjs
node --test src/data/projects.contract.test.mjs src/data/careerCases.contract.test.mjs
```

## 실행한 검증

| 항목 | 결과 |
| --- | --- |
| `npm ci` | 잠금 파일 보완 후 설치 성공 |
| 프로덕션 `npm run build` | 성공. PM 홈+상세 4개 포함 18개 페이지 생성, TypeScript 검사 통과 |
| PM 변경 파일 ESLint | 오류 0, 경고 0 |
| 전체 `npm run lint` | 오류 0, 경고 92. 모두 기존 `electioncommon.js`, `scripts/collect-instagram-public.mjs`에 있음 |
| 기존 프로젝트·경력 계약 테스트 | 7/7 통과 |
| 내부 링크·이미지·앵커 검사 | PM 5개 페이지, 고유 대상 30개 통과. 이력서·기존 상세·루트·다른 트랙 200 확인 |
| 360 / 390 / 768 / 1024 / 1440px | 홈과 AEKKIM 상세에서 가로 넘침·이미지 누락 없음. h1 각 1개 |
| 브라우저 내 동작 | 모바일 메뉴 열기·Enter·Escape·포커스 복귀·선택 후 닫힘, 소개 앵커, AEKKIM 결과 앵커, 아코디언 Enter, 상세 이동·다음 프로젝트·브라우저 뒤로가기·이력서 이동 확인 |
| 이메일 | 기존 데이터의 `mailto:dlwo4367@gmail.com` 연결 확인. 메일 전송은 하지 않음 |
| 본문 | 모바일 16px, 데스크톱 17px. 한글 줄바꿈과 캡처 육안 확인 |
| 토큰 색상 대비 | 본문/배경 16.58:1, 보조 본문/배경 5.31:1, 파란 강조/배경 5.00:1. 계산값이며 전체 페이지 접근성 인증을 의미하지 않음 |
| 모션 | 기본 본문을 숨기는 애니메이션 없음. CSS 조건부 hover/active 및 기존 전역 reduced-motion 규칙 확인 |
| Git diff 공백 검사 | 통과 |

브라우저 테스트는 Chrome에서 수행했다. Lighthouse 및 Safari/Firefox, 실제 모바일 기기, 스크린리더, OS reduced-motion 토글을 이용한 실측은 수행하지 않았다. LCP·INP·CLS 수치는 보고하지 않는다. 외부 원본 Android 프로젝트의 빌드나 실기기 테스트도 이번 웹 작업의 검증에 포함하지 않는다.

기계 검사 결과: [HTTP 검사](./http-checks.json), [브라우저 검사](./browser-checks.json).

## 실제 렌더링 캡처

- [홈 데스크톱 첫 화면](./home-first-screen.png)
- [홈 데스크톱 캡처](./home-desktop.png)
- [홈 모바일 첫 화면](./home-mobile-first-screen.png)
- [홈 모바일 캡처](./home-mobile.png)
- [AEKKIM 데스크톱 첫 화면](./aekkim-first-screen.png)
- [AEKKIM 판단 본문](./aekkim-decision-desktop.png)
- [AEKKIM 모바일 첫 화면](./aekkim-mobile-first-screen.png)

첫 화면은 CSS 뷰포트 1440×900 / 390×844 기준이다. 캡처 도구가 스크롤바 등 표시 영역을 제외하거나 조정하므로 PNG의 픽셀 크기는 일부 다르다. 전체 페이지 캡처 API는 시간 초과와 첫 프레임 반복 현상이 있어 해당 결과를 전달하지 않고 정상 첫 화면 캡처로 교체했다. `home-desktop.png`, `home-mobile.png`는 각각 첫 화면 캡처다. AEKKIM은 판단 본문 캡처도 포함한다. 모두 최종 웹 구현의 실제 브라우저 렌더링이며 인계 시안이나 생성 이미지를 재사용한 결과가 아니다.

## 다음에 필요한 자료

1. 인계 ZIP의 상세 명세와 초기 시안 4장. 현재 구현과의 시각적 차이를 비교하려면 필요하다.
2. AEKKIM 정확한 수행 기간, 당시 팀 인원·역할 변경 기록, 실제 기기 최신 캡처, 당시 선택지와 결정 이유를 담은 회의 기록.
3. AEKKIM 부분 성공 후 재시도·중복 생성 여부와 외부 해지 링크의 실제 검증 기록.
4. 웃지마게임 설문 원응답과 폼, 피봇 전후 기획안·명세의 직접 비교 자료. 지금은 분석 PDF 수치를 확인한 상태다.
5. 부산이음길의 경로·저시력자 사용성 검증 자료, 본인 기여를 구분할 산출물. 요약 상세를 더 깊게 확장할 때 사용한다.
6. Play Pick 실제 화면·API 흐름·구현 범위·현재 운영 상태 자료.
7. PDF 이력서를 제공하려면 실제 PDF 파일. 현재는 유효한 웹 이력서 `/resume/`에 연결한다.

공개 배포·푸시는 별도 요청이 있을 때 진행한다.
