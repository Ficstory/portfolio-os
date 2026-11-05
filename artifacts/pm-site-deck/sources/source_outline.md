# PM 사이트 원문 수집 개요

수집일: 2026-09-14. 대상은 정확한 대문자 공개 URL이다. 각 HTML은 해당 URL에서 새로 HTTP 200으로 읽었고, 같은 응답에서 `main` 본문 텍스트를 원래 DOM 순서로 추출했다. 네비게이션·버튼·재생 안내는 중복될 수 있으며 deck 본문 구성 시 제외할 수 있다.

## 파일 목록

| 순서 | URL | 원문 HTML | 본문 추출 TXT | 본문 바이트(UTF-8) | 주요 이미지 주소 |
|---:|---|---|---|---:|---|
| 1 | `https://ficstory.dev/PM/` | `PM-home.html` | `PM-home.txt` | 8,858 | `/pm/previews/aekkim.mp4`, `/pm/previews/play-pick.mp4` 링크; 홈의 본문에는 `<img>` 없음 |
| 2 | `https://ficstory.dev/PM/smile-game/` | `PM-smile-game.html` | `PM-smile-game.txt` | 4,734 | `/pm/previews/smile.mp4` 링크 |
| 3 | `https://ficstory.dev/PM/aekkim/` | `PM-aekkim.html` | `PM-aekkim.txt` | 4,078 | `/pm/previews/aekkim.mp4` 링크 |
| 4 | `https://ficstory.dev/PM/busan-eumgil/` | `PM-busan-eumgil.html` | `PM-busan-eumgil.txt` | 5,679 | `/pm-improved/evidence/busan-mvp-meeting.png`, `/pm-improved/evidence/busan-route-map.png`, `/pm/previews/busan.mp4` |
| 5 | `https://ficstory.dev/PM/play-pick/` | `PM-play-pick.html` | `PM-play-pick.txt` | 5,168 | `/pm/previews/play-pick.mp4` 링크 |

추출 원본 목록은 `site-source.json`에 URL, HTTP 상태, TXT 파일명, 링크 href/텍스트, 이미지 주소를 함께 저장했다. 원문 보존이 필요하면 각 `*.html`을 우선 사용하고, deck 텍스트 재배열은 `*.txt`를 기준으로 한다.

## 사이트가 제시하는 순서

홈의 대표 프로젝트 순서는 웃지마게임 → AEKKIM·애낌 → 부산이음길 → Play Pick이다. 홈 텍스트는 각 카드에서 서비스 유형, 프로젝트명, 핵심 역량, 서비스 설명, MY ROLE, 개인/팀 결과, 기간·구성, 상세 링크, 시각 자료 캡션 순으로 이어진다. 상세 페이지는 공통적으로 서비스 소개 뒤 문제 → 근거 → 판단 → 실행 → 역할 분담 → 결과 → 배움 순서를 사용한다.

## 상세별 사용 가능한 원문

- 웃지마게임: 얼굴 노출 부담 문제, 168건 설문 수치, 친구 초대 우선·랜덤 병행 결정, 설문·결정 기록·초대방 구현, 개인/팀 역할 경계, 결과와 검증 범위.
- 애낌: 결제 후보 확인·제외·수동 매핑 문제, 요구사항·화면명세 갱신, 후보 UI와 상태 표시, 팀원 담당 구분, Android MVP·팀 우수상.
- 부산이음길: 초기 기획·기관 인터뷰·MVP 선정, 지도 선택 핀 고정과 카메라 제스처 동기화, 접근성 설정·승인 제보 표시, 산출물·팀 결과.
- Play Pick: 신규 사용자의 첫 추천 입력, 호감·비호감·중립 의미, 8개 완료 기준, 저장·완료·추천 이동, 저장 실패 처리, 팀 역할 경계.

원문 수집은 내용 요약을 위한 것이 아니며, 위 항목은 부모 에이전트가 deck 배치 시 찾을 수 있도록 한 섹션 안내다. 실제 문장과 목록은 각 TXT/HTML에 보존되어 있다.
