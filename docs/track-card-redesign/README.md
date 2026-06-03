# 직무 트랙 카드 분리 README

이 문서는 2026-06-04 기준 직무별 포트폴리오 트랙 카드 분리 작업의 구조와 검증 방법을 기록한다.

## 목적

같은 포트폴리오 데이터를 쓰되, 지원 직무별로 먼저 보여줘야 하는 증거의 형식을 다르게 만든다. 프로젝트 카드 하나를 모든 직무에 재사용하면 PM, 공공디지털, 정책지원관, 국회 보좌 트랙의 판단 기준이 흐려지므로 카드와 섹션 문구를 분리했다.

## 라우트별 카드 매핑

| 라우트 | 카드 | 우선 증거 |
| --- | --- | --- |
| `/` | `ProjectCard` | 범용 프로젝트 허브 |
| `/public-digital/` | `PublicServiceProjectCard` | 공공 문제, 사용자 흐름, 요구사항 번역 |
| `/pm/` | `PmProjectCard` | 요구사항정의, 화면명세, API 협업, MVP 범위 |
| `/policy/` | `CareerDocumentCard` | 조례, 예산, 행정사무감사, 정책문서 작성 |
| `/assembly/` | `CareerDocumentCard` | 회의 모니터링, 이슈 조사, 질의 방향, 메시지 작성 |

## 핵심 파일

- `src/components/projects/PublicServiceProjectCard.tsx`: 공공디지털 트랙 전용 프로젝트 카드
- `src/components/projects/PmProjectCard.tsx`: PM 트랙 전용 프로젝트 카드
- `src/components/tracks/CareerCaseCard.tsx`: 경력 케이스 카드와 문서형 `CareerDocumentCard`
- `src/components/tracks/TrackCaseSection.tsx`: 트랙 모델을 읽어 카드 종류를 선택하는 섹션
- `src/components/tracks/trackLandingModel.ts`: 트랙별 카드 종류, 섹션 카피, 증빙 초점
- `src/data/careerCases.ts`: 경력 케이스와 공개 증빙 링크
- `src/data/careerCases.contract.test.mjs`: 경력 케이스 공개 증빙 계약 테스트
- `src/components/tracks/trackLandingModel.contract.test.mjs`: 트랙별 카드/섹션 카피 계약 테스트

## 공개 증빙 연결

경력 케이스 증빙에는 `href`와 `linkLabel`을 추가했다. 화면에는 내부 파일 경로 대신 공개 회의록, 언론 보도, 인터뷰 링크만 노출한다.

연결된 공개 근거는 부산시의회 회의록, 오마이뉴스 행정사무감사 의제 보도, 파이낸셜뉴스 공무국외출장 보도, 다음/쿠키뉴스 부산시의회 회기 평가 인터뷰 등이다.

## 반응형 보정 기준

긴 한국어 문장과 영문 섹션 라벨이 모바일에서 가로 스크롤을 만들지 않도록 카드와 섹션에 아래 기준을 적용했다.

- 카드 루트와 그리드 컨테이너에 `min-w-0`, `max-w-full`
- 긴 제목, 본문, 태그, 증빙 링크에 `break-words`
- 모바일에서는 프로젝트/경력 카드 그리드를 1열로 렌더링
- 하단 CTA는 좁은 폭에서 다음 줄로 빠지도록 `basis-full` 적용

## 검증 명령

2026-06-04 기준 아래 검증을 통과했다.

```bash
node --test
npm run lint
tsc --noEmit
npm run build
```

Playwright 스모크 QA에서는 `/public-digital/`, `/pm/`, `/policy/`, `/assembly/`를 390px 모바일과 1440px 데스크톱 뷰포트에서 확인했다. 네 경로 모두 `scrollWidth == innerWidth`였고 화면 밖으로 튀는 요소가 없었다.

## 운영 메모

직무별 URL은 직접 전달용이다. 검색 노출은 루트(`/`) 중심으로 유지하고, 직무 트랙은 `noindex`와 루트 canonical 정책을 유지한다.

개발 서버 실행 중에는 `next-env.d.ts`가 상태에 표시될 수 있다. 현재 작업 기준으로는 파일 해시가 HEAD와 같으면 실제 내용 변경으로 보지 않는다.
