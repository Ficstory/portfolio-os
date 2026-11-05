# Canva PM 포트폴리오 원본 감사

상태: 사용자 미리보기 승인 후 Canva 저장 완료. 실제 자료 13개, 12페이지 문구·출처 보완. commit 응답과 저장 후 본문 대조 결과는 canva-save-result.json에 있다.

## 배포 및 경로

- `https://ficstory.dev/PM/`과 네 상세 경로(`/PM/smile-game/`, `/PM/aekkim/`, `/PM/busan-eumgil/`, `/PM/play-pick/`)의 원문 HTML 응답은 모두 HTTP 200으로 확인했다.
- `src/proxy.ts:7-16`은 정확한 대문자 `/PM` 및 `/PM/*`만 `pm-improved`로 내부 rewrite한다. 소문자 `/pm/`은 기존 원본 경로다.
- 원격에서 수집한 6개 자산의 SHA가 로컬과 일치한다: `deployed-smile.mp4`, `deployed-aekkim.mp4`, `deployed-busan.mp4`, `deployed-play-pick.mp4`, `deployed-busan-mvp-meeting.png`, `deployed-busan-route-map.png`.

## Canva 12쪽 기준 비교

| 쪽 | 현재 원문 핵심 | 근거와 주의점 |
|---:|---|---|
| 01 | PM 포지셔닝: 요구사항 → 정책 → 구현 | 배포 원문과 코드 근거. 성과 수치 아님 |
| 02 | 부산참여연대 경력, SSAFY 경험 | 경력 기간 근거 있음. 공공자료 분석 기간을 PM 재직 기간으로 확대 금지 |
| 03 | 역량·근거 맵 | 프로젝트 기록으로 연결 가능 |
| 04 | 웃지마게임 설문 168건, 흥미 92, 의향 75, 부담 112/168=66.7% | 사전 설문 수치. 출시 후 사용률 아님 |
| 05 | 친구·지인 방 우선, 랜덤 매칭 병행 | 260114 원본 회의록의 팀 결정 |
| 06 | 친구 초대방 생성·입장·대기 | 원본 영상에서 0.50초 진입, 9.50초 대기실 프레임 확인. 방 생성 완료·코드 입력 과정은 영상에 없음 |
| 07 | 애낌 요구사항·화면명세·작업 기준 | 원본 문서 확보. “팀장” 명칭은 현재 PM·FE 표기와 조정 질문 |
| 08 | 애낌 QA와 구현 점검 | 개인 후보 UI·제외·중복·남은 건수와 팀 QA(권한·금액·이동)를 분리해야 함 |
| 09 | 부산이음길 문서 변경 관리 | 초기 Canva의 81건/8주 수치는 집계 정의 확인 전 보류 |
| 10 | Play Pick 응답 의미와 8개 완료 조건 | 구현·명세 근거. 추천 품질 성과 아님 |
| 11 | 협업 방식과 다음 검증 계획 | 계획을 완료 성과로 표현 금지 |
| 12 | 연락처·포트폴리오·이력서 | 링크 확인 범위. `/PM/`은 대문자 개선본 |

## 프로젝트별 원본 근거

### 웃지마게임

원본 회의록은 `SSAFY/프로젝트/2. 공통pjt/S14P11E207/docs/이재호/회의록/260114_회의록.md`다. 168건 설문을 근거로 친구·지인 매칭을 우선하고 랜덤 매칭을 병행하며, 로그인·READY·방 기능 우선 순서를 정한 팀 결정이 기록되어 있다.

원본 초대 영상은 `SSAFY/프로젝트/2. 공통pjt/캡처/초대배틀.mp4`다. 51.87초, 1280×720이며 실제 확인 프레임은 약 0.50초 진입 화면과 9.50초 대기실이다. 별도 방 생성 완료·코드 입력 절차는 영상에서 확인되지 않는다.

### 애낌

원본 저장소는 `SSAFY/프로젝트/3. 특화pjt/S14P21E106`이다. `docs/2026-03-21_요구사항정의서_v2_AEKKIM.md`, `docs/2026-03-21_화면명세서_v2_AEKKIM.md`, `docs/2026-03-24_MVP_테스트_개선사항_정리.md`, `FE/docs/archive/planning-history/2026-03-28_FE_디자인리뷰_반영_우선순위_및_작업계획서.md`에서 후보 확인·수동 매핑·구독 관리·화면 라우트·QA·작업 기준을 확인했다.

이재호 개인 기여로 Git 확인된 범위는 후보 UI·후보 제외 상태·중복 후보·남은 건수 수정이다(`97ac7e3`, `6c3125a`, `d5ffadd`, `883e333`). 권한·금액·이동 점검은 팀 QA로 분리한다.

### 부산이음길

원본 저장소는 `SSAFY/프로젝트/4. 자율pjt/S14P31E102`다. 기관 인터뷰 원본은 `sources/original-docs/busan-2026-04-10-interview.md`에 직접 확보되어 있으며, 2026-04-10 함세상 장애인자립생활센터 인터뷰, 경로 대안·위험 정보·이동 유형·접근성 시설 요구를 기록한다.

배포 원문과 실제 커밋 `ac698b3`로 이재호의 초기 기획·기관 직접 섭외·MVP 선정과 선택 핀 고정·카메라 제스처 동기화 관련 FE 기여를 확인했다. 이는 기획·구현 근거이며 현장 사용자 검증 완료를 뜻하지 않는다.

원본 화면·영상은 `Docs/media/route-search_thumb.png`와 `Docs/media/route-search.mp4`다. 선택 핀 고정, 마커 앵커 `(0.5f, 1.0f)`, 사용자 제스처 전달은 `ac698b3`의 `MapScreen.kt`, `KakaoMapViewport.kt`, `KakaoMapViewportBindings.kt` 및 테스트 변경에 있다.

### Play Pick

온보딩 원본 기록은 선택 상태, 호감·비호감 저장, 중립 응답 제외, 유효 응답 8개 완료 조건, 저장 성공 뒤 완료 처리를 설명한다. 데모는 예시 계정·보관 데이터 기반이며 완료율·추천 품질·만족도 성과를 증명하지 않는다.

## 자산 및 한계

- 웃지마게임: `/pm/previews/smile.mp4` — 팀 서비스 시연. 개인 초대방 전체 흐름의 직접 증거로 확대하지 않는다.
- 애낌: `/pm/previews/aekkim.mp4` — 예시 데이터 오프라인 데모.
- 부산이음길: `/pm/previews/busan.mp4`, `/pm-improved/evidence/busan-mvp-meeting.png`, `/pm-improved/evidence/busan-route-map.png`.
- Play Pick: `/pm/previews/play-pick.mp4` — 예시 데이터 기반 재현.
- `codex_pm_portfolio_handoff.md`, `slide_asset_manifest.json`, 기존 개인 포트폴리오 PPTX는 접근 가능한 workspace에서 확보되지 않았다. 부산 원본 문서나 기존 capture manifest를 이 첨부물로 대체하지 않는다.
