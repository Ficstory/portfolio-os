"""Record four original Android screens with offline fixtures on AekkimDemo only.

Run with Python 3: record-extra-screens.py [promotions|mypage|payments|analysis]
Install the APK produced with extended-offline-demo.patch first.
These coordinates were verified at 1080x2340 and 420dpi.
"""
from pathlib import Path
import json
import os
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')
ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'package.json').is_file())
SDK = Path(os.environ.get('ANDROID_HOME', Path.home() / 'AppData/Local/Android/Sdk'))
BASE = [str(SDK / 'platform-tools/adb.exe'), '-s', 'emulator-5560']
PACKAGE = 'com.ssafy.e106.demo'
OUT = ROOT / '.codex_tmp/aekkim-extra-capture'
SHOTS = ROOT / 'docs/pm-redesign/aekkim-demo/recordings/screenshots'
OUT.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)

def adb(*args):
    return subprocess.run([*BASE, *map(str, args)], capture_output=True, check=True)

def launch(screen):
    adb('shell', 'am', 'force-stop', PACKAGE)
    adb('shell', 'am', 'start', '-n', PACKAGE + '/com.ssafy.e106.app.MainActivity',
        '--es', 'demo_screen', screen)

def tap(x, y):
    adb('shell', 'input', 'tap', x, y)

def swipe(x1, y1, x2, y2):
    adb('shell', 'input', 'swipe', x1, y1, x2, y2, 700)

def back():
    adb('shell', 'input', 'keyevent', 4)

def shot(name):
    (SHOTS / f'{name}.png').write_bytes(adb('exec-out', 'screencap', '-p').stdout)

def ui():
    remote = f'/sdcard/aekkim-capture-{time.monotonic_ns()}.xml'
    adb('shell', 'uiautomator', 'dump', remote)
    xml = adb('shell', 'cat', remote).stdout.decode('utf-8')
    adb('shell', 'rm', remote)
    return xml

def ready(screen, text):
    launch(screen)
    time.sleep(8)
    for _ in range(4):
        try:
            state = ui()
            if PACKAGE in state and text in state:
                return
        except subprocess.CalledProcessError:
            pass
        time.sleep(2)
    raise RuntimeError(f'{screen} did not reach expected UI: {text}')

def capture(name, seconds, events):
    remote = f'/sdcard/aekkim-{name}-extra.mp4'
    proc = subprocess.Popen([*BASE, 'shell', 'screenrecord', '--time-limit', str(seconds),
                             '--bit-rate', '8000000', remote], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    started = time.monotonic()
    log = []
    for second, label, action in events:
        time.sleep(max(0, started + second - time.monotonic()))
        actual = round(time.monotonic() - started, 3)
        action()
        log.append({'scheduled': second, 'actual': actual, 'action': label})
        print(name, actual, label, flush=True)
    stdout, stderr = proc.communicate(timeout=seconds + 15)
    if proc.returncode:
        raise RuntimeError(stderr.decode(errors='replace'))
    adb('pull', remote, OUT / f'{name}-raw.mp4')
    adb('shell', 'rm', remote)
    (OUT / f'{name}-timeline.json').write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Saved {name}-raw.mp4', flush=True)

def promotions():
    ready('promotions', 'OTT 함께 보기')
    capture('01-promotions', 34, [
        (1.5, '혜택 목록', lambda: shot('01-promotions-list')),
        (4, '묶음 혜택 상세 열기', lambda: tap(535, 1500)),
        (7, '혜택 상세', lambda: shot('01-promotions-detail')),
        (10, '상세 아래로 스크롤', lambda: swipe(550, 1840, 550, 900)),
        (13, '목록으로 돌아가기', back),
        (16, '프로모션 탭', lambda: tap(320, 790)),
        (19, '카드 혜택 탭', lambda: tap(560, 790)),
        (22, '음악 카테고리', lambda: tap(300, 540)),
        (25, 'AI 카테고리', lambda: tap(460, 540)),
        (28, 'OTT 카테고리', lambda: tap(130, 540)),
        (30, '묶음 탭', lambda: tap(130, 790)),
    ])

def mypage():
    ready('mypage', 'demo@example.com')
    capture('02-mypage', 25, [
        (1.5, '프로필과 설정', lambda: shot('02-mypage-profile')),
        (4, '체크인 알림 끄기', lambda: tap(930, 804)),
        (7, '체크인 알림 켜기', lambda: tap(930, 804)),
        (10, '혜택 정보 수신 동의 켜기', lambda: tap(930, 1094)),
        (13, '앱 정보와 계정 메뉴로 스크롤', lambda: swipe(550, 1860, 550, 1060)),
        (16, '앱 정보 화면', lambda: shot('02-mypage-info')),
        (19, '프로필로 돌아오기', lambda: swipe(550, 650, 550, 1650)),
        (22, '설정 완료 화면', lambda: shot('02-mypage-final')),
    ])

def payments():
    ready('payments', '최근 결제일 9월 1일')
    capture('03-onboarding-payments', 32, [
        (1.5, '자동 감지된 결제 내역', lambda: shot('03-payments-list')),
        (5, '아래 결제 내역으로 스크롤', lambda: swipe(550, 1830, 550, 900)),
        (8, '확인이 필요한 결제', lambda: shot('03-payments-review-summary')),
        (11, '검토할 결제 목록 열기', lambda: tap(530, 1880)),
        (14, '결제 내역 펼치기', lambda: tap(950, 440)),
        (17, '결제 내역 상세', lambda: shot('03-payments-review-detail')),
        (20, '구독 확인 화면으로 돌아가기', back),
        (23, '확인 완료', lambda: tap(530, 2220)),
        (28, '등록 후 대시보드', lambda: shot('03-payments-dashboard')),
    ])

def analysis():
    # Keep a real app screen underneath while the new activity starts.
    ready('payments', '최근 결제일 9월 1일')
    capture('04-onboarding-ai-analysis', 35, [
        (2, '분석 화면 실행', lambda: launch('analysis')),
        (24, '분석 결과', lambda: shot('04-analysis-result')),
        (27, '결과 목록 살펴보기', lambda: swipe(550, 1800, 550, 1500)),
        (30, '결과 목록 상단으로 돌아오기', lambda: swipe(550, 1200, 550, 1800)),
        (33, '분석 결과 화면 확인', lambda: shot('04-analysis-result')),
    ])

if __name__ == '__main__':
    assert 'AekkimDemo' in adb('emu', 'avd', 'name').stdout.decode(), 'Use the dedicated AekkimDemo AVD.'
    assert '1080x2340' in adb('shell', 'wm', 'size').stdout.decode(), 'Use verified recording resolution.'
    adb('shell', 'settings', 'put', 'system', 'show_touches', '0')
    selected = sys.argv[1:]
    for screen in selected or ['promotions', 'mypage', 'payments', 'analysis']:
        {'promotions': promotions, 'mypage': mypage, 'payments': payments, 'analysis': analysis}[screen]()
