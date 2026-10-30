"""Create the submission PDF from this repository's production build HTML.

No browser automation: ReportLab draws selectable text and original images.
Run npm run build first, then run this script with the PDF Python runtime.
Requires beautifulsoup4, fonttools, brotli, reportlab, pypdf and Pillow.
Output and QA files go under output/pdf/common-portfolio; review before publishing.
"""
from pathlib import Path
import sys, json, re, html, io

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.codex_tmp/portfolio-pdf/deps'))
from bs4 import BeautifulSoup
from fontTools.ttLib import TTFont as Font
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
from pypdf import PdfReader
from PIL import Image

RELEASE = ROOT
OUT = ROOT / 'output/pdf/common-portfolio'
QA = OUT / 'qa'
OUT.mkdir(parents=True, exist_ok=True)
QA.mkdir(parents=True, exist_ok=True)
PDF = OUT / 'lee-jaeho-portfolio.pdf'
FONTROOT = QA / 'fonts'
FONTROOT.mkdir(exist_ok=True)
for weight, name in [(400, 'Portfolio'), (700, 'PortfolioBold')]:
    target = FONTROOT / f'{name}.ttf'
    if not target.exists():
        original = Font(RELEASE / 'public/pm/fonts/PretendardVariable.woff2')
        static = instantiateVariableFont(original, {'wght': weight}, inplace=False)
        static.flavor = None
        static.save(target)
    # Distinct PostScript names prevent ReportLab deduplicating the two weights.
    static = Font(target)
    variant = 'Bold' if weight == 700 else 'Regular'
    for platform, encoding, language in [(3, 1, 0x409), (1, 0, 0)]:
        for name_id, value in {1:'PortfolioPDF', 2:variant, 3:f'PortfolioPDF-{variant}', 4:f'PortfolioPDF {variant}', 6:f'PortfolioPDF-{variant}'}.items():
            static['name'].setName(value,name_id,platform,encoding,language)
    static.save(target)
    pdfmetrics.registerFont(TTFont(name, str(target)))
pdfmetrics.registerFontFamily('Portfolio', normal='Portfolio', bold='PortfolioBold')

soup = BeautifulSoup((RELEASE / '.next/server/app/portfolio.html').read_text(encoding='utf-8'), 'html.parser')
pages = soup.select('[data-common-portfolio] > section')
assert len(pages) == 7
INK, MUTED, ACCENT, LINE = '#17191d', '#5d626b', '#2457d8', '#dce0e7'
W, H = 1200, 675
SCALE = 320 * 72 / 25.4 / W
c = Canvas(str(PDF), pagesize=(W*SCALE, H*SCALE), pageCompression=1)
c.setTitle('이재호 | 경력과 프로젝트 포트폴리오')
c.setAuthor('이재호')
c.setSubject('부산참여연대 경력과 SSAFY 프로젝트 · 공통 제출용 포트폴리오')
boxes = []
page_no = 0

def sel(e, suffix):
    return e.find(class_=lambda v: v and any(part.endswith('__' + suffix) for part in v.split()))

def text(e):
    if e is None: return ''
    copy = BeautifulSoup(str(e), 'html.parser')
    for br in copy.find_all('br'): br.replace_with('\n')
    return copy.get_text().strip()

def para(value, x, y, width, size=17, bold=False, color=INK, leading=None):
    value = html.escape(value).replace('\n', '<br/>')
    style = ParagraphStyle('text', fontName='PortfolioBold' if bold else 'Portfolio', fontSize=size,
        leading=leading or size*1.6, textColor=HexColor(color), splitLongWords=True)
    p = Paragraph(value, style)
    _, height = p.wrap(width, 1000)
    p.drawOn(c, x, H-y-height)
    boxes.append({'page':page_no,'text':re.sub('<[^>]+>','',html.unescape(value))[:100], 'x':x,'top':y,'width':width,'bottom':y+height})
    return y+height

def rule(y, x=46, width=1108):
    c.setStrokeColor(HexColor(LINE)); c.setLineWidth(.7)
    c.line(x, H-y, x+width, H-y)

