from __future__ import annotations
import hashlib, html, json, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
STATE = json.loads((ROOT / 'canva-review-state.json').read_text(encoding='utf-8'))
COMMIT = ROOT / 'canva-save-result.json'
saved = COMMIT.exists() and json.loads(COMMIT.read_text(encoding='utf-8')).get('saved') is True
status = 'Canva 저장 성공' if saved else 'Canva 초안 적용 · 저장 승인 대기 · 미저장'
asset_by_id = {
 'MAHVLJy9iXs':'p05-meeting-readable.png',
 'MAHVLAor8Pw':'smile6-create-join-entry-00.50.png','MAHVLLQ5UuY':'smile6-waiting-09.50.png',
 'MAHVLCiztFc':'p07-requirements-readable.png','MAHVLMk6CuY':'p07-screen-spec-readable.png',
 'MAHVLJmMMiM':'p08-plan-readable.png','MAHVLPgZqHg':'p08-qa-readable.png','MAHVLIkqBOM':'aekkim8-review-payment.png',
 'MAHVLPza-CQ':'busan9-mvp-meeting.png','MAHVLJ5euRc':'busan9-marker-change-readable.png','MAHVLKlm_XM':'busan9-route-map.png',
 'MAHVLIBl6ro':'play10-onboarding-card-crop.png','MAHVLDhEEcA':'play10-first-recommendations-crop.png',
}
intent = {
1:'표지의 협업 메시지와 흰 배경을 유지했다. 소개 문장을 사용자 문제 → 판단 근거 → 팀 결정 → 구현·확인으로 연결하고 출처를 대문자로 정정했다.',
2:'경력·교육 구분을 유지하고 출처 표기를 /PM/으로 바로잡았다. 공공자료 분석 경험을 PM 재직 기간으로 바꾸지 않았다.',
3:'부산이음길 근거를 기관 인터뷰·MVP·지도 구현으로 보완했다. 실제 확보되지 않은 첨부 이력서 표기를 확인한 원문·프로젝트 기록으로 교체했다.',
4:'원문의 사전 설문 수치와 편향 주석을 유지했다. 확인되지 않은 팀장 명칭을 PM·사용자 조사·프론트엔드로 바꾸고 /PM/smile-game/을 출처로 표시했다.',
5:'1월 14일 팀 결정 원문을 큰 문서 영역에 배치했다. 설문 근거, 팀의 우선순위 결정, 개인의 조사·기록·초대방 담당을 분리했다.',
6:'실제 초대배틀 영상의 진입·대기실 두 장면을 넓게 배치했다. 생성 완료·코드 입력 과정이 별도로 없다는 사실과 프레임 시각을 표시했다.',
7:'실제 요구사항과 화면명세를 나란히 읽도록 배치했다. 후보 확인·제외·수동 매핑의 목적과 개인 UI 기여를 연결하고 3월 29일 현행 문서임을 표시했다.',
8:'원본 작업계획과 팀 QA 발췌, 실제 후보 결제 확인 화면을 배치했다. 개인 후보 UI·중복·남은 건수 수정과 팀의 권한·금액·이동 QA를 분리했다. 계획·팀 수상·예시 데이터의 범위를 명시했다.',
9:'초기 기획·기관 직접 섭외·4월 10일 인터뷰·MVP 범위와 지도 마커·프론트 기여를 함께 강조했다. 실제 미팅 사진·Git 변경 제목·지도 화면을 병렬 배치하고 검증되지 않은 81건/8주 집계를 제거했다.',
10:'취향 선택과 첫 추천 실제 화면을 크게 배치했다. 긍정·부정과 보류의 데이터 의미, 8개 구현 조건, 저장 성공 후 완료 흐름을 설명했다. 예시 계정·재현 데모임을 표시했다.',
11:'협업 방식을 후보 확인 기준·기관 인터뷰·실제 지도 구현과 연결했다. 이후 사용자 검증 계획을 완료 성과와 구분했다.',
12:'사용자 문제·팀 결정·구현 확인으로 끝맺음을 정리하고 클릭 가능한 포트폴리오 링크를 정확한 /PM/으로 변경했다. 이메일·이력서 링크는 유지했다.',
}
notes = {
1:'원문 https://ficstory.dev/PM/ 및 https://ficstory.dev/resume/ . 표지 메시지를 유지한다. 공공자료 분석 경험은 PM 재직 경력과 구분한다.',
2:'원문 https://ficstory.dev/PM/ 및 https://ficstory.dev/resume/ . 경력과 SSAFY 교육·프로젝트를 구분한다.',
3:'원문 https://ficstory.dev/PM/ 및 asset_manifest.json의 프로젝트 원본 기록. 첨부 이력서를 이번 차수에 읽었다고 표현하지 않는다.',
4:'원문 https://ficstory.dev/PM/smile-game/ . 사전 설문 n=168, 2026.01.13–14. 흥미 92, 참여 의향 75, 얼굴 공개 부담 112/168=66.7%. 독립 문항이며 행동 전환 퍼널이 아니다.',
5:'원문 https://ficstory.dev/PM/smile-game/ . 260114_회의록.md 32–45행의 팀 결정. 친구/지인 매칭을 메인으로, 방 기능 먼저→랜덤 매칭 추가. 개인은 조사·결정 기록·초대방 UI. 참여 부담 감소의 사후 효과는 미측정이다.',
6:'원문 https://ficstory.dev/PM/smile-game/ . 실제 초대배틀.mp4 00:00.50 진입 및 00:09.50 2인 대기실 프레임 확보. 생성 완료·코드 입력 과정은 별도 미확보. 랜덤 매칭 영상으로 대체하지 않았다. 개인 기여는 코드·원문 근거와 함께 판단한다.',
7:'원문 https://ficstory.dev/PM/aekkim/ . 3월 29일 현행 요구사항·화면명세. 개인 후보 확인 UI·제외 상태·중복·남은 건수 수정. 구독 생성·실패·번들은 팀원 기여이다.',
8:'원문 https://ficstory.dev/PM/aekkim/ . 작업계획은 완료 증거가 아니다. 권한·금액·화면 이동은 팀 QA 기록이다. 오른쪽은 실제 Android 코드의 예시 데이터 오프라인 데모이며 해당 QA 이슈의 수정 완료 화면이 아니다. MVP·우수상은 팀 결과, 실제 절감액 미측정.',
9:'원문 https://ficstory.dev/PM/busan-eumgil/ . 초기 기획·함세상 장애인자립생활센터 직접 섭외·2026-04-10 인터뷰·MVP 선정·지도 마커 및 FE 기여. ac698b3(2026-05-09, 이재호)는 선택 핀 고정 렌더링과 카메라 동기화 보정의 변경 기록. 지도 정지 화면은 동작이나 현장 경로 안전성 검증을 증명하지 않는다. 미팅 사진 자체로 기관·날짜·인물을 특정하지 않는다. 81건/8주 집계는 정의 전 사용하지 않는다.',
10:'원문 https://ficstory.dev/PM/play-pick/ . 개인은 화면·온보딩·저장, 팀원은 데이터 수집·추천 엔진. 예시 계정·데이터를 사용한 실제 Vue·Django 로컬 재현. 호불호 8개는 구현 조건이며 보류는 저장·개수에서 제외된다. 저장 성공 뒤 완료·추천으로 연결된다. 추천 품질·전환 개선 성과 아님.',
11:'원문 https://ficstory.dev/PM/ 및 프로젝트별 원본. 협업 과정과 향후 검증 계획이며 완료된 사용자 실험·개선율을 주장하지 않는다.',
12:'연락처 https://ficstory.dev/PM/ , 이력서 https://ficstory.dev/resume/ , 이메일 dlwo4367@gmail.com. /PM/은 대문자 경로이다.',
}

