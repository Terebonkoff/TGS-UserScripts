"""
deploy_and_install.py
Автоматический деплой и отправка скриптов в Violentmonkey браузера.
Использование:
    python deploy_and_install.py                  # Все скрипты
    python deploy_and_install.py f95              # Только F95Zone
    python deploy_and_install.py pornolab         # Только Pornolab
    python deploy_and_install.py rutracker        # Только RuTracker
    python deploy_and_install.py comix            # Только COMIX Downloader
    python deploy_and_install.py downloader       # Только Fast Downloader
"""

import sys
import os
import re
import subprocess
import time

REPO_DIR = r"C:\Users\vlasi\Documents\TGS-UserScripts"
DOCS_DIR = r"C:\Users\vlasi\Documents"
BASE_DIR = r"E:\! ANTIGRAVITY BASE !\userscripts"
BROWSER_EXE = r"C:\Program Files\Yandex\YandexBrowser\Application\browser.exe"

SCRIPTS = {
    "f95": {
        "file": "F95Zone_Enhanced_Suite.user.js",
        "base_file": "f95zone_enhanced_suite.user.js",
        "name": "F95Zone: Enhanced Suite"
    },
    "pornolab": {
        "file": "Pornolab_Complete_Suite.user.js",
        "base_file": "pornolab_complete_suite.user.js",
        "name": "Pornolab: Enhanced Suite"
    },
    "rutracker": {
        "file": "RuTracker_Complete_Suite.user.js",
        "base_file": "rutracker_complete_suite.user.js",
        "name": "RuTracker: Enhanced Suite"
    },
    "comix": {
        "file": "COMIX_ZIP_Downloader_by_TGS.user.js",
        "base_file": "COMIX_ZIP_Downloader_by_TGS.user.js",
        "name": "COMIX ZIP Downloader"
    },
    "downloader": {
        "file": "Vik1ngFile_MediaFire_Downloader_by_TGS.user.js",
        "base_file": "Vik1ngFile_MediaFire_Downloader_by_TGS.user.js",
        "name": "Vik1ngFile/MediaFire Downloader"
    }
}

def deploy(target="all", commit_msg=None):
    targets = []
    if target.lower() in ["all", ""]:
        targets = list(SCRIPTS.values())
    else:
        for k, v in SCRIPTS.items():
            if target.lower() in k or k in target.lower():
                targets.append(v)
        if not targets:
            print(f"Unknown target: {target}")
            return

    # 1. Sync and verify headers
    for s in targets:
        fpath = os.path.join(REPO_DIR, s["file"])
        if not os.path.exists(fpath):
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            text = f.read()

        fn = s["file"]
        if "@downloadURL" not in text:
            urls_block = (
                f"// @downloadURL  https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/main/{fn}\n"
                f"// @updateURL    https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/main/{fn}\n"
                f"// @homepageURL  https://github.com/Terebonkoff/TGS-UserScripts\n"
                f"// @supportURL   https://github.com/Terebonkoff/TGS-UserScripts/issues\n"
            )
            text = text.replace("// ==/UserScript==", urls_block + "// ==/UserScript==", 1)
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(text)

        # Sync to Documents
        with open(os.path.join(DOCS_DIR, s["file"]), "w", encoding="utf-8") as f:
            f.write(text)

        # Sync to Base
        bp = os.path.join(BASE_DIR, s["base_file"])
        if os.path.exists(bp):
            with open(bp, "w", encoding="utf-8") as f:
                f.write(text)

    # 2. Git commit & push
    subprocess.run(["git", "add", "-A"], cwd=REPO_DIR, check=True)
    msg = commit_msg or f"Update and deploy {'all' if target == 'all' else target} userscripts"
    res = subprocess.run(["git", "commit", "-m", msg], cwd=REPO_DIR, capture_output=True, text=True)
    subprocess.run(["git", "push", "origin", "main"], cwd=REPO_DIR, capture_output=True, text=True)

    commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=REPO_DIR, text=True).strip()
    print(f"Pushed commit: {commit_hash}")

    # 3. Open install tabs in Yandex Browser
    for s in targets:
        url = f"https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/{commit_hash}/{s['file']}"
        subprocess.Popen([BROWSER_EXE, url])
        print(f"Triggered Violentmonkey install tab for: {s['name']}")
        time.sleep(0.4)

if __name__ == "__main__":
    t = sys.argv[1] if len(sys.argv) > 1 else "all"
    deploy(t)
