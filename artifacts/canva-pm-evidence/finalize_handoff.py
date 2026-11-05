from __future__ import annotations
import hashlib, json, re, runpy, zipfile
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parent
WORKSPACE=ROOT.parent.parent
state=json.loads((ROOT/'canva-review-state.json').read_text(encoding='utf-8'))
state['status']='committed'
state['transaction_state']='committed; transaction ID no longer valid for edits'
state['saved_at_date']='2026-09-14 Asia/Seoul'
(ROOT/'canva-review-state.json').write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf-8')
saved_text=(ROOT/'sources/canva-saved-text.txt').read_text(encoding='utf-8')
norm=lambda t:re.sub(r'\s+','',t)
missing=[]
for r in state['richtexts']:
    text=''.join(x.get('text','') for x in r['regions'])
    if norm(text) not in norm(saved_text): missing.append({'page':r['page_index'],'text':text})
assert not missing, missing
record=json.loads((ROOT/'canva-save-result.json').read_text(encoding='utf-8'))
record['readback_verification']={'all_visible_text_elements_matched':True,'element_count':len(state['richtexts']),'page_count':12}
(ROOT/'canva-save-result.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')

ids={
'p05-meeting-readable.png':'MAHVLJy9iXs','smile6-create-join-entry-00.50.png':'MAHVLAor8Pw','smile6-waiting-09.50.png':'MAHVLLQ5UuY',
'p07-requirements-readable.png':'MAHVLCiztFc','p07-screen-spec-readable.png':'MAHVLMk6CuY',
'p08-plan-readable.png':'MAHVLJmMMiM','p08-qa-readable.png':'MAHVLPgZqHg','aekkim8-review-payment.png':'MAHVLIkqBOM',
'busan9-mvp-meeting.png':'MAHVLPza-CQ','busan9-marker-change-readable.png':'MAHVLJ5euRc','busan9-route-map.png':'MAHVLKlm_XM',
'play10-onboarding-card-crop.png':'MAHVLIBl6ro','play10-first-recommendations-crop.png':'MAHVLDhEEcA'}
m=json.loads((ROOT/'asset_manifest.json').read_text(encoding='utf-8'))
m['상태']='사용자 미리보기 승인 후 Codex가 Canva에 13개 자료 삽입 및 12페이지 수정 저장 완료'
m['design_id']='DAHVKsJYGbg'
m['canva_url']='https://www.canva.com/design/DAHVKsJYGbg/7oiqu_OCUuH7PLQE0zCKrw/edit'
m['저장_근거']='canva-save-result.json: status committed + 본문 전체 readback 일치'
m['로컬_경로_기준']={'workspace':str(WORKSPACE),'package':str(ROOT)}
inserted=m.pop('현재_초안_삽입',m.get('Canva_저장_삽입',[]))
m['Canva_저장_삽입']=inserted
collected=json.loads((ROOT/'assets_collected.json').read_text(encoding='utf-8'))['assets']
collected_by_name={Path(a['file']).name:a for a in collected}
for a in inserted:
    name=Path(a['파일']).name
    f=next(f for f in state['fills'] if f['asset_id']==ids[name])
    a['페이지']=f['page_index'];a['상태']='Canva 저장 완료';a['canva_asset_id']=f['asset_id'];a['canva_element_id']=f['element_id'];a['배치']=f['containerElement']
    if a.get('projectURL','').startswith('/'):a['projectURL']='https://ficstory.dev'+a['projectURL']
    if a.get('public_url','') and a['public_url'].startswith('/'):a['public_url']='https://ficstory.dev'+a['public_url']
    if name.startswith('smile6-'):
        a['원본_로컬']='C:/Users/ljh43/OneDrive/Desktop/workspace/SSAFY/프로젝트/2. 공통pjt/캡처/초대배틀.mp4'
        a['동일_원본_사본']='C:/Users/ljh43/OneDrive/Desktop/workspace/SSAFY/프로젝트/2. 공통pjt/S14P11E207/docs/demo/videos/invite-battle.mp4'
        a['패키지_원본']='sources/smile-invite-original.mp4'
        a['원본_sha256']='dd59c389ba982f86e66f975f9491bdeaac7bbdb04249082c41f462ced3db74b7'
        a['timestamp_seconds']=0.5 if 'entry' in name else 9.5
        a['원본_URL_상태']='공개 URL 없음; 로컬 원본에서 직접 추출'
    if name=='busan9-marker-change-readable.png':a['패키지_원본']='sources/busan-marker-log-verbatim.txt'
    if name in collected_by_name:a['상세_원본_확보기록']=collected_by_name[name]
for a in m['보조자료_미삽입']:
    name=Path(a['파일']).name
    if name in collected_by_name:
        a['상세_원본_확보기록']=collected_by_name[name]
        a['원본_로컬']=collected_by_name[name]['source_local_path']
    a['페이지']=None