def link(value, url, x, y, width, size=12):
    bottom=para(value,x,y,width,size,color=MUTED,leading=size*1.5)
    if url.startswith('#'):
        c.linkRect('', url[1:], (x,H-bottom,x+width,H-y), relative=1, thickness=0)
    else:
        if url.startswith('/'): url='https://ficstory.dev'+url
        c.linkURL(url,(x,H-bottom,x+width,H-y),relative=1,thickness=0)
    return bottom

def image_path(img):
    url=img['src']
    if url.startswith('/_next/'): return RELEASE / '.next' / url[len('/_next/'):]
    return RELEASE / 'public' / url.lstrip('/')

def picture(fig, x, y, width, height):
    img=fig.find('img'); path=image_path(img)
    with Image.open(path) as im: iw,ih=im.size
    ratio=min(width/iw,height/ih)
    rw,rh=iw*ratio,ih*ratio
    left=x+(width-rw)/2
    source=ImageReader(str(path))
    if 'civic-report' not in path.name:
        with Image.open(path) as opened:
            raster=opened.convert('RGB')
            raster.thumbnail((1000,1400),Image.Resampling.LANCZOS)
            encoded=io.BytesIO()
            raster.save(encoded,format='JPEG',quality=88,optimize=True)
            encoded.seek(0)
            source=ImageReader(encoded)
    c.drawImage(source,left,H-y-rh,rw,rh,mask='auto')
    url='https://ficstory.dev'+img['src']
    c.linkURL(url,(left,H-y-rh,left+rw,H-y),relative=1,thickness=0)
    boxes.append({'page':page_no,'image':str(path),'x':left,'top':y,'width':rw,'bottom':y+rh})
    caption=fig.find('figcaption')
    bottom=y+rh
    if caption: bottom=para(text(caption),x,bottom+9,width,12,color=MUTED,leading=18)
    return bottom

def narrative(element,x,y,width,size=17):
    y=para(text(element.find('h3')),x,y,width,19,True,leading=27)
    return para(text(element.find('p')),x,y+6,width,size,color=MUTED,leading=27.4)+20

def role(element,x,y,width):
    rule(y,x,width)
    bottom=para(text(element),x,y+9,width,14,color=MUTED,leading=21)
    rule(bottom+9,x,width)
    return bottom+30

