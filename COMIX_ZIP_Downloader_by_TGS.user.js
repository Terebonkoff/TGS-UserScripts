// ==UserScript==
// @name         COMIX ZIP Downloader & Live Stats by TGS
// @namespace    https://www.patreon.com/Terebonkoff
// @version      3.404
// @description  Downloads full-size images and batch chapters from adult comic sites into ZIP + live card stats (pages, downloads, favorites, rating, views) + visited green highlight
// @author       Terebonkoff
// @icon         https://purepng.com/public/uploads/thumbnail//sexy-little-caprice-in-white-dress-zly.png
// @match        https://imhentai.xxx/*
// @match        https://*.imhentai.xxx/*
// @match        https://nhentai.net/*
// @match        https://*.nhentai.net/*
// @match        https://hentaiera.com/*
// @match        https://*.hentaiera.com/*
// @match        https://allporncomic.com/*
// @match        https://*.allporncomic.com/*
// @match        https://18comic.vip/*
// @match        https://*.18comic.vip/*
// @match        https://18comic.org/*
// @match        https://*.18comic.org/*
// @match        https://ilikecomix.com/*
// @match        https://e-hentai.org/g/*
// @match        https://*.8muses.com/*
// @match        https://*.8muses.io/*
// @match        https://*.comixhere.xyz/*
// @match        https://*.sexkomix6.com/*
// @match        https://*.sexkomix22.com/*
// @match        https://*.multporn.net/*
// @match        https://*.svscomics.com/*
// @match        https://*.freeadultcomix.com/*
// @match        https://*.xyzcomics.com/*
// @match        https://*.kingcomix.com/*
// @match        https://*.xlecx.com/*
// @match        https://*.xlecx.one/*
// @match        https://*.xcartx.com/*
// @match        https://*.bestporncomix.com/*
// @match        https://*.porncomix.info/*
// @match        https://*.oglaf.com/*
// @match        https://*.erofus.com/*
// @match        https://*.nxt-comics.com/*
// @match        https://*.thehentai.net/*
// @match        https://*.18kami.com/*
// @match        https://*.toon34.com/*
// @match        https://*.palcomix.com/*
// @match        https://*.savitahd.net/*
// @match        https://*.hentaixyuri.com/*
// @match        https://*.hentaixcomic.com/*
// @match        https://*.hentaixdickgirl.com/*
// @match        https://*.allporncomics.co/*
// @match        https://*.erovers-comics.com/*
// @match        https://*.onlycomix.net/*
// @match        https://gedecomix.com/*
// @exclude      https://*.erofus.com/*
// @exclude      https://*.8muses.io/*
// @exclude      https://*.multporn.net/*
// @grant        GM_xmlhttpRequest
// @connect      imhentai.xxx
// @connect      m1.imhentai.xxx
// @connect      m2.imhentai.xxx
// @connect      m3.imhentai.xxx
// @connect      m4.imhentai.xxx
// @connect      m5.imhentai.xxx
// @connect      m6.imhentai.xxx
// @connect      m7.imhentai.xxx
// @connect      m8.imhentai.xxx
// @connect      hentaiera.com
// @connect      i.hentaiera.com
// @connect      t.hentaiera.com
// @connect      nhentai.net
// @connect      i.nhentai.net
// @connect      t.nhentai.net
// @connect      allporncomic.com
// @connect      18comic.vip
// @connect      18comic.org
// @connect      img.ilikecomix.com
// @connect      cdnjs.cloudflare.com
// @connect      e-hentai.org
// @connect      ehgt.org
// @connect      8muses.com
// @connect      8muses.io
// @connect      multporn.net
// @connect      freeadultcomix.com
// @connect      xyzcomics.com
// @connect      kingcomix.com
// @connect      xlecx.one
// @connect      xlecx.com
// @connect      bestporncomix.com
// @connect      erofus.com
// @connect      thehentai.net
// @connect      toon34.com
// @connect      gedecomix.com
// @connect      *
// @downloadURL  https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/main/COMIX_ZIP_Downloader_by_TGS.user.js
// @updateURL    https://raw.githubusercontent.com/Terebonkoff/TGS-UserScripts/main/COMIX_ZIP_Downloader_by_TGS.user.js
// @homepageURL  https://github.com/Terebonkoff/TGS-UserScripts
// @supportURL   https://github.com/Terebonkoff/TGS-UserScripts/issues
// ==/UserScript==

