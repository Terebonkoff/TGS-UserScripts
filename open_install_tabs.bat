@echo off
chcp 65001 >nul
set "BROWSER=C:\Program Files\Yandex\YandexBrowser\Application\browser.exe"
set "URL_FILE=C:\Users\vlasi\Documents\TGS-UserScripts\pending_urls.txt"

if not exist "%URL_FILE%" exit /b 0

for /f "usebackq delims=" %%U in ("%URL_FILE%") do (
    start "" "%BROWSER%" "%%U"
    timeout /t 1 /nobreak >nul
)

del /f /q "%URL_FILE%" >nul 2>&1
