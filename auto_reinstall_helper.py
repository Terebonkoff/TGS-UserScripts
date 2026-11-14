# -*- coding: utf-8 -*-
"""
auto_reinstall_helper.py
Автоматическое открытие, подтверждение (Переустановить / Установить) и закрытие вкладки скрипта в Яндекс Браузере.
"""

import os
import sys
import time
import subprocess
import ctypes
import pyautogui

USERPROFILE = os.environ.get("USERPROFILE") or r"C:\Users\vlasi"
REPO_DIR = os.path.join(USERPROFILE, "Documents", "TGS-UserScripts")
PENDING_FILE = os.path.join(REPO_DIR, "pending_urls.txt")
LOG_FILE = os.path.join(REPO_DIR, "auto_install.log")

BROWSER_EXE = r"C:\Program Files\Yandex\YandexBrowser\Application\browser.exe"
if not os.path.exists(BROWSER_EXE):
    BROWSER_EXE = r"C:\Users\vlasi\AppData\Local\Yandex\YandexBrowser\Application\browser.exe"

user32 = ctypes.windll.user32

def log(msg):
    ts = time.strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{ts} {msg}"
    print(line)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass

def find_yandex_hwnd():
    found_hwnd = None
    def enum_cb(hwnd, lparam):
        nonlocal found_hwnd
        if user32.IsWindowVisible(hwnd):
            cls_buf = ctypes.create_unicode_buffer(256)
            user32.GetClassNameW(hwnd, cls_buf, 256)
            if "chrome_yandex_widgetwin_1" in cls_buf.value.lower():
                found_hwnd = hwnd
                return False
        return True

    WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_void_p, ctypes.c_void_p)
    user32.EnumWindows(WNDENUMPROC(enum_cb), 0)
    return found_hwnd

def get_window_title(hwnd):
    if not hwnd or not user32.IsWindow(hwnd):
        return ""
    length = user32.GetWindowTextLengthW(hwnd)
    if length > 0:
        buf = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buf, length + 1)
        return buf.value
    return ""

def bring_to_foreground(hwnd):
    try:
        if user32.IsIconic(hwnd):
            user32.ShowWindow(hwnd, 9)  # SW_RESTORE
        else:
            user32.ShowWindow(hwnd, 5)  # SW_SHOW
        user32.SetForegroundWindow(hwnd)
    except Exception as e:
        log(f"Error bringing to foreground: {e}")

def process_single_script(url, script_name):
    log(f"Processing script: {script_name}")
    log(f"Opening URL: {url}")

    # 1. Open the URL in Yandex Browser
    subprocess.Popen([BROWSER_EXE, url])

    # 2. Wait for Violentmonkey confirm tab to open and render
    t0 = time.time()
    tab_ready = False
    hwnd = None

    while time.time() - t0 < 6.0:
        time.sleep(0.4)
        hwnd = find_yandex_hwnd()
        if hwnd:
            title = get_window_title(hwnd)
            # Check if confirm tab is loaded
            keywords = ["violentmonkey", "установ", "reinstall", "install", script_name.lower()]
            if any(k in title.lower() for k in keywords):
                tab_ready = True
                log(f"Detected confirm tab: '{title}' (after {time.time()-t0:.1f}s)")
                break

    if not hwnd:
        hwnd = find_yandex_hwnd()

    if not hwnd:
        log("ERROR: Could not find Yandex Browser window!")
        return False

    # 3. Bring window to foreground
    bring_to_foreground(hwnd)
    time.sleep(0.5)

    # 4. Trigger Violentmonkey install hotkey: Ctrl+Enter
    log("Sending Ctrl+Enter to trigger Reinstall/Install...")
    pyautogui.hotkey('ctrl', 'enter')

    # 5. Wait for Violentmonkey to save script into database
    time.sleep(1.2)

    # 6. Check if tab closed automatically or is still open
    cur_title = get_window_title(hwnd)
    log(f"Title after Ctrl+Enter: '{cur_title}'")

    # If the title still looks like the install tab, close it with Ctrl+W
    if any(k in cur_title.lower() for k in ["violentmonkey", "установ", script_name.lower()]):
        log("Tab still open, sending Ctrl+W to close it...")
        pyautogui.hotkey('ctrl', 'w')
        time.sleep(0.4)
    else:
        log("Tab already closed automatically by Violentmonkey!")

    log(f"Successfully finished install cycle for: {script_name}")
    return True

def main():
    if not os.path.exists(PENDING_FILE):
        return

    try:
        with open(PENDING_FILE, "r", encoding="utf-8") as f:
            lines = [l.strip() for l in f if l.strip()]
    except Exception as e:
        log(f"Error reading pending file: {e}")
        return

    if not lines:
        return

    log(f"=== Starting auto reinstall helper for {len(lines)} item(s) ===")

    for line in lines:
        if "|" in line:
            url, name = line.split("|", 1)
        else:
            url = line
            name = os.path.basename(url).replace(".user.js", "")

        process_single_script(url.strip(), name.strip())
        time.sleep(0.8)

    try:
        os.remove(PENDING_FILE)
        log("Removed pending_urls.txt")
    except Exception:
        pass

    log("=== All scripts processed successfully! ===")

if __name__ == "__main__":
    main()