patch = ['# 페이지별 수정 원고와 배치', '', f'상태: {status}', '', '디자인: https://www.canva.com/design/DAHVKsJYGbg/7oiqu_OCUuH7PLQE0zCKrw/edit', '',
 '12페이지·1600×900·흰 배경의 서류형 디자인을 유지했다. 전체 웹페이지 캡처로 슬라이드를 대체하지 않았다. 아래 좌표는 슬라이드 좌상단 기준 (x, y, 폭, 높이)이며 기존 텍스트 상자를 재사용했다. 원문 문서 발췌는 새로 작성한 회의록이 아니라 출처의 실제 문장을 읽기 쉽게 렌더한 것이다.', '']
issues=[]
for p in range(1,13):
    patch += [f'## {p:02d}', '',intent[p],'', '### 현재 적용한 본문', '']
    text_items=sorted([x for x in STATE['richtexts'] if x['page_index']==p], key=lambda x:(x['containerElement']['position']['top'],x['containerElement']['position']['left']))
    for x in text_items:
        text=''.join(r.get('text','') for r in x['regions'])
        if x['containerElement']['position']['top']>=835: continue
        patch += ['```text',text,'```','']
    fills=[x for x in STATE['fills'] if x['page_index']==p]
    if fills:
        patch += ['### 실제 자료 배치', '', '| 자료 | x | y | 폭 | 높이 |','|---|---:|---:|---:|---:|']
        for f in fills:
            c=f['containerElement']; pos=c['position']; dim=c['dimension']; name=asset_by_id[f['asset_id']]
            patch += [f"| [{name}](assets/{name}) | {pos['left']:.2f} | {pos['top']:.2f} | {dim['width']:.2f} | {dim['height']:.2f} |"]
            im=Image.open(ROOT/'assets'/name)
            ratio=dim['width']/dim['height']; expected=im.width/im.height
            if abs(ratio/expected-1)>0.003: issues.append({'file':name,'issue':'aspect ratio','ratio':ratio,'expected':expected})
            if pos['left']<0 or pos['top']<0 or pos['left']+dim['width']>1600.1 or pos['top']+dim['height']>900.1: issues.append({'file':name,'issue':'outside canvas'})
        patch += ['', '원본 비율을 유지한다. 휴대폰 화면은 전체 세로 화면, Play Pick은 원본에서 기록한 범위만 잘랐다. 발췌 이미지의 본문은 슬라이드에서 대략 22–24px이며 작은 캡처 칸으로 되돌리지 않는다.', '']
    patch += [f'[Canva 미리보기](previews/{p:02d}-draft.png)', '', '### 발표자 노트 교체 원고 — 수동 반영 필요', '', notes[p], '']
