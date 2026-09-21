# Future & Dream Academy TIL 콘텐츠 관리 안내

## 기본 구조

실제 페이지는 `/til/future-dream/`이며 `content/til/published/*.md`만 빌드 시 읽는다. `content/til/config.json`이 카테고리 표시명·색상과 학습 여정 문구의 단일 원본이다. 검색, 필터, URL 선택, 상세 보기 UI는 서버가 넘긴 공개 기록만 브라우저에서 처리한다.

- 공개 원본: `content/til/published/<slug>.md`
- 로컬 초안: `content/til/drafts/<slug>.md`
- 재사용 템플릿: `.agents/skills/til/assets/entry-template.md`
- 상세 스키마: `.agents/skills/til/references/schema-and-style.md`
- 검증: `npm run til:validate`
- 관련 테스트: `npm run til:test`

초안 Markdown은 `.gitignore`로 제외된다. 초안 또는 `status: draft` 기록은 공개 페이지 로더가 읽지 않으므로 HTML이나 클라이언트 데이터에 들어가지 않는다.

## `$til` 대화형 워크플로

Codex에 `$til`과 함께 배운 일, 시도한 일, 막힌 지점, 새 이해, 다음 행동을 자연어로 말한다. 에이전트는 새 기록인지 기존 slug의 보완/정정인지 확인하고, 빠진 핵심 사실만 질문한 뒤 정확히 한 Markdown 파일을 `apply_patch`로 작성한다. 보완·정정 때는 새 파일을 만들지 않고 기존 ID와 slug를 유지한다.

새 기록과 수정은 대화를 거친 파일 패치로만 수행한다. CLI는 의도치 않은 콘텐츠 생성을 피하기 위해 create/update 기능을 제공하지 않는다.

## 스키마와 스타일

Frontmatter에는 `id`, `slug`, `date`, `createdAt`, `updatedAt`, 선택적인 `session`, `category`, `title`, `summary`, `status`, `isDemo`를 둔다. `date`는 배움이 일어난 날을 `YYYY-MM-DD`로 기록한다. `createdAt`은 Markdown 기록을 실제 만든 시각, `updatedAt`은 마지막 내용 또는 공개 상태 변경 시각이며 둘 다 초 단위 ISO-8601 KST 형식(`YYYY-MM-DDTHH:mm:ss+09:00`)을 사용한다. 배움 날짜를 작성 시각처럼 복사하지 않고, 수정 시 `createdAt`은 유지한 채 `updatedAt`만 실제 수정 시각으로 바꾼다. slug/ID는 영문 소문자·숫자·하이픈을 사용한다. 초안 상태는 `draft`, 공개 상태는 `published`다. 실제 기록은 `isDemo: false`, 명시적인 샘플만 `true`다.

본문에는 `오늘 배운 것`, `직접 시도한 것`, `막혔던 지점`, `새롭게 이해한 것`, `다음 액션`, `관련 역량`, `관련 자료`를 각각 한 번 둔다. 액션은 체크박스와 안정적인 ID를 사용한다. 자료 링크는 실제로 열리는 내부 경로나 `http(s)` URL만 기록하며, 관련 TIL 링크는 존재하는 slug를 가리켜야 한다. HTML 본문, 가짜 링크, 추측한 성과나 수치는 넣지 않는다.

## 공개·비공개·삭제

정확한 slug를 확인한 뒤 다음 명령을 사용한다.

```powershell
node --experimental-strip-types scripts/til-content.mjs publish <slug>
node --experimental-strip-types scripts/til-content.mjs unpublish <slug>
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope published
```

공개/비공개 명령은 상태, 디렉터리, 실제 실행 시각의 `updatedAt`을 함께 바꾸고 기존 대상이 있으면 중단한다. 삭제는 정확한 파일만 대상으로 하며 다른 TIL에서 들어오는 관련 링크가 있으면 중단한다. 사이트에서만 내리고 싶다면 삭제보다 unpublish를 우선한다.

## 검증과 배포 경계

`npm run til:validate`는 config, 필수 메타데이터/구획, 상태와 위치, 중복 ID/slug, 카테고리, 배움 날짜, KST 생성·수정 시각과 순서, 액션, 자료 URL, 관련 TIL 링크를 확인한다. 공개 명령은 배포가 아니다. 공개 Markdown을 커밋하고 기존 사이트 배포 절차가 성공해야 페이지에 반영된다. CMS, 관리자 화면, 로그인, 챗봇, 별도 API는 사용하지 않는다.

이 저장소가 공개라면 `published`의 전체 내용과 Git 이력이 누구나 볼 수 있다. 실명, 연락처, 고객·참여자 정보, 비공개 조직/프로젝트 정보, 계정·자격 증명은 기록하지 않는다. 초안도 로컬 파일일 뿐 암호화된 비밀 저장소가 아니므로 민감정보는 처음부터 일반화하거나 제외한다.

## 기존 페이지 자산

노트 비주얼은 `public/til/future-dream/notebook-lines.svg`와 CSS로 구성되어 있다. 카테고리/콘텐츠 저장 방식 변경과 무관하게 기존 검색·필터·선택 UI와 이 자산을 유지한다.
