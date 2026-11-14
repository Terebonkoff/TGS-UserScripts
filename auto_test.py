import os
import sys
import time
import pywinauto
from pywinauto import Desktop

log_path = r"C:\Users\vlasi\Documents\TGS-UserScripts\auto_test.log"
with open(log_path, "w", encoding="utf-8") as f:
    f.write(f"Started at {time.ctime()}\n")
    windows = Desktop(backend="win32").windows()
    for w in windows:
        try:
            t = w.window_text()
            if t:
                f.write(f"HWND: {w.handle} | Class: {w.class_name()} | Title: {t}\n")
        except Exception as e:
            f.write(f"Err: {e}\n")
    f.write("Done!\n")