for page_no, page in enumerate(pages, 1):
    c.saveState(); c.scale(SCALE,SCALE)
    c.bookmarkPage(page['id']); c.addOutlineEntry(f'{page_no}. '+text(page.find('header').find('p')),page['id'])
    header=page.find('header')
    para(text(header.find('p')),46,30,580,14,True,ACCENT,21)
    p=Paragraph(html.escape(text(header.find('span'))),ParagraphStyle('right',fontName='Portfolio',fontSize=12,leading=18,textColor=HexColor(MUTED),alignment=2))
    _,h=p.wrap(450,80); p.drawOn(c,704,H-32-h)
    rule(64)
    footer=page.find('footer'); spans=footer.find_all('span',recursive=False)
    rule(635)
    para(text(spans[0]),46,645,750,12,color=MUTED,leading=18)
    if footer.find('a'): link(text(footer.find('a')),footer.find('a')['href'],963,645,119,12)
    para(f'{page_no:02d} / 07',1100,645,60,12,color=MUTED,leading=18)

    if page_no == 1:
        h1=page.find('h1'); title_lines=text(h1).split('\n')
        para(title_lines[0],46,103,1108,52,True,leading=64)
        para(title_lines[1],46,167,1108,52,True,ACCENT,64)
        para(text(sel(page,'coverIntro')),46,252,1000,19,color=MUTED,leading=31)
        identity=sel(page,'identity'); para('이재호',46,377,200,26,True,leading=34)
        para('LEE JAEHO',130,390,160,12,True,MUTED,18)
        yy=427
        for p in identity.find_all('p',recursive=False): yy=para(text(p),46,yy,360,14,color=MUTED,leading=23)+15
        yy=372
        for li in sel(page,'contents').find_all('li',recursive=False):
            a=li.find('a'); rule(yy,463,691)
            para(text(a.find('span')),463,yy+15,610,13,color=ACCENT,leading=20)
            end=para(text(a.find('strong')),463,yy+42,610,18,True,leading=27)
            link(text(a.find('small')),a['href'],1106,yy+29,48,12)
            c.linkRect('',a['href'][1:],(463,H-end,1073,H-yy),relative=1,thickness=0)
            yy=end+17
    elif page_no == 2:
        para(text(sel(page,'pageTitle')),46,92,780,36,True,leading=46)
        yy=role(sel(page,'role'),46,212,630)
        for n in page.find_all(class_=lambda v:v and v.endswith('__narrative')): yy=narrative(n,46,yy,630,16.5)
        picture(sel(page,'reportFigure'),786,122,335,412)
    elif page_no in (3,4):
        para(text(sel(page,'pageTitle')),46,92,1108,36,True,leading=46)
        picture(sel(page,'phoneFigure'),60,216,290,368)
        x,width=426,728
        yy=para(text(sel(page,'projectTitle')),x,211,width,24,True,leading=32)
        yy=para(text(sel(page,'projectIntro')),x,yy+9,width,16,color=MUTED,leading=25)+14
        yy=role(sel(page,'role'),x,yy,width)
        for n in page.find_all(class_=lambda v:v and v.endswith('__narrative')): yy=narrative(n,x,yy,width,17)
        ending=sel(page,'result') or sel(page,'followup')
        if ending: para(text(ending),x,yy-2,width,14,color=MUTED,leading=21)
    elif page_no in (5,6):
        para(text(sel(page,'pageTitle')),46,92,1108,36,True,leading=46)
        x,width=46,555
        yy=para(text(sel(page,'projectTitle')),x,214,width,24,True,leading=33)
        yy=para(text(sel(page,'projectIntro')),x,yy+9,width,16,color=MUTED,leading=26)+14
        yy=role(sel(page,'role'),x,yy,width)
        for n in page.find_all(class_=lambda v:v and v.endswith('__narrative')): yy=narrative(n,x,yy,width,17)
        picture(sel(page,'wideFigure'),650,271 if page_no==5 else 236,504,344)
    else:
        para(text(sel(page,'pageTitle')),46,92,1108,36,True,leading=46)
        grid=sel(page,'backgroundGrid')
        for col,(x,width) in zip(grid.find_all('div',recursive=False),[(46,590),(716,438)]):
            yy=175
            for child in col.find_all(recursive=False):
                if child.name=='h3': yy=para(text(child),x,yy,width,16,True,ACCENT,24)+18
                elif child.name=='dl':
                    for item in child.find_all('div',recursive=False):
                        yy=para(text(item.find('dt')),x,yy,width,18,True,leading=27)+4
                        yy=para(text(item.find('dd')),x,yy,width,16,color=MUTED,leading=25)+20
                elif child.name=='p': yy=para(text(child),x,yy,width,15,color=MUTED,leading=24)+14
        rule(586)
        xx=46
        for a in sel(page,'contact').find_all('a'):
            link(text(a),a['href'],xx,601,280,14); xx+=310
    c.restoreState(); c.showPage()
c.save()

reader=PdfReader(str(PDF))
assert len(reader.pages)==7
for i,p in enumerate(reader.pages,1):
    t=p.extract_text()
    assert f'{i:02d} / 07' in t
    assert len(t)>100
    for banned in ['서비스 화면 재현 데모 · 예시 데이터','실사용 데이터 및 이용 효과 미검증','서비스 이용자 수와 구분','2인 팀 프로젝트 · 추천·검색 기능은 팀원이 담당']:
        assert banned not in t
issues=[b for b in boxes if b['top']<0 or b['bottom']>673 or b['x']<0 or b['x']+b['width']>W]
body_overflow=[b for b in boxes if 70 < b['top'] < 635 and b['bottom']>627]
(QA/'layout.json').write_text(json.dumps({'pages':7,'bytes':PDF.stat().st_size,'issues':issues,'bodyOverflow':body_overflow,'boxes':boxes},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pdf':str(PDF),'pages':7,'bytes':PDF.stat().st_size,'issues':issues,'bodyOverflow':body_overflow},ensure_ascii=False))
assert not issues and not body_overflow, 'Layout overflow; adjust and re-render before delivery'