all_assets=inserted+m['보조자료_미삽입']
assert len(inserted)==13 and len(all_assets)==23
assert set(a['파일'] for a in all_assets)==set(p.relative_to(ROOT).as_posix() for p in (ROOT/'assets').glob('*.png'))
for a in all_assets:
    p=ROOT/a['파일'];assert p.exists(),p
    assert hashlib.sha256(p.read_bytes()).hexdigest()==a['sha256'],p
    with Image.open(p) as im:im.verify()
m['검수'].update({'삽입_파일수':13,'전체_asset_파일수':23,'sha256_불일치':0,'페이지별_삽입수':{'05':1,'06':2,'07':2,'08':3,'09':3,'10':2}})
(ROOT/'asset_manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8')

audit=(ROOT/'source_audit.md').read_text(encoding='utf-8')
audit=audit.replace('상태: 인계용 초안. Canva 편집본은 13개 이미지가 적용된 상태지만 아직 저장·승인 전이다. 저장 완료나 승인 완료로 표현하지 않는다.','상태: 사용자 미리보기 승인 후 Canva 저장 완료. 실제 자료 13개, 12페이지 문구·출처 보완. commit 응답과 저장 후 본문 대조 결과는 canva-save-result.json에 있다.')
audit=audit.replace('SSAFY/프로젝트/2. 공통pjt/S14P11E207/캡처/초대배틀.mp4','SSAFY/프로젝트/2. 공통pjt/캡처/초대배틀.mp4')
(ROOT/'source_audit.md').write_text(audit,encoding='utf-8')
questions='''# 남은 자료와 확인 질문

Canva 저장은 완료됐다. 아래 항목은 현재 확보된 근거로 단정할 수 없어 추가 자료 또는 수동 반영이 필요하다.

1. **웃지마게임 방 생성 완료·코드 입력 과정:** 진입(00:00.50)과 2인 대기실(00:09.50)은 원본 영상으로 확보했다. 생성 완료나 코드를 실제로 입력해 입장하는 과정을 보여주는 별도 원본 캡처·영상이 있는가? 현재 영상에 해당 단계가 없어 만들거나 랜덤 매칭 장면으로 대체하지 않았다.
2. **웃지마게임·애낌의 팀장 명칭:** 초기 Canva의 팀장 표현과 최신 사이트의 PM·FE 표기를 확인할 공식 역할 기록이 있는가? 현재 저장본에서는 확인 가능한 역할만 표기했다.
3. **부산이음길 81건/8주:** 해당 수치는 어떤 경로·기간을 기준으로 개인 또는 팀의 커밋을 집계한 것인가? 정의 확인 전에는 저장본에 복원하지 않는다.
4. **접근되지 않은 첨부물:** codex_pm_portfolio_handoff.md와 slide_asset_manifest.json은 실제 접근 가능한 파일로 확보되지 않았다. 이전 인계와 반드시 맞춰야 할 사항이 있으면 원본 파일의 확인이 필요하다. 기존 개인 포트폴리오 PPTX도 제공되지 않아 별도 PPTX 보완본을 제작하지 않았다.
5. **발표자 노트 수동 교체:** Canva MCP가 발표자 노트 편집을 지원하지 않아 기존의 소문자 출처·초대방 미확보·부산 FE/문서 중심 설명이 남아 있다. slides_patch.md에 각 페이지의 교체 원고를 작성했다. Canva 화면 본문은 이미 보완되어 저장됐다.

애낌의 개인 구현과 팀 QA는 저장본에서 분리했다. 부산 기관 섭외·인터뷰·MVP·지도 구현은 근거를 확보했으며, 기관 섭외를 현장 사용자 검증 완료로 확대하는 추가 표현은 사용하지 않았다.
'''
(ROOT/'remaining_questions.md').write_text(questions,encoding='utf-8')
runpy.run_path(str(ROOT/'build_handoff.py'),run_name='__main__')

# Superseded trial transactions are not the final handoff. Keep their local files
# for audit, but do not package them as replayable final instructions.
excluded={'canva-draft-after.json','canva-edit-operations.json','canva-fixed-draft.json','canva-final-state.json','layout-draft.json'}
files=[]
for p in sorted(ROOT.rglob('*')):
    if not p.is_file() or '__pycache__' in p.parts:continue
    if p.parent==ROOT and p.name in excluded:continue
    if p.parent==ROOT/'previews' and not re.fullmatch(r'\d{2}-draft\.png',p.name):continue
    files.append(p)
required=['asset_manifest.json','slides_patch.md','remaining_questions.md','qa_report.md','README.md','canva-save-result.json','gallery.html']
assert all((ROOT/r) in files for r in required)
assert sum(p.parent==ROOT/'previews' for p in files)==12
zip_path=ROOT.parent/'canva-pm-portfolio-handoff.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in files:z.write(p,'canva-pm-evidence/'+p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(zip_path) as z:
    assert z.testzip() is None
    members=z.namelist()
result={'status':'saved_and_packaged','visible_text_elements_matched':len(state['richtexts']),'inserted_images':13,'total_assets':23,'preview_pages':12,'zip_files':len(members),'zip_bytes':zip_path.stat().st_size,'zip_sha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'zip':str(zip_path)}
(ROOT.parent/'canva-pm-package-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
