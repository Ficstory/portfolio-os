# Future & Dream Academy TIL 콘텐츠 관리 안내

## 기본 구조

실제 페이지는 `/til/future-dream/`이며 `/TIL/`에서도 접근한다. `entry`가 없는 주소는 목록, 유효한 `?entry=<slug>` 주소는 독립 읽기 화면이다. `content/til/published/*.md`만 빌드 시 읽는다. `content/til/config.json`이 카테고리 표시명·색상과 학습 여정 문구의 단일 원본이다. 검색, 필터, URL 선택, 상세 보기 UI는 서버가 넘긴 공개 기록만 브라우저에서 처리한다.

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

본문에는 `오늘 배운 것`, `직접 시도한 것`, `막혔던 지점`, `새롭게 이해한 것`, `다음 액션`, `관련 역량`, `관련 자료`를 각각 한 번 둔다. 처음 네 섹션은 문단과 미디어를 읽는 순서대로 작성한다. 액션은 체크박스와 안정적인 ID를 사용한다. 자료 링크는 실제로 열리는 내부 경로나 `http(s)` URL만 기록하며, 관련 TIL 링크는 존재하는 slug를 가리켜야 한다. HTML 본문, 가짜 링크, 추측한 성과나 수치는 넣지 않는다.

## 사진·영상 넣기

다음은 slug가 `learning-note`인 글의 작성 예시다. 실제 글의 slug와 파일명, 원본 픽셀 크기로 바꾼다. 한 줄에 미디어 하나를 적으며 설명·캡션에 `|` 문자는 사용하지 않는다.

```markdown
## 직접 시도한 것

- 첫 화면에서 사용자가 망설이는 부분을 확인했다.
- ![변경 전후 화면 비교](/til/media/learning-note/comparison.png) | 1600x1000 | 두 화면의 탐색 순서를 비교했다.
- 수정한 화면에서 같은 작업을 반복했다.
- [video: 수정 후 사용 흐름](/til/media/learning-note/demo.mp4) | 1920x1080 | 클릭부터 결과까지. | /til/media/learning-note/poster.jpg
- 관찰 결과를 다음 실험에 반영한다.
```

이미지 대체 텍스트와 영상 제목, 가로×세로 크기는 필수이며 캡션과 영상 포스터는 선택이다. YouTube는 `- [youtube: 제목](실제 YouTube 주소) | 1920x1080 | 선택적 캡션`으로 작성한다. 지원 URL과 상세 문법은 프로젝트 TIL 스킬의 `references/schema-and-style.md`를 따른다. 외부 이미지·임의 iframe·HTML은 지원하지 않는다.

기존 글의 문자열 배열은 그대로 지원한다. 미디어가 있는 섹션에만 순서가 보존된 `blocks`가 생성되고, 화면에서는 해당 블록만 사용해 본문이 중복되지 않는다. 캡션·대체 텍스트·영상 제목도 검색 대상이다.

## 결과물에 사용한 프롬프트 첨부

이미지나 영상 줄 바로 아래에 `prompt` 코드 블록을 적으면, 해당 사진의 캡션 옆 `>`를 눌러 원문을 펼쳐 볼 수 있다. 기본 상태는 닫힘이며 본문과 캡션은 계속 보인다. 프롬프트 원문을 본문에 다시 풀어 쓰지 않고, 본문에는 제작 과정의 핵심만 남긴다.

````markdown
- ![내가 제작한 포스터](/til/media/learning-note/poster.png) | 1000x1414 | 프롬프트: ChatGPT · 이미지: 사용한 이미지 도구

```prompt
실제로 사용한 프롬프트 원문을 여기에 붙여 넣는다.

줄바꿈과 빈 줄도 그대로 표시된다.
```
````

프롬프트는 바로 앞 미디어 하나에 연결되며 검색에도 포함된다. 참고 이미지와 직접 만든 결과물을 구분하고, 원문은 해당 결과물에 연결한다. 프롬프트 안의 생성 지시나 HTML 형태 문자열은 기록용 텍스트로만 표시하며 실행하지 않는다. 빈 프롬프트, 연결할 미디어가 없는 블록, 한 미디어의 중복 프롬프트, 닫히지 않은 코드 블록은 검사에서 거부한다.

## 미디어 보관과 공개 범위

| 단계 | 원본 위치 | 사이트 포함 여부 |
| --- | --- | --- |
| 미공개 초안 | `content/til/drafts/media/<slug>/` | 제외, Git에서도 제외 |
| 발행된 글 | `content/til/media/<slug>/` | 글에서 참조하는 파일만 포함 |
| 생성된 웹 파일 | `public/til/media/` | 공개 참조에서 생성, 직접 편집 금지 |

초안의 사진과 영상은 `public` 밖에 둔다. 발행 명령은 참조하는 파일과 포스터만 공개 원본 위치로 옮기며, 사용하지 않은 초안 파일은 옮기지 않는다. 미디어 URL은 다른 글의 slug를 사용하지 않는다. 이미 공개된 파일을 다른 글에서도 쓰려면 해당 글의 원본 폴더에 사본을 둔다.

`npm run til:media`는 공개 글의 참조만 읽어 웹 파일을 생성하고 이전 생성 파일을 정리한다. `npm run dev`, `npm run build` 전에 자동 실행된다. 개발 서버가 실행 중일 때 공개 글의 미디어를 추가했다면 이 명령을 다시 실행한다. 공개 해제는 참조 원본을 초안 폴더로 옮기고 생성 파일을 제거한다. 서버 재시작·재빌드와 온라인 재배포는 별도 단계다.

삭제 명령은 글과 생성된 웹 파일을 제거하지만 원본 미디어는 보존한다. 공개 저장소에 남은 원본과 Git 이력은 사이트에서 보이지 않아도 공개 상태이므로 필요하면 범위를 지정해 별도로 정리한다. 로컬 초안 미디어는 현재 사이트에서 미리보기로 제공하지 않는다.

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

초안은 공개 데이터와 정적 미디어뿐 아니라 서버 배포 파일 목록에서도 제외한다. `next.config.ts`의 `outputFileTracingExcludes`가 `content/til/drafts/**`를 제외하고, 빌드 후 `scripts/til-build-check.mjs`가 모든 배포 추적 파일을 검사한다. 초안 경로가 포함되면 `npm run build`가 실패한다. 설정은 [Next.js 파일 추적 문서](https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats)를 따른다.

`npm run til:validate`는 config, 필수 메타데이터/구획, 상태와 위치, 중복 ID/slug, 카테고리, 배움 날짜, KST 생성·수정 시각과 순서, 액션, 자료 URL, 관련 TIL 링크를 확인한다. 공개 명령은 배포가 아니다. 공개 Markdown을 커밋하고 기존 사이트 배포 절차가 성공해야 페이지에 반영된다. CMS, 관리자 화면, 로그인, 챗봇, 별도 API는 사용하지 않는다.

이 저장소가 공개라면 `published`의 전체 내용과 Git 이력이 누구나 볼 수 있다. 실명, 연락처, 고객·참여자 정보, 비공개 조직/프로젝트 정보, 계정·자격 증명은 기록하지 않는다. 초안도 로컬 파일일 뿐 암호화된 비밀 저장소가 아니므로 민감정보는 처음부터 일반화하거나 제외한다.

## 기존 페이지 자산

노트 비주얼은 `public/til/future-dream/notebook-lines.svg`와 CSS로 구성되어 있다. 카테고리/콘텐츠 저장 방식 변경과 무관하게 기존 검색·필터·선택 UI와 이 자산을 유지한다.