(ROOT/'slides_patch.md').write_text('\n'.join(patch),encoding='utf-8')

qa=f'''# QA 보고서

상태: **{status}**

- 대상: DAHVKsJYGbg, 12페이지, 1600×900.
- 실제 이미지가 추가된 페이지: 05–10, 총 13개(1·2·2·3·3·2).
- 문구·출처 보완까지 포함해 01–12 전 페이지를 수정했다.
- 사용자 승인과 commit 성공 이전에는 저장 완료가 아니다. 저장 성공 시 canva-save-result.json을 별도 보관한다.

## 시각 검수

- Canva가 반환한 12장 PNG 미리보기(600×338)를 모두 확인하고 보관했다. 원본 이미지도 별도로 확인했다.
- 기존 장식 도형이 이동한 텍스트를 가리는 문제를 발견해 첫 초안을 취소하고 재적용했다. 최종 초안에서는 상위 텍스트 상자를 재사용하고 08·10의 줄 수를 줄여 본문 가려짐을 해결했다.
- 05·07·08의 실제 문서 발췌는 큰 글자로 다시 렌더했다. 09의 Git 기록은 실제 제목을 유지하고 50px 원본 글자를 435px 폭에 배치해 핵심 문장이 읽히게 했다.
- 모든 이미지의 슬라이드 경계·원본 비율을 수치 확인했다. 오류 {len(issues)}건. 이미지 좌표는 slides_patch.md, 자동 결과는 qa_geometry.json 참조.
- 미리보기에서 본문의 명백한 잘림·겹침은 보이지 않았다. 기존 연한 장식 도형은 유지되며 작은 출처·메타데이터는 실제 이미지 원본/manifest에서 확대 확인할 수 있다.
- 인쇄용 고해상도 PDF/PPTX 출력은 만들거나 검수하지 않았다. 실제 제공된 기존 포트폴리오 PPTX가 없었으며 미리보기는 Canva의 초안 렌더다.

## 출처·링크

- 대문자 /PM/ 및 네 프로젝트 상세 페이지는 배포 HTML HTTP 200으로 직접 읽었다. 소문자 /pm/으로 대체하지 않았다.
- /PM은 src/proxy.ts의 대소문자를 구분하는 rewrite 경로임을 확인했다. 현재 배포본의 새 부산 기획·기관 섭외·지도 기여와 원본 저장소 기록이 연결된다.
- 배포 자산 6개가 로컬과 SHA256 일치했다. 과거 ‘미배포’ 기록은 이번 확인과 충돌하므로 현재 확인 상태를 적용했다. 로컬의 모든 변경사항이 배포됐다는 포괄적 주장은 하지 않는다.
- 12쪽의 포트폴리오 실제 하이퍼링크를 https://ficstory.dev/PM/으로 변경했다. 이메일 mailto와 이력서 https://ficstory.dev/resume/ 링크는 반환된 요소 메타데이터에서 확인했다. 이력서 HEAD 응답은 200이다. 이메일 발송은 하지 않았다.
- 본문 출처는 대문자로 정정했다. 출처 푸터는 텍스트 표기이며 모든 푸터가 하이퍼링크인 것은 아니다.
- **기존 발표자 노트는 도구 수정 범위 밖이다.** 소문자 출처, 초대방 미확보, 부산 FE·문서만의 과거 설명이 남아 있다. slides_patch.md에 12쪽 모두의 정확한 노트 교체 원고를 제공했다. 화면 본문과 노트를 혼동하지 않는다.

## 사실·역할 귀속

- 사전 설문 168명·92명·75명·112명/66.7%는 독립 응답 결과이며 전환율·출시 성과가 아니다.
- 1월 14일 우선순위는 팀의 결정이다. 랜덤 매칭 영상은 친구 초대방 증거로 사용하지 않았다.
- 초대배틀.mp4에서 0.50초 진입, 9.50초 대기실을 추출했다. 생성 완료·코드 입력 과정은 미확보로 표시했다.
- 애낌 개인 후보 UI·제외 상태·중복·건수 수정은 개인 커밋 근거이며 권한·금액·이동은 팀 QA로 분리했다. 작업계획은 완료 증거로 쓰지 않았다. QA 발췌와 결제 확인 화면은 같은 오류의 전후 비교가 아니다.
- 애낌 Android MVP·우수상은 팀 결과다. 화면은 예시 데이터 오프라인 데모이며 실제 절감 성과로 사용하지 않았다.
- 부산 기관명은 정확히 함세상 장애인자립생활센터다. 2026-04-10 인터뷰 원본과 최신 배포본에서 초기 기획·직접 섭외·MVP 선정이 확인됐다. 섭외·인터뷰를 현장 사용자 검증 완료로 확대하지 않았다.
- 부산 ac698b3은 이재호의 지도 선택 핀 고정 렌더링·카메라 동기화 보정 변경 기록이다. 정지 지도 화면으로 동작 검증이나 경로 안전성을 주장하지 않았다. 미팅 사진 자체로 날짜·기관·인물을 특정하지 않았다.
- Play Pick은 실제 Vue·Django 코드 기반 예시 계정·보관 데이터 재현 화면이다. 8개는 구현 조건이며 추천 품질·개선율을 측정한 수치가 아니다. 팀원의 추천 엔진을 개인 기여로 바꾸지 않았다.
- 생성 UI, 가상의 회의록·실적·수치는 추가하지 않았다. 원본 사이트·앱 소스 수정이나 배포는 하지 않았다.

## 저장·남은 작업

{status}. 남은 질문은 remaining_questions.md에 정리했다. 현재 자료로 사실을 확인할 수 없는 역할명·집계는 보류했다. 원문 파일 2개와 기존 포트폴리오 PPTX를 제공받았다고 주장하지 않는다.
'''
(ROOT/'qa_report.md').write_text(qa,encoding='utf-8')
(ROOT/'qa_geometry.json').write_text(json.dumps({'page_count':12,'fill_count':len(STATE['fills']),'image_geometry_issues':issues},ensure_ascii=False,indent=2),encoding='utf-8')
readme=f'''# Canva PM 포트폴리오 보완 인계

상태: **{status}**

[Canva 편집본](https://www.canva.com/design/DAHVKsJYGbg/7oiqu_OCUuH7PLQE0zCKrw/edit)

- assets/: 확보한 실제 이미지와 원문 발췌. 삽입 13개와 미삽입 보조 자료는 asset_manifest.json으로 구분한다.
- asset_manifest.json: 출처·해시·페이지·증명 범위·한계·귀속.
- slides_patch.md: 12쪽의 실제 적용 문구와 이미지 좌표, 수정할 발표자 노트 원고.
- remaining_questions.md: 미확보 과정·역할명·집계·첨부 파일 확인.
- qa_report.md / qa_geometry.json: 시각·링크·사실·역할·저장 상태 검수.
- previews/: Canva가 만든 12쪽 미리보기. gallery.html에서 한 번에 열 수 있다.
- sources/: 실제 배포 HTML·텍스트, 원본 문서·초대 영상 및 출처 확인 기록.
- canva-review-state.json: 최종 검토 초안의 요소·좌표·작업 기록. 새 트랜잭션 없이 작업을 그대로 재실행하지 않는다.
- canva-save-result.json: 성공적으로 저장한 경우에만 별도 생성한다.

원본 이미지의 추가 편집이나 AI UI 생성은 하지 않았다. Play Pick 크롭은 원본과 좌표를 보관했다. 문서/Git 발췌는 원문을 읽기 쉽게 렌더한 이미지로, 원본 애플리케이션 화면 캡처와 구분한다.
'''
(ROOT/'README.md').write_text(readme,encoding='utf-8')
gallery='<!doctype html><html lang="ko"><meta charset="utf-8"><title>Canva PM 포트폴리오 미리보기</title><style>body{font-family:Arial,sans-serif;background:#eef1f5;color:#17263c;margin:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(500px,1fr));gap:24px}figure{margin:0}img{width:100%;background:white}figcaption{padding:8px}a{color:#2457eb}</style><h1>Canva PM 포트폴리오</h1><p>'+html.escape(status)+'</p><p><a href="slides_patch.md">페이지별 원고</a> · <a href="asset_manifest.json">이미지 출처</a></p><main>'
for p in range(1,13): gallery+=f'<figure><a href="previews/{p:02d}-draft.png"><img src="previews/{p:02d}-draft.png" alt="{p:02d}페이지 Canva 미리보기"></a><figcaption>{p:02d} / 12</figcaption></figure>'
(ROOT/'gallery.html').write_text(gallery+'</main></html>',encoding='utf-8')
assert len(STATE['fills'])==13
assert not issues, issues
print(json.dumps({'status':status,'pages':12,'images':13,'geometry_issues':len(issues)},ensure_ascii=False))
