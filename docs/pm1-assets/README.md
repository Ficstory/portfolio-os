# PM1 캐릭터 에셋

사용자가 PM1 첫 화면용으로 확정한 1254×1254 PNG를 사용한다. `jaeho-character-original.png`는 수정하지 않은 보관본이며 웹페이지에서 전송하지 않는다.

`scripts/prepare-pm1-character.mjs`는 입력 PNG를 보존하고 투명도를 유지한 640px/1040px WebP를 `public/pm1/character/`에 생성한다. 원본의 표정·머리카락·외형을 다시 생성하거나 배경색을 일괄 제거하지 않는다. 브라우저는 표시 크기에 맞는 파일을 선택한다.

이미지 경로와 대체 텍스트는 `src/components/pm1/content.ts`의 `heroCharacter`에서 관리한다. 원본 해시, 알파 채널, 출력 용량은 `.codex_tmp/pm1-fix-2026-09-14/character-metadata.json`에 기록한다.