(function() {
    'use strict';

    let isDownloading = false;
    let JSZipLib = null;
    let promoTimeout = null;

    let currentLang = localStorage.getItem('tgs_downloader_lang') || 'RU';
    const host = window.location.hostname;
    const isEH = host.includes('e-hentai.org');
    const isNH = host.includes('nhentai.net');
    const is8M = host.includes('8muses.com') || host.includes('8muses.io');
    const isAPC = host.includes('allporncomic.com');
    const is18C = host.includes('18comic.vip') || host.includes('18comic.org');
    const isHE = host.includes('hentaiera.com');
    const isIMH = host.includes('imhentai.xxx');
    const isILC = host.includes('ilikecomix.com');

        // Список всех поддерживаемых скриптом сайтов (отсортированы по популярности)
    const SUPPORTED_SITES = [
        { name: 'nhentai.net', url: 'https://nhentai.net/' },
        { name: 'e-hentai.org', url: 'https://e-hentai.org/' },
        { name: '18comic.vip', url: 'https://18comic.vip/' },
        { name: 'imhentai.xxx', url: 'https://imhentai.xxx/' },
        { name: 'allporncomic.com', url: 'https://allporncomic.com/' },
        { name: 'hentaiera.com', url: 'https://hentaiera.com/' },
        { name: '8muses.com', url: 'https://www.8muses.com/' },
        { name: 'multporn.net', url: 'https://multporn.net/' },
        { name: 'ilikecomix.com', url: 'https://ilikecomix.com/' },
        { name: 'xlecx.one', url: 'https://xlecx.one/' },
        { name: 'bestporncomix.com', url: 'https://bestporncomix.com/' },
        { name: 'porncomix.info', url: 'https://porncomix.info/' },
        { name: 'freeadultcomix.com', url: 'https://freeadultcomix.com/' },
        { name: 'xcartx.com', url: 'https://xcartx.com/' },
        { name: 'xyzcomics.com', url: 'https://xyzcomics.com/' },
        { name: 'kingcomix.com', url: 'https://kingcomix.com/' },
        { name: 'toon34.com', url: 'https://toon34.com/' },
        { name: 'palcomix.com', url: 'https://palcomix.com/' },
        { name: 'savitahd.net', url: 'https://savitahd.net/' },
        { name: 'comixhere.xyz', url: 'https://comixhere.xyz/' },
        { name: 'sexkomix22.com', url: 'https://sexkomix22.com/' },
        { name: 'sexkomix6.com', url: 'https://sexkomix6.com/' },
        { name: 'svscomics.com', url: 'https://svscomics.com/' },
        { name: 'gedecomix.com', url: 'https://gedecomix.com/' },
        { name: 'oglaf.com', url: 'https://www.oglaf.com/' },
        { name: 'thehentai.net', url: 'https://thehentai.net/' },
        { name: '18kami.com', url: 'https://18kami.com/' },
        { name: 'onlycomix.net', url: 'https://onlycomix.net/' }
    ];

    // =========================================================================
    // 🟢 СИСТЕМА УЧЁТА И ПОДСВЕТКИ ПРОСМОТРЕННЫХ КОМИКСОВ (ЗЕЛЁНАЯ РАМКА)
    // =========================================================================
    const VISITED_STORAGE_KEY = 'tgs_visited_comics_v1';
    const FAVORITES_STORAGE_KEY = 'tgs_favorite_comics_v1';

    function getVisitedComics() {
        try {
            return JSON.parse(localStorage.getItem(VISITED_STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function getFavoriteComics() {
        try {
            return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function isComicFavorite(urlOrId) {
        if (!urlOrId) return false;
        try {
            const key = normalizeComicKey(urlOrId);
            if (!key) return false;
            const favs = getFavoriteComics();
            return !!favs[key];
        } catch (e) {
            return false;
        }
    }

    function toggleComicFavorite(urlOrId) {
        if (!urlOrId) return false;
        try {
            const key = normalizeComicKey(urlOrId);
            if (!key) return false;
            const favs = getFavoriteComics();
            if (favs[key]) {
                delete favs[key];
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
                return false;
            } else {
                favs[key] = Date.now();
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    function normalizeComicKey(url) {
        if (!url) return '';
        try {
            const u = new URL(url, window.location.origin);
            return u.pathname.replace(/\/view\/[^\/]+\/[^\/]+\/?$/, '/').replace(/\/$/, '').toLowerCase();
        } catch (e) {
            return url.toLowerCase().split('?')[0].replace(/\/$/, '');
        }
    }

    function markComicVisited(urlOrId) {
        if (!urlOrId) return;
        try {
            const key = normalizeComicKey(urlOrId);
            if (!key) return;
            const visited = getVisitedComics();
            visited[key] = Date.now();
            localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(visited));
        } catch (e) {}
    }

    function isComicVisited(urlOrId) {
        if (!urlOrId) return false;
        try {
            const key = normalizeComicKey(urlOrId);
            if (!key) return false;
            const visited = getVisitedComics();
            return !!visited[key];
        } catch (e) {
            return false;
        }
    }

    function updateCardStatus(targetContainer, comicUrl) {
        if (!targetContainer || !comicUrl) return;

        const isFav = isComicFavorite(comicUrl);
        const isVis = isComicVisited(comicUrl);

        // 1. Рамки карточки (Золотая для Избранного, Зеленая для Просмотренного)
        if (isFav) {
            targetContainer.classList.remove('tgs-visited-card');
            targetContainer.classList.add('tgs-favorite-card');
        } else if (isVis) {
            targetContainer.classList.remove('tgs-favorite-card');
            targetContainer.classList.add('tgs-visited-card');
        } else {
            targetContainer.classList.remove('tgs-favorite-card');
            targetContainer.classList.remove('tgs-visited-card');
        }

        // 2. Левый верхний статус-бейдж
        let badge = targetContainer.querySelector('.tgs-status-badge');
        if (isFav || isVis) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'tgs-status-badge';
                targetContainer.appendChild(badge);
            }
            if (isFav) {
                badge.className = 'tgs-status-badge tgs-favorite-badge';
                badge.innerText = '★ FAVORITE';
            } else {
                badge.className = 'tgs-status-badge tgs-visited-badge';
                badge.innerText = t('badgeViewed');
            }
        } else if (badge) {
            badge.remove();
        }

        // 3. Звёздочка Избранного в правом верхнем углу обложки
        let starBtn = targetContainer.querySelector('.tgs-fav-star-btn');
        if (!starBtn) {
            starBtn = document.createElement('button');
            starBtn.className = 'tgs-fav-star-btn';
            starBtn.setAttribute('type', 'button');
            starBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
            targetContainer.appendChild(starBtn);

            starBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleComicFavorite(comicUrl);
                updateCardStatus(targetContainer, comicUrl);
            });
        }

        if (isFav) {
            starBtn.classList.add('is-favorite');
            starBtn.setAttribute('title', 'Удалить из избранного TGS');
        } else {
            starBtn.classList.remove('is-favorite');
            starBtn.setAttribute('title', 'Добавить в избранное TGS (Золотая рамка)');
        }
    }

    function applyVisitedBorder(container, comicUrl) {
        if (comicUrl) updateCardStatus(container, comicUrl);
    }

    function checkCurrentPageVisited() {
        const path = window.location.pathname;
        if (
            (isIMH && path.includes('/gallery/')) ||
            (isNH && path.includes('/g/')) ||
            (isHE && (path.includes('/gallery/') || path.includes('/view/'))) ||
            (is18C && (path.includes('/album/') || path.includes('/photo/'))) ||
            (isAPC && (path.includes('/porncomic/') || path.includes('/manga/'))) ||
            (isILC && path.length > 3)
        ) {
            markComicVisited(window.location.href);
        }
    }

    const locales = {
        RU: {
            btnChapter: 'СКАЧАТЬ ЭТУ ГЛАВУ',
            btnGallery: 'СКАЧАТЬ ГАЛЕРЕЮ',
            btnAll: 'СКАЧАТЬ ВСЕ ГЛАВЫ ({count})',
            statusScanning: 'ПОИСК...',
            statusDownloading: 'ЗАГРУЗКА {current}/{total}',
            statusBatching: 'ОБРАБОТКА...',
            statusCompressing: 'СЖАТИЕ...',
            statusDone: 'ГОТОВО!',
            statusError: 'ОШИБКА',
            statusFail: 'ОШИБКА ЗАГРУЗКИ',
            logFoundChapters: '📚 Найдено {count} глав.',
            logFetchingChap: '⏳ Загрузка главы {current}/{total}...',
            logNoImages: '⚠️ Нет картинок в {title}',
            logFailedChapter: '⚠️ Не удалось загрузить главу',
            logZipping: '🗜️ Упаковка в ZIP...',
            logZipError: '⚠️ Ошибка ZIP',
            logNoImagesFound: '⚠️ Картинки не найдены',
            logSuccess: '📈 Успешно: {current}/{total}',
            logPromo: '🥱 Ждёшь загрузки? Загляни на страницу автора снизу!',
            badgeViewed: '✓ ПРОСМОТРЕНО',
            supportMe: 'SUPPORT ME',
            supportedSites: 'Поддерживаемые сайты'
        },
        EN: {
            btnChapter: 'DOWNLOAD THIS CHAPTER',
            btnGallery: 'DOWNLOAD GALLERY',
            btnAll: 'DOWNLOAD ALL ({count} CHAPTERS)',
            statusScanning: 'SCANNING...',
            statusDownloading: 'DOWNLOADING {current}/{total}',
            statusBatching: 'BATCHING...',
            statusCompressing: 'COMPRESSING...',
            statusDone: 'DONE!',
            statusError: 'ERROR',
            statusFail: 'DOWNLOAD FAILED',
            logFoundChapters: '📚 Found {count} chapters.',
            logFetchingChap: '⏳ Fetching Chap {current}/{total}...',
            logNoImages: '⚠️ No images in {title}',
            logFailedChapter: '⚠️ Failed to load chapter',
            logZipping: '🗜️ Zipping...',
            logZipError: '⚠️ Zip error',
            logNoImagesFound: '⚠️ No images found',
            logSuccess: '📈 Success: {current}/{total}',
            logPromo: '🥱 Bored waiting? Check out the author\'s page below!⬇️',
            badgeViewed: '✓ VIEWED',
            supportMe: 'SUPPORT ME',
            supportedSites: 'Supported Sites'
        }
    };

    function t(key, replacements = {}) {
        let text = locales[currentLang][key] || locales['EN'][key] || '';
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        return text;
    }

    function playClickSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    }

    function injectStyles() {
        if (document.getElementById('tgs-comix-styles')) return;
        const style = document.createElement('style');
        style.id = 'tgs-comix-styles';
        style.textContent = `
            @keyframes tgs-shimmer {
                0% { color: #7289da !important; text-shadow: 0 0 5px rgba(114,137,218,0.6); }
                25% { color: #faa61a !important; text-shadow: 0 0 5px rgba(250,166,26,0.8); }
                50% { color: #43b581 !important; text-shadow: 0 0 5px rgba(67,181,129,0.8); }
                75% { color: #f04747 !important; text-shadow: 0 0 5px rgba(240,71,71,0.8); }
                100% { color: #7289da !important; text-shadow: 0 0 5px rgba(114,137,218,0.6); }
            }
            .tgs-shimmer-active {
                animation: tgs-shimmer 2s linear infinite !important;
            }

            .post-image, figure.post-image, .post-image > a, .thumb-overlay, .gallery, .item-thumb, .inner_thumb, .thumb, .item {
                position: relative !important;
            }

            /* Зеленая рамка для просмотренных комиксов */
            
            /* Золотая рамка Избранного */
            .tgs-favorite-card {
                outline: 3px solid #eab308 !important;
                outline-offset: -2px !important;
                box-shadow: 0 0 16px rgba(234, 179, 8, 0.85) !important;
                border-radius: 6px !important;
            }
            .tgs-favorite-badge {
                position: absolute !important;
                top: 6px !important;
                left: 6px !important;
                background: linear-gradient(135deg, #facc15 0%, #ca8a04 100%) !important;
                color: #0f172a !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 11px !important;
                font-weight: 800 !important;
                padding: 2px 7px !important;
                border-radius: 4px !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.85) !important;
                z-index: 25 !important;
                letter-spacing: 0.5px !important;
                pointer-events: none !important;
            }

            /* Кнопка-звёздочка в правом верхнем углу */
            .tgs-fav-star-btn {
                position: absolute !important;
                top: 6px !important;
                right: 6px !important;
                width: 28px !important;
                height: 28px !important;
                border-radius: 50% !important;
                background: rgba(15, 23, 42, 0.75) !important;
                backdrop-filter: blur(4px) !important;
                border: 1px solid rgba(255, 255, 255, 0.35) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                z-index: 30 !important;
                transition: all 0.2s ease !important;
                color: #ffffff !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6) !important;
            }
            .tgs-fav-star-btn:hover {
                transform: scale(1.15) !important;
                border-color: #facc15 !important;
                background: rgba(15, 23, 42, 0.95) !important;
            }
            .tgs-fav-star-btn svg {
                width: 17px !important;
                height: 17px !important;
                stroke: #ffffff !important;
                fill: transparent !important;
                transition: all 0.2s ease !important;
            }
            .tgs-fav-star-btn.is-favorite {
                background: rgba(234, 179, 8, 0.25) !important;
                border-color: #facc15 !important;
                box-shadow: 0 0 10px rgba(250, 204, 21, 0.7) !important;
            }
            .tgs-fav-star-btn.is-favorite svg {
                stroke: #eab308 !important;
                fill: #facc15 !important;
                filter: drop-shadow(0 0 4px rgba(250, 204, 21, 0.8)) !important;
            }

            .tgs-visited-card {
                outline: 3px solid #22c55e !important;
                outline-offset: -2px !important;
                box-shadow: 0 0 14px rgba(34, 197, 94, 0.75) !important;
                border-radius: 6px !important;
            }
            .tgs-visited-badge {
                position: absolute !important;
                top: 6px !important;
                left: 6px !important;
                background: rgba(34, 197, 94, 0.94) !important;
                color: #ffffff !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 11px !important;
                font-weight: 800 !important;
                padding: 2px 7px !important;
                border-radius: 4px !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.85) !important;
                z-index: 25 !important;
                letter-spacing: 0.5px !important;
                pointer-events: none !important;
            }

            /* Оверлей статистики */
            .tgs-card-overlay {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                display: flex !important;
                justify-content: flex-start !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                padding: 5px 8px !important;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(10, 14, 22, 0.88) 35%, rgba(8, 11, 18, 0.98) 100%) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important;
                font-size: 13px !important;
                font-weight: 800 !important;
                line-height: 1.1 !important;
                z-index: 20 !important;
                box-sizing: border-box !important;
                border-bottom-left-radius: 6px !important;
                border-bottom-right-radius: 6px !important;
                pointer-events: auto !important;
                user-select: none !important;
                gap: 7px !important;
                transition: opacity 0.2s ease !important;
            }
            .tgs-card-overlay .tgs-stat {
                display: inline-flex !important;
                align-items: center !important;
                gap: 3px !important;
                white-space: nowrap !important;
                text-shadow: 0 2px 4px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.9) !important;
            }
            .tgs-card-overlay .tgs-pages { color: #67e8f9 !important; }
            .tgs-card-overlay .tgs-rating { color: #facc15 !important; }
            .tgs-card-overlay .tgs-favorites { color: #f43f5e !important; }
            .tgs-card-overlay .tgs-downloads { color: #38bdf8 !important; }
            .tgs-card-overlay .tgs-views { color: #4ade80 !important; }
            .tgs-card-overlay.tgs-loading {
                opacity: 0.65 !important;
                font-size: 12px !important;
                color: #94a3b8 !important;
                justify-content: center !important;
            }
        `;
        style.textContent += `
            /* TGS Brand Group: Support Me & GitHub */
            .tgs-brand-group {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                width: fit-content !important;
                max-width: fit-content !important;
                flex: 0 0 auto !important;
                align-self: center !important;
                box-sizing: border-box !important;
                vertical-align: middle !important;
                user-select: none !important;
                margin: 0 10px !important;
            }
            .tgs-support-btn, .tgs-github-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 5px !important;
                width: fit-content !important;
                max-width: fit-content !important;
                flex: 0 0 auto !important;
                padding: 3px 9px !important;
                border-radius: 5px !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                line-height: 1.2 !important;
                transition: all 0.2s ease !important;
                white-space: nowrap !important;
                cursor: pointer !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
            }
            .tgs-support-btn {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(88, 101, 242, 0.22)) !important;
                border: 1px solid rgba(239, 68, 68, 0.65) !important;
                color: #ffffff !important;
            }
            .tgs-support-btn:hover {
                background: linear-gradient(135deg, #ef4444, #dc2626) !important;
                border-color: #ef4444 !important;
                color: #ffffff !important;
                box-shadow: 0 0 12px rgba(239, 68, 68, 0.75) !important;
                transform: translateY(-1px) !important;
            }
            .tgs-github-btn {
                background: rgba(36, 41, 47, 0.8) !important;
                border: 1px solid #444c56 !important;
                color: #e6edf3 !important;
            }
            .tgs-github-btn:hover {
                background: #2ea043 !important;
                border-color: #2ea043 !important;
                color: #ffffff !important;
                box-shadow: 0 0 12px rgba(46, 160, 67, 0.65) !important;
                transform: translateY(-1px) !important;
            }
            .tgs-heart {
                font-size: 12px !important;
                line-height: 1 !important;
                display: inline-block !important;
                animation: tgs-pulse 2s infinite ease-in-out !important;
            }
            @keyframes tgs-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.22); }
            }
`;
        document.head.appendChild(style);
    }

    function startPromoTimer() {
        stopPromoTimer();
        promoTimeout = setTimeout(() => {
            log(t('logPromo'));
            const link = document.getElementById('tgs-author-link');
            if (link) link.classList.add('tgs-shimmer-active');
        }, 2000);
    }

    function stopPromoTimer() {
        if (promoTimeout) {
            clearTimeout(promoTimeout);
            promoTimeout = null;
        }
        const link = document.getElementById('tgs-author-link');
        if (link) link.classList.remove('tgs-shimmer-active');
    }

    function loadJSZip(callback) {
        if (typeof JSZip !== 'undefined') {
            JSZipLib = JSZip;
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = function() {
            JSZipLib = JSZip;
            callback();
        };
        document.head.appendChild(script);
    }

    function isGalleryOnlySite() {
        if (isEH || isNH || is8M || isHE || isIMH) return true;
        if (is18C) {
            if (window.location.pathname.includes('/photo/')) return true;
            const hasEpisodes = document.querySelectorAll('.episode a[href*="/photo/"], ul.btn-toolbar a[href*="/photo/"]').length > 1;
            return !hasEpisodes;
        }
        return !(host.includes('ilikecomix.com') || host.includes('allporncomic.com') || host.includes('gedecomix.com'));
    }

    function getChapters() {
        if (isGalleryOnlySite()) return [];
        let urls = [];

        if (is18C) {
            document.querySelectorAll('.episode a[href*="/photo/"], ul.btn-toolbar a[href*="/photo/"], a.btn-primary[href*="/photo/"]').forEach(a => {
                if (a.href && a.href.includes('/photo/')) urls.push(a.href);
            });
            return [...new Set(urls)];
        }

        document.querySelectorAll('li.wp-manga-chapter a, .wp-manga-chapter > a, .chapter-name a, .listing-chapters_wrap a').forEach(a => {
            if (a.href) urls.push(a.href);
        });
        urls = urls.filter(u => u.startsWith('http') && !u.includes('#') && !u.includes('?'));
        return [...new Set(urls)].reverse();
    }

    function addControlPanel() {
        if (document.getElementById('download-panel')) return;
        injectStyles();

        const panel = document.createElement('div');
        panel.id = 'download-panel';
        panel.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 999999;
            background: #202225;
            color: #dcddde;
            border-radius: 8px;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            width: 230px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            border: 1px solid #40444b;
            transition: all 0.3s ease;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #2f3136;
            padding: 10px 14px;
            border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #18191c;
        `;

        const title = document.createElement('div');
        title.innerHTML = `🎬 <b>COMIX Downloader</b>`;
        title.style.fontSize = '14px';
        title.style.color = '#fff';

        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const langBtn = document.createElement('button');
        langBtn.id = 'change-lang-btn';
        langBtn.innerText = currentLang;
        langBtn.style.cssText = `
            background: #40444b;
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            transition: background 0.2s;
        `;
        langBtn.onmouseover = () => langBtn.style.background = '#7289da';
        langBtn.onmouseout = () => langBtn.style.background = '#40444b';

        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = '−';
        toggleBtn.style.cssText = `
            background: none;
            border: none;
            color: #b9bbbe;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            padding: 0 2px;
            line-height: 1;
            transition: color 0.2s;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.color = '#fff';
        toggleBtn.onmouseout = () => toggleBtn.style.color = '#b9bbbe';

        controls.appendChild(langBtn);
        controls.appendChild(toggleBtn);
        header.appendChild(title);
        header.appendChild(controls);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.id = 'panel-content';
        content.style.cssText = `
            padding: 14px;
            display: block;
        `;

                const sitesHtml = SUPPORTED_SITES.map((s, idx) => `
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="tgs-site-link" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 4px 7px;
                border-radius: 5px;
                color: #8ea1e1;
                text-decoration: none;
                font-size: 10px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin-bottom: 2px;
                transition: background 0.15s, color 0.15s, transform 0.15s;
            " onmouseover="this.style.background='#27292d';this.style.color='#ffffff';this.style.transform='translateX(3px)';" onmouseout="this.style.background='transparent';this.style.color='#8ea1e1';this.style.transform='none';">
                <span><span style="color:#faa61a; font-weight:bold; margin-right:5px;">${idx + 1}.</span>${s.name}</span>
                <span style="color:#5865f2; font-size:10px;">↗</span>
            </a>
        `).join('');

        content.innerHTML = `
            <button id="download-zip-btn" style="
                width: 100%;
                padding: 10px;
                background: linear-gradient(135deg, #43b581, #3ba55c);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 10px rgba(67, 181, 129, 0.3);
                transition: transform 0.1s, background 0.3s;
                display: none;
            "></button>

            <button id="download-all-btn" style="
                width: 100%;
                padding: 10px;
                background: linear-gradient(135deg, #7289da, #5b6eae);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 10px rgba(114, 137, 218, 0.3);
                transition: transform 0.1s, background 0.3s;
                display: none;
            "></button>

            <div id="progress-container" style="margin-top: 14px; display: none;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px; font-weight: 500;">
                    <span id="progress-text" style="color: #a3a6aa;">...</span>
                    <span id="progress-percent" style="color: #faa61a;">0%</span>
                </div>
                <div style="width: 100%; height: 10px; background: #40444b; border-radius: 5px; overflow: hidden;">
                    <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #faa61a, #f57c00); transition: background 0.3s ease, width 0.3s ease; border-radius: 5px;"></div>
                </div>
            </div>

            <div id="status" style="margin-top: 12px; font-size: 11px; max-height: 120px; overflow-y: auto; background: #18191c; padding: 8px; border-radius: 6px; display: none; line-height: 1.5; font-family: monospace; color: #a3a6aa;"></div>

            <!-- Блок автора и поддержки -->
            <div style="margin-top: 14px; text-align: center; border-top: 1px solid #2f3136; padding-top: 10px;">
                <div id="tgs-support-label" style="font-size: 10px; font-weight: 800; color: #faa61a; letter-spacing: 0.8px; margin-bottom: 3px;">💖 SUPPORT ME:</div>
                <a id="tgs-author-link" href="https://www.patreon.com/c/terebonkoff/about?utm_source=userscript_comix&utm_medium=tgs_suite" target="_blank" style="font-size: 11px; color: #7289da; text-decoration: none; font-weight: bold; transition: color 0.3s;">Terebonkoff Game Studio</a>
                
                <!-- Раскрывающийся список поддерживаемых сайтов со стрелочкой вниз -->
                <div id="tgs-supported-toggle" style="margin-top: 8px; cursor: pointer; font-size: 10px; color: #8e9297; display: flex; align-items: center; justify-content: center; gap: 4px; user-select: none; transition: color 0.2s;">
                    <span id="tgs-supported-text">🌐 ${t('supportedSites')}</span>
                    <span id="tgs-supported-arrow" style="font-size: 9px; transition: transform 0.2s;">▼</span>
                </div>
                <div id="tgs-supported-list" style="display: none; margin-top: 6px; max-height: 190px; overflow-y: auto; background: #18191c; border-radius: 6px; padding: 6px 6px; font-size: 10px; font-family: monospace; color: #a3a6aa; text-align: left; line-height: 1.6; border: 1px solid #2f3136;">
                    ${sitesHtml}
                </div>
            </div>
        `;

        panel.appendChild(content);
        document.body.appendChild(panel);

        // Интерактив для спойлера поддерживаемых сайтов
        const supportedToggle = document.getElementById('tgs-supported-toggle');
        const supportedList = document.getElementById('tgs-supported-list');
        const supportedArrow = document.getElementById('tgs-supported-arrow');
        supportedToggle.onmouseover = () => supportedToggle.style.color = '#dcddde';
        supportedToggle.onmouseout = () => supportedToggle.style.color = '#8e9297';
        supportedToggle.onclick = () => {
            const isHidden = supportedList.style.display === 'none';
            supportedList.style.display = isHidden ? 'block' : 'none';
            supportedArrow.innerText = isHidden ? '▲' : '▼';
        };

        langBtn.onclick = () => {
            playClickSound();
            currentLang = currentLang === 'EN' ? 'RU' : 'EN';
            langBtn.innerText = currentLang;
            localStorage.setItem('tgs_downloader_lang', currentLang);
            updateTranslations();
        };

        updateTranslations();

        let isCollapsed = false;
        toggleBtn.onclick = () => {
            playClickSound();
            isCollapsed = !isCollapsed;
            content.style.display = isCollapsed ? 'none' : 'block';
            toggleBtn.innerText = isCollapsed ? '+' : '−';
            panel.style.borderRadius = '8px';
            header.style.borderRadius = isCollapsed ? '8px' : '8px 8px 0 0';
            header.style.borderBottom = isCollapsed ? 'none' : '1px solid #18191c';
        };

        const dlBtn = document.getElementById('download-zip-btn');
        dlBtn.onclick = () => { playClickSound(); startDownload(); };

        const dlAllBtn = document.getElementById('download-all-btn');
        dlAllBtn.onclick = () => { playClickSound(); startDownloadAll(); };
    }

    // Мгновенное обновление всех текстовых надписей при переключении языка
    function updateTranslations() {
        updateButtonLabels();
        
        // 1. Надпись "Просмотрено" / "VIEWED" на всех плашках на странице
        document.querySelectorAll('.tgs-visited-badge').forEach(badge => {
            badge.innerText = t('badgeViewed');
        });

        // 2. Блок "Support Me" и "Поддерживаемые сайты"
        const supportLabel = document.getElementById('tgs-support-label');
        if (supportLabel) supportLabel.innerText = `💖 ${t('supportMe')}:`;

        const supportedText = document.getElementById('tgs-supported-text');
        if (supportedText) supportedText.innerText = `🌐 ${t('supportedSites')}`;
    }

    function updateButtonLabels() {
        const chapters = getChapters();
        const dlBtn = document.getElementById('download-zip-btn');
        const dlAllBtn = document.getElementById('download-all-btn');

        if (chapters.length > 0) {
            dlAllBtn.style.display = 'block';
            dlAllBtn.innerText = t('btnAll', { count: chapters.length });
            dlAllBtn.style.background = 'linear-gradient(135deg, #7289da, #5b6eae)';
            dlBtn.style.display = 'none';
        } else {
            dlAllBtn.style.display = 'none';
            dlBtn.style.display = 'block';
            dlBtn.innerText = isGalleryOnlySite() ? t('btnGallery') : t('btnChapter');
            dlBtn.style.background = 'linear-gradient(135deg, #43b581, #3ba55c)';
        }
    }

    function resetPanelState() {
        updateTranslations();
        stopPromoTimer();
        document.getElementById('progress-container').style.display = 'none';
        const statusBox = document.getElementById('status');
        statusBox.style.display = 'none';
        statusBox.innerHTML = '';
    }

    function showProgress() {
        document.getElementById('progress-container').style.display = 'block';
        document.getElementById('status').style.display = 'block';
    }

    function updateProgress(current, total, text) {
        const percent = Math.round((current / total) * 100);
        const progressBar = document.getElementById('progress-bar');
        const hue = 40 + (percent * 0.8);
        progressBar.style.background = `linear-gradient(90deg, hsl(40, 100%, 45%), hsl(${hue}, 100%, 50%))`;
        progressBar.style.width = percent + '%';
        document.getElementById('progress-percent').textContent = percent + '%';
        document.getElementById('progress-percent').style.color = `hsl(${hue}, 100%, 50%)`;
        document.getElementById('progress-text').textContent = text || `${current}/${total}`;
    }

    function log(message) {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML += `<div style="margin:2px 0;">${message}</div>`;
            status.scrollTop = status.scrollHeight;
        }
    }

    function setButtonState(btnId, text, color) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.textContent = text;
            if (color) btn.style.background = color;
        }
    }

    function getFullSizeUrl(url) {
        return url.replace(/-\d+x\d+(\.\w+)(\?.*)?$/, '$1$2');
    }

    function getComicTitle() {
        if (isEH) {
            const titleEl = document.querySelector('#gn');
            if (titleEl) return titleEl.textContent.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 80);
            return 'EH_Gallery';
        }
        if (isNH) {
            const titleEl = document.querySelector('#info h1 .beautiful') || document.querySelector('#info h1');
            if (titleEl) return titleEl.textContent.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 80);
            return 'NH_Gallery';
        }
        if (is18C) {
            const titleEl = document.querySelector('#album_name, h1.video-title, .panel-heading .pull-left, h1');
            if (titleEl) return titleEl.textContent.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 80);
            return '18Comic_Album';
        }
        if (isHE) {
            const titleEl = document.querySelector('h1.gallery-name, h1');
            if (titleEl) return titleEl.textContent.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 80);
            return 'HentaiEra_Gallery';
        }
        if (isIMH) {
            const titleEl = document.querySelector('h1.title, h1, .gallery_title');
            if (titleEl) return titleEl.textContent.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 80);
            return 'ImHentai_Gallery';
        }

        const generalTitleEl = document.querySelector('h1.post-title, h1.entry-title, .post-title, h1.title, h1, .manga-title, .title, .comic_title');
        if (generalTitleEl) {
            return generalTitleEl.textContent.trim()
                .replace(/[<>:"/\\|?*]/g, '')
                .replace(/\s+/g, '_')
                .substring(0, 80);
        }
        const urlParts = window.location.pathname.split('/').filter(Boolean);
        return urlParts[urlParts.length - 1] || 'comic';
    }

    function collect18comicImages(doc = document) {
        const imgs = [];
        const selectors = [
            '.lazy_img',
            'img[id^="album_photo_"]',
            '.panel-body img[data-original]',
            '.read-container img',
            '.comic-pic img'
        ];
        doc.querySelectorAll(selectors.join(', ')).forEach(img => {
            let src = img.getAttribute('data-original') || img.getAttribute('data-src') || img.src;
            if (src && !src.includes('placeholder') && !src.includes('loading')) {
                if (src.startsWith('//')) src = window.location.protocol + src;
                else if (src.startsWith('/')) src = window.location.origin + src;
                imgs.push(src.trim());
            }
        });
        return [...new Set(imgs)];
    }

    function collectHentaiEraImages() {
        const imgs = [];
        document.querySelectorAll('.thumb-container img, .gallery-item img, .thumb img').forEach(img => {
            let src = img.getAttribute('data-src') || img.src;
            if (src) {
                let full = src.replace('t.hentaiera.com', 'i.hentaiera.com').replace(/t\.(jpg|png|webp|gif)$/i, '.$1');
                imgs.push(full);
            }
        });
        return [...new Set(imgs)];
    }

    function collectImHentaiImages() {
        const imgs = [];
        document.querySelectorAll('.thumb-container img, .gthumb img, .inner_thumb img, .gallery_thumb img').forEach(img => {
            let src = img.getAttribute('data-src') || img.src;
            if (src) {
                let full = src.replace(/t\.(jpg|png|webp|gif)$/i, '.$1');
                imgs.push(full);
            }
        });
        const readerImg = document.querySelector('#gimg, #image, #comic_img, .reader img');
        if (readerImg && imgs.length === 0) {
            let src = readerImg.getAttribute('data-src') || readerImg.src;
            if (src) imgs.push(src);
        }
        return [...new Set(imgs)];
    }

    function collectNHImages() {
        const imgs = [];
        document.querySelectorAll('.thumb-container img').forEach(img => {
            let thumbSrc = img.getAttribute('data-src') || img.src;
            if (thumbSrc && thumbSrc.includes('/galleries/')) {
                let fullSrc = thumbSrc.replace('t.nhentai.net', 'i.nhentai.net').replace(/t\.(jpg|png|webp|gif)$/i, '.$1');
                imgs.push(fullSrc);
            }
        });
        return [...new Set(imgs)];
    }

    function parseMadaraChapterImages(htmlText) {
        const imgs = [];
        try {
            const regex = /chapter_images\s*=\s*(\[[^\]]+\])/;
            const match = regex.exec(htmlText);
            if (match && match[1]) {
                const cleanJson = match[1].replace(/'/g, '"').replace(/\\/g, '');
                const arr = JSON.parse(cleanJson);
                arr.forEach(url => {
                    if (url && typeof url === 'string') imgs.push(url.trim());
                });
            }
        } catch (e) {
            const urlRegex = /"(https?:\/\/[^"]+?\.(?:jpg|jpeg|png|webp|gif)[^"]*?)"/gi;
            let m;
            while ((m = urlRegex.exec(htmlText)) !== null) {
                if (m[1].includes('/wp-content/uploads/')) {
                    imgs.push(m[1].replace(/\\/g, ''));
                }
            }
        }
        return [...new Set(imgs)];
    }

    function collectImageUrls(doc = document) {
        if (is18C) return collect18comicImages(doc);
        if (isHE) return collectHentaiEraImages();
        if (isIMH) return collectImHentaiImages();

        let imageUrls = [];
        if (is8M) {
            doc.querySelectorAll('.gallery .image img, .gallery a img, .album-contents img, .picture-thumb img').forEach(img => {
                let src = img.getAttribute('data-src') || img.src;
                if (src) {
                    let fullSrc = src.replace('/th/', '/fl/').replace('/sub/', '/fl/')
                                     .replace(/\/albums\/(small|medium|thumb)\//, '/albums/fl/');
                    imageUrls.push(fullSrc);
                }
            });
            return [...new Set(imageUrls)];
        }

        const contentBlock = doc.querySelector('.reading-content, .entry-content, .post-content, article, #comic, .comic-pages, .gallery, #gallery, .manga-box, .posts-container, .wp-manga-chapter-img');
        const searchArea = contentBlock || doc.body;
        if (!searchArea) return [];

        const imgElements = searchArea.querySelectorAll('img');
        imgElements.forEach(img => {
            let src = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-original') || img.src;
            if (src && src.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
                src = getFullSizeUrl(src.trim());
                if (src.startsWith('//')) src = window.location.protocol + src;
                else if (src.startsWith('/')) src = window.location.origin + src;
                imageUrls.push(src);
            }
        });

        return [...new Set(imageUrls.filter(url => {
            let nameWithoutExt = url.substring(url.lastIndexOf('/') + 1).split('?')[0].toLowerCase().replace(/\.[^/.]+$/, "");
            return !(nameWithoutExt.includes('logo') || nameWithoutExt.includes('avatar') || nameWithoutExt.includes('banner') || nameWithoutExt.includes('icon'));
        }))];
    }

    function downloadSingleImage(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: { 'Accept': 'image/webp,image/*,*/*' },
            onload: function(response) {
                if (response.status === 200 && response.response && response.response.byteLength > 0) {
                    callback(null, response.response);
                } else {
                    callback(new Error('Empty response'), null);
                }
            },
            onerror: function(err) { callback(err, null); },
            ontimeout: function() { callback(new Error('Timeout'), null); }
        });
    }

    function finishZip(files, title) {
        log(t('logSuccess', { current: files.length, total: files.length }));
        if (files.length === 0) {
            setButtonState('download-zip-btn', t('statusFail'), 'linear-gradient(135deg, #f04747, #d84040)');
            isDownloading = false;
            stopPromoTimer();
            return;
        }
        updateProgress(100, 100, t('statusCompressing'));
        setTimeout(function() {
            const zip = new JSZipLib();
            files.forEach(f => zip.file(f.name, f.data));
            zip.generateAsync({ type: 'blob', compression: 'STORE' }).then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = title + '.zip';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
                setButtonState('download-zip-btn', t('statusDone'), 'linear-gradient(135deg, #43b581, #3ba55c)');
                isDownloading = false;
                stopPromoTimer();
            }).catch(e => {
                log(t('logZipError'));
                setButtonState('download-zip-btn', t('statusError'), 'linear-gradient(135deg, #f04747, #d84040)');
                isDownloading = false;
                stopPromoTimer();
            });
        }, 300);
    }

    function startDownloadAll() {
        const btn = document.getElementById('download-all-btn');
        if (btn.innerText === t('statusDone') || btn.innerText === t('statusError') || btn.innerText === t('statusFail')) {
            resetPanelState();
            return;
        }
        if (isDownloading) return;

        const chapters = getChapters();
        if (chapters.length === 0) return;

        if (!JSZipLib) {
            loadJSZip(function() { startDownloadAll(); });
            return;
        }

        isDownloading = true;
        showProgress();
        startPromoTimer();
        const mainComicTitle = getComicTitle();
        log(t('logFoundChapters', { count: chapters.length }));
        setButtonState('download-all-btn', t('statusBatching'), 'linear-gradient(135deg, #faa61a, #e67e22)');

        let currentChapIdx = 0;

        function processNextChapter() {
            if (currentChapIdx >= chapters.length) {
                log(t('logSuccess', { current: chapters.length, total: chapters.length }));
                setButtonState('download-all-btn', t('statusDone'), 'linear-gradient(135deg, #43b581, #3ba55c)');
                isDownloading = false;
                stopPromoTimer();
                return;
            }

            const chapterUrl = chapters[currentChapIdx];
            log(t('logFetchingChap', { current: currentChapIdx + 1, total: chapters.length }));

            GM_xmlhttpRequest({
                method: 'GET',
                url: chapterUrl,
                onload: function(response) {
                    let chapTitle = 'Chapter_' + (currentChapIdx + 1);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const titleEl = doc.querySelector('h1.post-title, h1.entry-title, .panel-heading, .title');
                    if (titleEl) {
                        let parsedTitle = titleEl.textContent.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 60);
                        chapTitle = mainComicTitle + '_-_' + parsedTitle;
                    } else {
                        chapTitle = mainComicTitle + '_-_' + chapTitle;
                    }

                    let imgs = [];
                    if (isAPC || chapterUrl.includes('allporncomic.com')) {
                        imgs = parseMadaraChapterImages(response.responseText);
                    }
                    if (imgs.length === 0) {
                        imgs = collectImageUrls(doc);
                    }

                    if (imgs.length === 0) {
                        log(t('logNoImages', { title: chapTitle.substring(0, 20) + '...' }));
                        currentChapIdx++;
                        setTimeout(processNextChapter, 1000);
                        return;
                    }

                    downloadAndZipChapter(imgs, chapTitle, function() {
                        currentChapIdx++;
                        setTimeout(processNextChapter, 1000);
                    });
                },
                onerror: function() {
                    log(t('logFailedChapter'));
                    currentChapIdx++;
                    setTimeout(processNextChapter, 1000);
                }
            });
        }
        processNextChapter();
    }

    function downloadAndZipChapter(imageUrls, zipFilename, onComplete) {
        const files = [];
        let currentImgIdx = 0;

        function nextImg() {
            if (currentImgIdx >= imageUrls.length) {
                if (files.length > 0) {
                    updateProgress(100, 100, t('statusCompressing'));
                    const zip = new JSZipLib();
                    files.forEach(f => zip.file(f.name, f.data));
                    zip.generateAsync({ type: 'blob', compression: 'STORE' }).then(blob => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = zipFilename + '.zip';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
                        log('✅ ' + zipFilename.substring(0, 20) + '...');
                        onComplete();
                    }).catch(e => {
                        log(t('logZipError'));
                        onComplete();
                    });
                } else {
                    onComplete();
                }
                return;
            }

            const url = imageUrls[currentImgIdx];
            const paddedIndex = String(currentImgIdx + 1).padStart(4, '0');
            let filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
            if (!filename.includes('.')) filename += '.jpg';
            const finalFilename = paddedIndex + '_' + filename;

            updateProgress(currentImgIdx + 1, imageUrls.length, t('statusDownloading', { current: currentImgIdx + 1, total: imageUrls.length }));

            downloadSingleImage(url, function(err, data) {
                if (!err && data) files.push({ name: finalFilename, data: data });
                currentImgIdx++;
                setTimeout(nextImg, 150);
            });
        }
        nextImg();
    }

    function startDownload() {
        const btn = document.getElementById('download-zip-btn');
        if (btn.innerText === t('statusDone') || btn.innerText === t('statusError') || btn.innerText === t('statusFail')) {
            resetPanelState();
            return;
        }

        if (isDownloading) return;

        if (!JSZipLib) {
            loadJSZip(function() { startDownload(); });
            return;
        }

        isDownloading = true;
        showProgress();
        startPromoTimer();

        const title = getComicTitle();
        log('📄 ' + title.substring(0, 25) + '...');
        setButtonState('download-zip-btn', t('statusScanning'), 'linear-gradient(135deg, #faa61a, #e67e22)');

        let imageUrls = [];
        if (isNH) {
            imageUrls = collectNHImages();
        } else if (isHE) {
            imageUrls = collectHentaiEraImages();
        } else if (isIMH) {
            imageUrls = collectImHentaiImages();
        } else {
            imageUrls = collectImageUrls(document);
        }

        if (imageUrls.length === 0) {
            log(t('logNoImagesFound'));
            setButtonState('download-zip-btn', t('statusError'), 'linear-gradient(135deg, #f04747, #d84040)');
            isDownloading = false;
            stopPromoTimer();
            return;
        }

        log('✨ Всего страниц: ' + imageUrls.length);
        const files = [];
        let currentIndex = 0;

        function processNext() {
            if (currentIndex >= imageUrls.length) {
                finishZip(files, title);
                return;
            }
            const url = imageUrls[currentIndex];
            const paddedIndex = String(currentIndex + 1).padStart(4, '0');
            let filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
            if (!filename.includes('.')) filename += '.jpg';
            const finalFilename = paddedIndex + '_' + filename;

            updateProgress(currentIndex + 1, imageUrls.length, t('statusDownloading', { current: currentIndex + 1, total: imageUrls.length }));
            setButtonState('download-zip-btn', t('statusDownloading', { current: currentIndex + 1, total: imageUrls.length }), 'linear-gradient(135deg, #faa61a, #e67e22)');

            downloadSingleImage(url, function(err, data) {
                if (!err && data) files.push({ name: finalFilename, data: data });
                currentIndex++;
                setTimeout(processNext, 180);
            });
        }
        processNext();
    }

    // =========================================================================
    // 📊 НАДЁЖНАЯ ОЧЕРЕДЬ ЗАПРОСОВ (АНТИ-ЗАВИСАНИЕ) И ПАРСИНГ СТАТИСТИКИ
    // =========================================================================
    const STATS_CACHE_PREFIX = 'tgs_cstats_v7_';
    const STATS_CACHE_TTL = 3 * 24 * 60 * 60 * 1000;
    const reqQueue = [];
    let runningReqs = 0;
    const MAX_PARALLEL_REQS = 3;
    let cardIntersectionObserver = null;

    function getStatsFromCache(url) {
        try {
            const raw = localStorage.getItem(STATS_CACHE_PREFIX + url);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.ts > STATS_CACHE_TTL) {
                localStorage.removeItem(STATS_CACHE_PREFIX + url);
                return null;
            }
            return parsed.data;
        } catch (e) {
            return null;
        }
    }

    function saveStatsToCache(url, data) {
        try {
            localStorage.setItem(STATS_CACHE_PREFIX + url, JSON.stringify({
                data: data,
                ts: Date.now()
            }));
        } catch (e) {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(STATS_CACHE_PREFIX)) {
                        localStorage.removeItem(key);
                    }
                }
            } catch (err) {}
        }
    }

    function queueStatsRequest(url, callback) {
        reqQueue.push({ url, callback });
        pumpStatsQueue();
    }

    function pumpStatsQueue() {
        if (runningReqs >= MAX_PARALLEL_REQS || reqQueue.length === 0) return;
        runningReqs++;
        const { url, callback } = reqQueue.shift();

        let finished = false;
        const finish = (result) => {
            if (finished) return;
            finished = true;
            runningReqs--;
            try { callback(result); } catch (e) {}
            setTimeout(pumpStatsQueue, 60);
        };

        const safetyTimer = setTimeout(() => {
            finish(null);
        }, 15000);

        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 12000,
                onload: function(res) {
                    clearTimeout(safetyTimer);
                    if (res.status >= 200 && res.status < 300 && res.responseText) {
                        try {
                            parseComicStats(res.responseText, url, (stats) => {
                                if (stats) saveStatsToCache(url, stats);
                                finish(stats);
                            });
                        } catch (err) {
                            console.error('[TGS] Parse error:', err);
                            finish(null);
                        }
                    } else {
                        finish(null);
                    }
                },
                onerror: function() {
                    clearTimeout(safetyTimer);
                    finish(null);
                },
                ontimeout: function() {
                    clearTimeout(safetyTimer);
                    finish(null);
                }
            });
        } catch (e) {
            clearTimeout(safetyTimer);
            finish(null);
        }
    }

    // Подсчет страниц для AllPornComic (суммирование по главам)
    function fetchMadaraTotalPages(doc, mainHtml, callback) {
        const chapterLinks = [];
        doc.querySelectorAll('li.wp-manga-chapter a, .wp-manga-chapter > a, .chapter-name a').forEach(a => {
            if (a.href && !a.href.includes('#')) chapterLinks.push(a.href);
        });
        const uniqueChaps = [...new Set(chapterLinks)];

        if (uniqueChaps.length === 0) {
            const entryImgs = doc.querySelectorAll('.reading-content img, .entry-content img:not(.avatar)');
            callback(entryImgs.length > 0 ? entryImgs.length : null);
            return;
        }

        const maxCheck = Math.min(uniqueChaps.length, 6);
        let totalPages = 0;
        let pending = maxCheck;
        let fetchedSuccess = false;

        for (let i = 0; i < maxCheck; i++) {
            const chUrl = uniqueChaps[i];
            GM_xmlhttpRequest({
                method: 'GET',
                url: chUrl,
                timeout: 10000,
                onload: function(chRes) {
                    if (chRes.status === 200 && chRes.responseText) {
                        const imgs = parseMadaraChapterImages(chRes.responseText);
                        if (imgs.length > 0) {
                            totalPages += imgs.length;
                            fetchedSuccess = true;
                        } else {
                            const cDoc = new DOMParser().parseFromString(chRes.responseText, 'text/html');
                            const cImgs = cDoc.querySelectorAll('.reading-content img, .entry-content img:not(.avatar)');
                            if (cImgs.length > 0) {
                                totalPages += cImgs.length;
                                fetchedSuccess = true;
                            }
                        }
                    }
                    pending--;
                    if (pending <= 0) {
                        callback(fetchedSuccess ? totalPages : (uniqueChaps.length + ' Ch'));
                    }
                },
                onerror: function() {
                    pending--;
                    if (pending <= 0) callback(fetchedSuccess ? totalPages : (uniqueChaps.length + ' Ch'));
                },
                ontimeout: function() {
                    pending--;
                    if (pending <= 0) callback(fetchedSuccess ? totalPages : (uniqueChaps.length + ' Ch'));
                }
            });
        }
    }

    function parseComicStats(htmlText, url, doneCallback) {
        let pages = null;
        let rating = null;
        let favorites = null;
        let downloads = null;
        let views = null;

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // --- 1. IMHENTAI.XXX ---
            if (url.includes('imhentai.xxx')) {
                const pMatch = htmlText.match(/Pages:\s*<[^>]*>([0-9,]+)<\/[^>]*>/i) ||
                               htmlText.match(/Pages:\s*([0-9,]+)/i) ||
                               htmlText.match(/class="[^"]*pages[^"]*"[^>]*>[\s\S]*?([0-9,]+)/i);
                if (pMatch) {
                    pages = (pMatch[1] || pMatch[2] || pMatch[3]).replace(/,/g, '');
                }

                const fMatch = htmlText.match(/Favourite\s*\(([0-9,]+)\)/i) ||
                               htmlText.match(/Favorite\s*\(([0-9,]+)\)/i);
                if (fMatch) favorites = fMatch[1];

                const dMatch = htmlText.match(/Download[s]?\s*[:(]\s*([0-9,]+)/i) ||
                               htmlText.match(/fa-download[^>]*><\/i>[\s\S]*?([0-9,]+)/i) ||
                               htmlText.match(/class="[^"]*download[^"]*"[^>]*>[\s\S]*?([0-9,]+)/i);
                if (dMatch) {
                    downloads = dMatch[1];
                } else {
                    const dEl = doc.querySelector('a[href*="/download/"], .btn-download, a.btn:has(i.fa-download), .download-tab, #download_stat');
                    if (dEl) {
                        const m = dEl.textContent.match(/([0-9,]+)/);
                        if (m) downloads = m[1];
                    }
                }

                doneCallback({ pages, rating: null, favorites, downloads, views: null });
                return;
            }

            // --- 1.1 HENTAIERA.COM ---
            if (url.includes('hentaiera.com')) {
                // Страницы сайт сам отображает на каждой карточке (.inside_p), поэтому pages = null

                // Избранное: Favourite (<span>1</span>) или Favourite (123)
                const fMatch = htmlText.match(/Favourite\s*\(\s*(?:<[^>]+>)?([0-9,]+)(?:<\/[^>]+>)?\s*\)/i) ||
                               htmlText.match(/id="add_fav_btn"[^>]*>[\s\S]*?([0-9,]+)/i);
                if (fMatch) {
                    favorites = (fMatch[1] || fMatch[2]).replace(/,/g, '');
                }

                // Скачивания: Download (<span>1</span>) или dl_new
                const dMatch = htmlText.match(/Download\s*\(\s*(?:<[^>]+>)?([0-9,]+)(?:<\/[^>]+>)?\s*\)/i) ||
                               htmlText.match(/id="dl_new"[^>]*>[\s\S]*?([0-9,]+)/i);
                if (dMatch) {
                    downloads = (dMatch[1] || dMatch[2]).replace(/,/g, '');
                }

                doneCallback({ pages: null, rating: null, favorites, downloads, views: null });
                return;
            }

            // --- 2. NHENTAI.NET ---
            if (url.includes('nhentai.net')) {
                const pageLink = doc.querySelector('a[href*="pages%3A"], a[href*="pages:"]');
                if (pageLink) {
                    const nameEl = pageLink.querySelector('.name');
                    pages = nameEl ? nameEl.textContent.trim() : pageLink.textContent.trim();
                }
                if (!pages) {
                    const pMatch = htmlText.match(/pages%3A(\d+)|pages:(\d+)|Pages:\s*<[^>]+>\s*<span[^>]*>(\d+)/i);
                    if (pMatch) pages = pMatch[1] || pMatch[2] || pMatch[3];
                }

                const favBtn = doc.querySelector('#favorite');
                if (favBtn) {
                    const nobold = favBtn.querySelector('.nobold');
                    if (nobold) {
                        const m = nobold.textContent.match(/([\d,]+)/);
                        if (m) favorites = m[1];
                    }
                }
                if (!favorites) {
                    const fMatch = htmlText.match(/id="favorite"[\s\S]*?nobold">\s*\(([\d,]+)\)/i);
                    if (fMatch) favorites = fMatch[1];
                }

                doneCallback({ pages, rating: null, favorites, downloads: null, views: null });
                return;
            }

            // --- 3. ALLPORNCOMIC.COM ---
            if (url.includes('allporncomic.com')) {
                const rMatch = htmlText.match(/class="[^"]*post-total-rating[^"]*"[\s\S]*?class="[^"]*score[^"]*"[^>]*>([0-9\.]+)/i) ||
                               htmlText.match(/RATING:\s*([\d\.]+)/i) ||
                               htmlText.match(/"ratingValue"\s*:\s*"?([\d\.]+)"?/i);
                if (rMatch) rating = rMatch[1];

                const bMatch = htmlText.match(/([0-9\.,]+[KkMm]?)\s*users?\s*bookmarked/i);
                if (bMatch) favorites = bMatch[1];

                const countEl = doc.querySelector('.kjpvc-count, .post-views, .views-count');
                if (countEl && countEl.textContent.trim()) {
                    views = countEl.textContent.trim();
                } else {
                    const vMatch = htmlText.match(/class="[^"]*kjpvc-count[^"]*"[^>]*>([^<]+)<\/span>/i) ||
                                   htmlText.match(/Views?[\s:：]*<\/span>\s*<span[^>]*>([^<]+)<\/span>/i);
                    if (vMatch) views = vMatch[1].trim();
                }

                fetchMadaraTotalPages(doc, htmlText, (totalPages) => {
                    doneCallback({ pages: totalPages, rating, favorites, downloads: null, views });
                });
                return;
            }

            // --- 4. 18COMIC.VIP / 18COMIC.ORG ---
            if (url.includes('18comic.')) {
                const pagesMatch = htmlText.match(/頁數[：:\s]*<[^>]*>([0-9,]+)<\/[^>]*>/i) ||
                                   htmlText.match(/頁數[：:\s]*([0-9,]+)/i) ||
                                   htmlText.match(/>([0-9,]+)\s*(?:頁|P|pages)/i);
                if (pagesMatch) pages = pagesMatch[1] || pagesMatch[2] || pagesMatch[3];

                if (!pages) {
                    const epCount = doc.querySelectorAll('.episode li, ul.btn-toolbar a[href*="/photo/"]').length;
                    if (epCount > 0) pages = `${epCount} Ch`;
                }

                const rMatch = htmlText.match(/itemprop="ratingValue"[^>]*content="([^"]+)"|class="[^"]*score[^"]*"[^>]*>([0-9\.]+)/i);
                if (rMatch) rating = rMatch[1] || rMatch[2];

                const vMatch = htmlText.match(/class="[^"]*fa-eye[^"]*"[^>]*><\/i>\s*([0-9\.,KkMm]+)|class="[^"]*view[^"]*"[^>]*>([^<]+)/i);
                if (vMatch) views = (vMatch[1] || vMatch[2] || '').trim();

                doneCallback({ pages, rating, favorites: null, downloads: null, views });
                return;
            }

            // --- 5. ILIKECOMIX & ОСТАЛЬНЫЕ ---
            const pswpItems = doc.querySelectorAll('.pswp-gallery__item, .pswp-gallery [data-pswp-src]');
            if (pswpItems && pswpItems.length > 0) {
                pages = pswpItems.length;
            } else {
                const entryImgs = doc.querySelectorAll('.entry-content img:not(.avatar), .reading-content img');
                if (entryImgs.length > 0) pages = entryImgs.length;
            }

            const rMatch = htmlText.match(/RATING:\s*([\d\.]+)/i) || htmlText.match(/"ratingValue"\s*:\s*"?([\d\.]+)"?/i);
            if (rMatch) rating = rMatch[1];

            const countEl = doc.querySelector('.kjpvc-count, .post-views, .views-count');
            if (countEl && countEl.textContent.trim()) views = countEl.textContent.trim();

            doneCallback({ pages, rating, favorites: null, downloads: null, views });

        } catch (e) {
            console.error('[TGS] Stats error:', e);
            doneCallback({ pages: null, rating: null, favorites: null, downloads: null, views: null });
        }
    }

    function renderCardOverlay(overlay, stats) {
        overlay.classList.remove('tgs-loading');
        const items = [];

        // 1. Страницы (📄)
        if (stats.pages && stats.pages !== '—') {
            items.push(`
                <span class="tgs-stat tgs-pages" title="Количество страниц: ${stats.pages}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span>${stats.pages}</span>
                </span>
            `);
        }

        // 2. Скачивания (📥) - со значком стрелочки вниз
        if (stats.downloads && stats.downloads !== '—') {
            items.push(`
                <span class="tgs-stat tgs-downloads" title="Количество скачиваний: ${stats.downloads}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>${stats.downloads}</span>
                </span>
            `);
        }

        // 3. Избранное / Лайки (❤️)
        if (stats.favorites && stats.favorites !== '—') {
            items.push(`
                <span class="tgs-stat tgs-favorites" title="В избранном: ${stats.favorites}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" stroke-width="1" style="vertical-align:-2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>${stats.favorites}</span>
                </span>
            `);
        }

        // 4. Рейтинг (★) - ТОЛЬКО если есть
        if (stats.rating && stats.rating !== '—') {
            items.push(`
                <span class="tgs-stat tgs-rating" title="Рейтинг: ${stats.rating}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="1" style="vertical-align:-2px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>${stats.rating}</span>
                </span>
            `);
        }

        // 5. Просмотры (👁) - ТОЛЬКО если есть
        if (stats.views && stats.views !== '—') {
            items.push(`
                <span class="tgs-stat tgs-views" title="Просмотры: ${stats.views}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>${stats.views}</span>
                </span>
            `);
        }

        if (items.length > 0) {
            overlay.innerHTML = items.join('');
        } else {
            overlay.style.display = 'none';
        }
    }

    function getCardComicUrl(card) {
        if (isIMH) {
            const a = card.querySelector('a[href*="/gallery/"]') || card.querySelector('a');
            return a ? a.href : null;
        }
        if (is18C) {
            const a = card.querySelector('a[href*="/album/"]') || card.querySelector('a');
            return a ? a.href : null;
        }
        if (isNH) {
            const a = card.querySelector('a.cover') || card.querySelector('a[href^="/g/"]');
            return a ? a.href : null;
        }
        if (isHE) {
            const a = card.querySelector('a.thumb_img, a[href*="/gallery/"], a[href*="/g/"]') || card.querySelector('a');
            return a ? a.href : null;
        }
        if (isAPC) {
            const a = card.querySelector('.item-thumb a, .post-title a') || card.querySelector('a');
            return a ? a.href : null;
        }
        const imgLink = card.querySelector('.post-image > a, .post-image a, a:has(> img)');
        return imgLink ? imgLink.href : (card.querySelector('h2.post-title a, .entry-title a')?.href);
    }

    function getCardTargetContainer(card) {
        if (isIMH) {
            return card.querySelector('.inner_thumb') || card.querySelector('a[href*="/gallery/"]') || card;
        }
        if (is18C) {
            return card.querySelector('.thumb-overlay') || card.querySelector('a[href*="/album/"]') || card;
        }
        if (isNH) {
            return card.querySelector('a.cover') || card;
        }
        if (isHE) {
            return card.querySelector('.inner_thumb, a.thumb_img, a[href*="/gallery/"]') || card;
        }
        if (isAPC) {
            return card.querySelector('.item-thumb') || card.querySelector('.item-thumb a') || card;
        }
        return card.querySelector('.post-image > a, .post-image a, a:has(> img)') || card;
    }

    function processCardElement(card) {
        if (card.querySelector('.tgs-card-overlay')) return;

        const comicUrl = getCardComicUrl(card);
        const targetContainer = getCardTargetContainer(card);

        if (!targetContainer || !comicUrl || !comicUrl.startsWith('http')) return;

        targetContainer.style.position = 'relative';
        targetContainer.style.display = 'block';

        // Проверяем и применяем статус (Избранное / Просмотрено)
        updateCardStatus(targetContainer, comicUrl);

        // Нажатие на карточку помечает её как просмотренную (если клик не по звёздочке)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.tgs-fav-star-btn')) return;
            markComicVisited(comicUrl);
            updateCardStatus(targetContainer, comicUrl);
        }, { passive: true });

        const overlay = document.createElement('div');
        overlay.className = 'tgs-card-overlay tgs-loading';
        overlay.innerHTML = `<span>...</span>`;
        targetContainer.appendChild(overlay);

        const cached = getStatsFromCache(comicUrl);
        if (cached) {
            renderCardOverlay(overlay, cached);
            return;
        }

        queueStatsRequest(comicUrl, (stats) => {
            if (stats) {
                renderCardOverlay(overlay, stats);
            } else {
                overlay.style.display = 'none';
            }
        });
    }

    function initCardStats() {
        const supported = isILC || is18C || isNH || isHE || isAPC || isIMH;
        if (!supported) return;

        checkCurrentPageVisited();
        injectStyles();

        function getCardSelectors() {
            if (isIMH) return '.thumb, .gallery_item';
            if (is18C) return '.thumb-overlay, .video-elem, .col-xs-6.col-sm-6.col-md-4.col-lg-3, .well.well-sm';
            if (isNH) return '.gallery';
            if (isHE) return '.thumb, .gallery, .item, .gallery-item';
            if (isAPC) return '.page-item-detail, .c-tabs-item__content, .c-blog-item, article.post';
            return 'article.post, .loops-wrapper article, article[id^="post-"]';
        }

        if (!cardIntersectionObserver && window.IntersectionObserver) {
            cardIntersectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        observer.unobserve(card);
                        processCardElement(card);
                    }
                });
            }, {
                root: null,
                rootMargin: '350px 0px',
                threshold: 0.01
            });
        }

        function scanAndObserve() {
            const selector = getCardSelectors();
            const cards = document.querySelectorAll(selector);
            cards.forEach(card => {
                if (card.dataset.tgsObserved) return;
                card.dataset.tgsObserved = '1';
                if (cardIntersectionObserver) {
                    cardIntersectionObserver.observe(card);
                } else {
                    processCardElement(card);
                }
            });
        }

        scanAndObserve();

        const container = document.querySelector('#loops-wrapper, #content, .galleries, .site-content, .container, body') || document.body;
        if (container) {
            const mutObserver = new MutationObserver(() => scanAndObserve());
            mutObserver.observe(container, { childList: true, subtree: true });
        }
    }

    
    function insertTgsBrandGroup() {
        if (document.getElementById('tgs-brand-group')) return;

        const group = document.createElement('span');
        group.id = 'tgs-brand-group';
        group.className = 'tgs-brand-group';
        group.innerHTML = `
            <span style="font-weight: 700; color: #f43f5e; margin-right: 2px;">🚀 Terebonkoff Game Studio</span>
            <span style="color: #64748b; margin-right: 2px;">/</span>
            <a href="https://github.com/Terebonkoff/TGS-UserScripts" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-weight: 600; margin-right: 4px;">Scripts</a>
            <span style="color: #475569; margin-right: 4px;">|</span>
            <a href="https://boosty.to/terebonkoff" target="_blank" rel="noopener noreferrer" class="tgs-support-btn" style="background: rgba(249, 115, 22, 0.16) !important; color: #fb923c !important; border-color: rgba(249, 115, 22, 0.45) !important;" title="Поддержать на Boosty">
                <span>☕</span> <span>Boosty</span>
            </a>
            <a href="https://www.patreon.com/c/terebonkoff/about" target="_blank" rel="noopener noreferrer" class="tgs-support-btn" style="background: rgba(244, 63, 94, 0.16) !important; color: #fda4af !important; border-color: rgba(244, 63, 94, 0.45) !important;" title="Поддержать на Patreon">
                <span>💖</span> <span>Patreon</span>
            </a>
            <a href="https://github.com/Terebonkoff/TGS-UserScripts" target="_blank" rel="noopener noreferrer" class="tgs-github-btn" style="background: rgba(56, 189, 248, 0.16) !important; color: #7dd3fc !important; border-color: rgba(56, 189, 248, 0.45) !important;" title="Официальный GitHub TGS: все скрипты и обновления">
                <span>⭐</span> <span>GitHub</span>
            </a>
        `;

        // 1. F95Zone: в шапку перед иконками пользователя
        const navOpposite = document.querySelector('.p-nav-opposite, .uix_headerRight');
        if (navOpposite && navOpposite.parentNode) {
            navOpposite.parentNode.insertBefore(group, navOpposite);
            return;
        }

        // 2. RuTracker / Pornolab: в единую строчку тулбара
        const tb = document.querySelector('.rt-toolbar');
        if (tb) {
            tb.appendChild(group);
            return;
        }

        // 3. Главное меню сайтов
        const nav = document.querySelector('#main-nav, #page_header, #top-nav, .topmenu, #nav-panel, .p-nav-inner');
        if (nav) {
            nav.appendChild(group);
            return;
        }
    }

    function init() {
        setTimeout(insertTgsBrandGroup, 1000);
        checkCurrentPageVisited();
        loadJSZip(function() {
            addControlPanel();
            initCardStats();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
