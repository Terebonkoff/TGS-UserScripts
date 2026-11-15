"""
deploy_and_install.py
Автоматический деплой и интерактивное открытие скриптов в Яндекс Браузере через Task Scheduler.
"""

import sys
import os
import subprocess
import time

REPO_DIR = r"C:\Users\vlasi\Documents\TGS-UserScripts"
DOCS_DIR = r"C:\Users\vlasi\Documents"
BASE_DIR = r"E:\! ANTIGRAVITY BASE !\userscripts"
PENDING_FILE = os.path.join(REPO_DIR, "pending_urls.txt")

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
    "rutracker_enhanced": {
        "file": "RuTracker_Enhanced_Suite.user.js",
        "base_file": "rutracker_enhanced_suite.user.js",
        "name": "RuTracker: Enhanced Suite (Alias)"
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

    # 1. Sync files to Documents and Base
    for s in targets:
        fpath = os.path.join(REPO_DIR, s["file"])
        if not os.path.exists(fpath):
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            text = f.read()

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
    subprocess.run(["git", "commit", "-m", msg], cwd=REPO_DIR, capture_output=True, text=True)
    subprocess.run(["git", "push", "origin", "main"], cwd=REPO_DIR, capture_output=True, text=True)

    commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=REPO_DIR, text=True).strip()
    print(f"Pushed commit: {commit_hash}")

    # 3. Write URLs for interactive execution via Task Scheduler
    urls = []
    for s in targets:
        url = f"https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/{commit_hash}/{s['file']}"
        urls.append(f"{url}|{s['name']}")
        print(f"Queued install tab for: {s['name']}")

    with open(PENDING_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(urls) + "\n")

    # 4. Trigger Task Scheduler task in user's interactive Session 1
    res = subprocess.run(["schtasks", "/run", "/tn", "TGS_OpenInstallTabs"], capture_output=True, text=True)
    print("Task Scheduler trigger:", res.stdout.strip() or res.stderr.strip())

if __name__ == "__main__":
    t = sys.argv[1] if len(sys.argv) > 1 else "all"
    deploy(t)
