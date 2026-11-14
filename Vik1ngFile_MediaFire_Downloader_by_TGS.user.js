// ==UserScript==
// @name         Vik1ngFile, MediaFire, Gofile & 1Fichier Downloader by TGS
// @namespace    https://www.patreon.com/Terebonkoff
// @version      4.0.5
// @description  Automates and accelerates downloads from MediaFire, Pixeldrain (bypasses speed limits), Gofile, 1Fichier, Datanodes, VIK1NGFILE, and unmasks F95Zone redirect links.
// @author       Terebonkoff
// @icon         https://purepng.com/public/uploads/thumbnail//sexy-little-caprice-in-white-dress-zly.png
// @match        https://vik1ngfile.site/f/*
// @match        https://*.mediafire.com/folder/*
// @match        https://mediafire.com/folder/*
// @match        https://*.mediafire.com/file/*
// @match        https://mediafire.com/file/*
// @match        https://*.datanodes.to/*
// @match        https://datanodes.to/*
// @match        https://pixeldrain.com/u/*
// @match        https://*.pixeldrain.com/u/*
// @match        https://f95zone.to/masked/*
// @match        https://*.f95zone.to/masked/*
// @match        https://*.gofile.io/d/*
// @match        https://gofile.io/d/*
// @match        https://*.1fichier.com/*
// @match        https://1fichier.com/*
// @grant        window.close
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/main/Vik1ngFile_MediaFire_Downloader_by_TGS.user.js
// @updateURL    https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/main/Vik1ngFile_MediaFire_Downloader_by_TGS.user.js
// @homepageURL  https://github.com/Terebonkoff/TGS-UserScripts
// @supportURL   https://github.com/Terebonkoff/TGS-UserScripts/issues
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname.toLowerCase();
    const path = window.location.pathname;

    // =========================================================================
    // 1. ПРОМЕЖУТОЧНЫЕ ССЫЛКИ F95ZONE (UNMASKER)
    // =========================================================================
    if (hostname.includes('f95zone.to') && path.includes('/masked/')) {
        const fullUrl = decodeURIComponent(window.location.href);

        // Ищем в строке целевой файлообменник
        const targetRegex = /https?:\/\/(www\.)?(pixeldrain\.com\/u|mediafire\.com\/(file|folder)|gofile\.io\/d|1fichier\.com\/\?|datanodes\.to|vik1ngfile\.site\/f)[^\s&"'>]+/i;
        const match = fullUrl.match(targetRegex);

        if (match) {
            window.location.replace(match[0]);
            return;
        }

        // Если ссылка в DOM (после отрисовки)
        document.addEventListener('DOMContentLoaded', () => {
            const link = document.querySelector('a[href*="pixeldrain.com/u/"], a[href*="mediafire.com/"], a[href*="gofile.io/d/"], a[href*="1fichier.com/"], a[href*="datanodes.to/"], a[href*="vik1ngfile.site/"]');
            if (link && link.href) {
                window.location.replace(link.href);
            }
        });
        return;
    }

    // Ждем готовности DOM для остальных сервисов
    document.addEventListener('DOMContentLoaded', () => {

        // =========================================================================
        // 2. PIXELDRAIN (ОБХОД ОГРАНИЧЕНИЙ СКОРОСТИ ЧЕРЕЗ API)
        // =========================================================================
        if (hostname.includes('pixeldrain.com') && path.includes('/u/')) {
            const cleanPath = path.replace(/\/+$/, '');
            const fileId = cleanPath.split('/').pop();

            if (fileId && fileId !== 'u') {
                const directApiUrl = `https://pixeldrain.com/api/file/${fileId}?download`;

                const triggerLink = document.createElement('a');
                triggerLink.href = directApiUrl;
                triggerLink.setAttribute('download', '');
                triggerLink.style.display = 'none';
                document.body.appendChild(triggerLink);
                triggerLink.click();

                setTimeout(() => {
                    triggerLink.remove();
                    window.close();
                }, 3000);
            }
        }

        // =========================================================================
        // 3. GOFILE.IO (АВТОМАТИЧЕСКАЯ ЗАГРУЗКА)
        // =========================================================================
        if (hostname.includes('gofile.io') && path.includes('/d/')) {
            let gofileTriggered = false;

            function processGofile() {
                if (gofileTriggered) return;

                // 1. Поиск прямой кнопки скачивания в таблице/списке
                const dlBtn = document.querySelector('button#filesContentTableActionsDownload, a[href*="/download/web/"], button.filesContentTableActionsDownload, a.file-download');
                if (dlBtn && !dlBtn.disabled) {
                    gofileTriggered = true;
                    dlBtn.click();
                    setTimeout(() => { window.close(); }, 4000);
                    return;
                }

                // 2. Поиск по тексту или атрибутам кнопок
                const buttons = Array.from(document.querySelectorAll('button, a.btn, a[role="button"]'));
                const textDlBtn = buttons.find(b => {
                    const txt = (b.textContent || b.innerText || '').toLowerCase().trim();
                    return (txt === 'download' || txt.includes('download all') || txt === 'скачать') && !b.disabled;
                });

                if (textDlBtn) {
                    gofileTriggered = true;
                    textDlBtn.click();
                    setTimeout(() => { window.close(); }, 4000);
                }
            }

            setTimeout(processGofile, 1500);
            const gofileObs = new MutationObserver(processGofile);
            gofileObs.observe(document.body, { childList: true, subtree: true });
        }

        // =========================================================================
        // 4. 1FICHIER (АВТОМАТИЧЕСКАЯ ОБРАБОТКА И СКАЧИВАНИЕ)
        // =========================================================================
        if (hostname.includes('1fichier.com')) {
            let f1Triggered = false;

            function process1Fichier() {
                if (f1Triggered) return;

                // Шаг 2: Страница с готовой финальной ссылкой
                const finalDlLink = document.querySelector('a.ok.btn-general.btn-orange, a[href*="1fichier.com/c/"], a[href*="1fichier.com/a/"]');
                if (finalDlLink) {
                    const txt = (finalDlLink.textContent || '').toLowerCase();
                    if (txt.includes('click here') || txt.includes('cliquez ici') || txt.includes('скачать') || txt.includes('download')) {
                        f1Triggered = true;
                        finalDlLink.click();
                        setTimeout(() => { window.close(); }, 3500);
                        return;
                    }
                }

                // Шаг 1: Первая страница (кнопка получения бесплатной ссылки)
                const freeSubmitBtn = document.querySelector('input[type="submit"][name="did"], #submit_free, input.btn-general.btn-orange[type="submit"]');
                if (freeSubmitBtn && !freeSubmitBtn.disabled) {
                    // Если нет активного таймера ожидания
                    const waitingMsg = document.querySelector('.ct_warn, .alert-warning');
                    if (!waitingMsg || !waitingMsg.textContent.match(/\d+\s*(minutes|минут|sec)/i)) {
                        f1Triggered = true;
                        freeSubmitBtn.click();
                    }
                }
            }

            setTimeout(process1Fichier, 800);
            const f1Obs = new MutationObserver(process1Fichier);
            f1Obs.observe(document.body, { childList: true, subtree: true });
        }

        // =========================================================================
        // 5. DATANODES.TO
        // =========================================================================
        if (hostname.includes('datanodes.to')) {
            try {
                if (typeof window.downloadCountdown !== 'undefined') window.downloadCountdown = 0;
                if (typeof window.seconds !== 'undefined') window.seconds = 0;
                if (typeof window.count !== 'undefined') window.count = 0;

                const originalSetInterval = window.setInterval;
                window.setInterval = function(fn, delay) {
                    if (fn && (fn.toString().includes('preparing') || fn.toString().includes('countdown') || fn.toString().includes('timer'))) {
                        delay = 1;
                    }
                    return originalSetInterval(fn, delay);
                };
            } catch (e) {}

            function processDataNodes() {
                const continueBtn = Array.from(document.querySelectorAll('a, button, input')).find(el => {
                    const text = (el.textContent || el.value || '').toLowerCase().trim();
                    return text.includes('continue to download') || text.includes('continue');
                });
                if (continueBtn && !continueBtn.disabled && continueBtn.style.display !== 'none') {
                    continueBtn.click();
                    return;
                }

                const freeDlBtn = Array.from(document.querySelectorAll('a, button, input')).find(el => {
                    const text = (el.textContent || el.value || '').toLowerCase().trim();
                    return text.includes('free download') && !text.includes('premium');
                });
                if (freeDlBtn && !freeDlBtn.disabled) {
                    freeDlBtn.click();
                    return;
                }

                const startDlBtn = Array.from(document.querySelectorAll('a, button, input')).find(el => {
                    const text = (el.textContent || el.value || '').toLowerCase().trim();
                    return text.includes('start download') || text.includes('download now');
                });

                if (startDlBtn && !startDlBtn.disabled && !startDlBtn.hasAttribute('data-tgs-clicked')) {
                    const textRaw = (startDlBtn.textContent || startDlBtn.value || '').toLowerCase();
                    if (!textRaw.includes('wait') && !textRaw.match(/\d+s/)) {
                        startDlBtn.setAttribute('data-tgs-clicked', 'true');
                        startDlBtn.click();
                        setTimeout(() => { window.close(); }, 3000);
                    }
                }
            }

            setTimeout(processDataNodes, 500);
            const dnObserver = new MutationObserver(() => { processDataNodes(); });
            dnObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
        }

        // =========================================================================
        // 6. VIK1NGFILE
        // =========================================================================
        if (hostname.includes('vik1ngfile.site')) {
            let firstClickDone = false;
            let finalClickDone = false;

            function clickVik1ngButton() {
                if (finalClickDone) return;
                const buttons = Array.from(document.querySelectorAll('a, button, input[type="button"], .btn'));
                const downloadBtn = buttons.find(el => {
                    const text = (el.textContent || el.value || '').toLowerCase().trim();
                    return (text.includes('download') || text.includes('скачать')) &&
                           !text.includes('generat') &&
                           !text.includes('подготов');
                });

                if (downloadBtn && !downloadBtn.disabled) {
                    if (!firstClickDone) {
                        firstClickDone = true;
                        downloadBtn.click();
                    } else if (firstClickDone && !finalClickDone) {
                        finalClickDone = true;
                        downloadBtn.click();
                        setTimeout(() => { window.close(); }, 3000);
                    }
                }
            }

            setTimeout(clickVik1ngButton, 1000);
            const observer = new MutationObserver(() => { clickVik1ngButton(); });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        }

        // =========================================================================
        // 7. MEDIAFIRE (СТРАНИЦА ПАПКИ - FOLDER)
        // =========================================================================
        if (hostname.includes('mediafire.com') && path.includes('/folder/')) {
            let currentLang = localStorage.getItem('tgs_mf_downloader_lang') || 'RU';
            let isDownloadingState = false;

            const locales = {
                RU: { title: '🎬 TGS Downloader', desc: 'Выберите версию из списка слева', loading: '🚀 Ваш файл уже скачивается!' },
                EN: { title: '🎬 TGS Downloader', desc: 'Select game version from the list below', loading: '🚀 Your file is downloading now!' }
            };

            function injectStyles() {
                if (document.getElementById('tgs-shimmer-styles')) return;
                const style = document.createElement('style');
                style.id = 'tgs-shimmer-styles';
                style.textContent = `
                    @keyframes tgs-rgb-text {
                        0% { color: #f04747 !important; text-shadow: 0 0 8px rgba(240,71,71,0.8); }
                        25% { color: #faa61a !important; text-shadow: 0 0 8px rgba(250,166,26,0.8); }
                        50% { color: #43b581 !important; text-shadow: 0 0 8px rgba(67,181,129,0.8); }
                        75% { color: #7289da !important; text-shadow: 0 0 8px rgba(114,137,218,0.8); }
                        100% { color: #f04747 !important; text-shadow: 0 0 8px rgba(240,71,71,0.8); }
                    }
                    .tgs-rgb-active { animation: tgs-rgb-text 3s linear infinite !important; }
                `;
                document.head.appendChild(style);
            }

            function updateTexts() {
                const titleEl = document.getElementById('tgs-title-text');
                const descEl = document.getElementById('tgs-desc-text');
                if (titleEl) titleEl.innerHTML = `<b>${locales[currentLang].title}</b>`;
                if (descEl) descEl.textContent = isDownloadingState ? locales[currentLang].loading : locales[currentLang].desc;
            }

            function triggerDownloadingEffects() {
                isDownloadingState = true;
                updateTexts();
                const authorLink = document.getElementById('tgs-author-link');
                if (authorLink) authorLink.classList.add('tgs-rgb-active');
            }

            function createTgsPanel() {
                if (document.getElementById('tgs-mf-panel')) return;
                injectStyles();

                const panel = document.createElement('div');
                panel.id = 'tgs-mf-panel';
                panel.style.cssText = `
                    position: fixed; top: 15px; right: 15px; z-index: 999999;
                    background: #202225; color: #dcddde; border-radius: 8px;
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    width: 280px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); border: 1px solid #40444b;
                `;

                const header = document.createElement('div');
                header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #2f3136; padding: 8px 12px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #18191c;';

                const titleCont = document.createElement('div');
                titleCont.id = 'tgs-title-text';
                titleCont.style.fontSize = '12px'; titleCont.style.color = '#fff';
                header.appendChild(titleCont);

                const controls = document.createElement('div');
                controls.style.cssText = 'display: flex; align-items: center; gap: 6px;';

                const langBtn = document.createElement('button');
                langBtn.innerText = currentLang;
                langBtn.style.cssText = 'background: #40444b; border: none; color: #fff; cursor: pointer; font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 4px;';
                langBtn.onclick = () => {
                    currentLang = currentLang === 'EN' ? 'RU' : 'EN';
                    langBtn.innerText = currentLang;
                    localStorage.setItem('tgs_mf_downloader_lang', currentLang);
                    updateTexts();
                };

                const toggleBtn = document.createElement('button');
                toggleBtn.innerText = '−';
                toggleBtn.style.cssText = 'background:none; border:none; color:#b9bbbe; cursor:pointer; font-size:16px; font-weight:bold; line-height:1;';

                controls.appendChild(langBtn);
                controls.appendChild(toggleBtn);
                header.appendChild(controls);
                panel.appendChild(header);

                const content = document.createElement('div');
                content.style.padding = '8px 12px';

                const descDiv = document.createElement('div');
                descDiv.id = 'tgs-desc-text';
                descDiv.style.cssText = 'font-size: 11px; color: #a3a6aa; text-align: center; margin-bottom: 6px; font-weight: 500;';
                content.appendChild(descDiv);

                const footer = document.createElement('div');
                footer.style.cssText = 'text-align: center; border-top: 1px solid #2f3136; padding-top: 6px; font-size: 11px; font-family: sans-serif;';
                footer.innerHTML = '<span style="font-weight: bold; color: #f43f5e;">🚀 Terebonkoff Game Studio</span> <span style="color: #64748b;">/</span> <a href="https://github.com/Terebonkoff/TGS-UserScripts" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: bold;">Scripts</a> <span style="color: #475569;">|</span> <a href="https://boosty.to/terebonkoff" target="_blank" style="color: #fb923c; text-decoration: none; margin: 0 4px;">☕ Boosty</a> <a href="https://www.patreon.com/c/terebonkoff/about" target="_blank" style="color: #fda4af; text-decoration: none; margin: 0 4px;">💖 Patreon</a> <a href="https://github.com/Terebonkoff/TGS-UserScripts" target="_blank" style="color: #7dd3fc; text-decoration: none; margin: 0 4px;">⭐ GitHub</a>';
                content.appendChild(footer);
                panel.appendChild(content);
                document.body.appendChild(panel);

                updateTexts();

                let isCollapsed = false;
                toggleBtn.onclick = () => {
                    isCollapsed = !isCollapsed;
                    content.style.display = isCollapsed ? 'none' : 'block';
                    toggleBtn.innerText = isCollapsed ? '+' : '−';
                    header.style.borderBottom = isCollapsed ? 'none' : '1px solid #18191c';
                };
            }

            setTimeout(createTgsPanel, 1500);

            window.addEventListener('blur', () => { localStorage.setItem('tgs_mf_download_started', 'true'); });
            window.addEventListener('focus', () => {
                if (localStorage.getItem('tgs_mf_download_started') === 'true') {
                    localStorage.removeItem('tgs_mf_download_started');
                    triggerDownloadingEffects();
                }
            });
        }

        // =========================================================================
        // 8. MEDIAFIRE (СТРАНИЦА ФАЙЛА - DIRECT FILE)
        // =========================================================================
        if (hostname.includes('mediafire.com') && path.includes('/file/')) {
            let downloadClicked = false;

            function clickDirectDownload() {
                if (downloadClicked) return;
                const fileButton = document.getElementById('downloadButton') ||
                                   document.querySelector('a#downloadButton') ||
                                   document.querySelector('.download_link a') ||
                                   document.querySelector('.download_link .input') ||
                                   document.querySelector('a[data-testid="download-button"]') ||
                                   document.querySelector('.js-shared-status-edit');

                if (fileButton && !fileButton.disabled) {
                    downloadClicked = true;
                    fileButton.click();
                    setTimeout(() => { window.close(); }, 3000);
                }
            }

            setTimeout(clickDirectDownload, 1000);
            const fileObserver = new MutationObserver(() => { clickDirectDownload(); });
            fileObserver.observe(document.body, { childList: true, subtree: true });
        }
    });
})();
