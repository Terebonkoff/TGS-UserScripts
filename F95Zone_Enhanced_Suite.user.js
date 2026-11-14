// ==UserScript==
// @name         F95Zone: Enhanced Suite by TGS
// @name:ru      F95Zone: Enhanced Suite by TGS
// @name:en      F95Zone: Enhanced Suite by TGS
// @namespace    https://www.patreon.com/Terebonkoff
// @version      24.2
// @description  Адаптивный макет под боковое меню, прямое отображение HD-скриншотов, Lightbox, слайдеры размеров и удобные ссылки скачивания.
// @description:en Adaptive layout for sidebar menu, direct HD screenshots, Lightbox viewer, size sliders, and clean Windows download links.
// @author       Terebonkoff (TGS)
// @icon         https://purepng.com/public/uploads/thumbnail//sexy-little-caprice-in-white-dress-zly.png
// @match        https://f95zone.to/*
// @match        https://f95zone.to/threads/*
// @match        https://f95zone.to/sam/latest_alpha/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const KEY_SS_WIDTH     = 'f95_ss_w_v14';
    const KEY_BANNER_WIDTH = 'f95_banner_w_v14';
    const KEY_HIDE_INFO    = 'f95_hide_info_v14';
    const KEY_CARD_SIZE    = 'f95_card_size_v14';

    const KEY_LOCK_CARD    = 'f95_lock_card_v16';
    const KEY_LOCK_BANNER  = 'f95_lock_banner_v16';
    const KEY_LOCK_SS      = 'f95_lock_ss_v16';

    const DEF_SS_WIDTH     = 480;
    const DEF_BANNER_WIDTH = 750;
    const DEF_CARD_SIZE    = 230;

    function getVal(key, def) {
        try { if (typeof GM_getValue === 'function') return GM_getValue(key, def); } catch (e) {}
        try {
            const v = localStorage.getItem(key);
            if (v !== null) return typeof def === 'boolean' ? v === 'true' : parseInt(v, 10);
        } catch (e) {}
        return def;
    }

    function setVal(key, val) {
        try { if (typeof GM_setValue === 'function') GM_setValue(key, val); } catch (e) {}
        try { localStorage.setItem(key, val.toString()); } catch (e) {}
    }

    // --- 1. Глобальные CSS стили ---
    function injectStyles() {
        let style = document.getElementById('f95-suite-styles-v21');
        if (!style) {
            style = document.createElement('style');
            style.id = 'f95-suite-styles-v21';
            (document.head || document.documentElement).appendChild(style);
        }

        const curSS = getVal(KEY_SS_WIDTH, DEF_SS_WIDTH);
        const curBanner = getVal(KEY_BANNER_WIDTH, DEF_BANNER_WIDTH);
        const curCardSize = getVal(KEY_CARD_SIZE, DEF_CARD_SIZE);

        style.textContent = `
            :root {
                --f95-ss-w: ${curSS}px;
                --f95-banner-w: ${curBanner}px;
                --f95-card-w: ${curCardSize}px;
            }

            /* 1. Адаптивная ширина макета с учетом левого бокового меню F95Zone:
               Убираем лишнюю черную зону слева, прижимаем контент аккуратно к меню и не даем элементам вылезать вправо */
            html, body {
                width: 100% !important;
                max-width: 100vw !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
                box-sizing: border-box !important;
            }

            .p-pageWrapper, .uix_pageWrapper--fixed, .uix_headerContainer, .pageContent, .uix_contentWrapper {
                max-width: 100% !important;
                width: 100% !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                padding-left: 0 !important;
                box-sizing: border-box !important;
            }

            .p-body-inner, .p-header-inner, .p-nav-inner, .p-sectionLinks-inner, .p-footer-inner,
            .content-container, .page-container, .main,
            [class*="latest_alpha"], [class*="latest-alpha"],
            [class*="content-wrapper"], [class*="main-wrapper"], [class*="page-wrapper"],
            [class*="max-w-"], [class*="v-container"], [class*="v-application"] {
                max-width: calc(100% - 24px) !important;
                width: auto !important;
                margin-left: 10px !important;
                margin-right: 14px !important;
                box-sizing: border-box !important;
            }

            .p-body {
                flex: 1 1 0% !important;
                min-width: 0 !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            #app > div, #app > main, #app .container, #app .main,
            .p-body-main, .p-body-content, .p-body-pageContent, .block--messages, .message-inner {
                max-width: 100% !important;
                width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }
            .message-cell.message-cell--main {
                flex-grow: 1 !important;
                min-width: 0 !important;
            }

            /* 2. Удаление информационных баннеров */
            .notice, .notices, .notice--block, .notice--primary, .notice--accent, .notice--warning,
            .u-bottomFixer, [class*="notice--"], [data-notice-id],
            .blockMessage--warning, .blockMessage--important, .blockMessage--error,
            div[class*="Notice"], div[class*="announcement"], .alert-box, .f95-banner-hidden {
                display: none !important;
            }

            /* 3. Полное удаление баннеров-подписей у комментаторов в чате */
            .message-signature, .message-signatureWrapper, [class*="message-signature"], .uix_signatureExpand {
                display: none !important;
            }

            /* 4. Полное удаление виджета покупки в Steam */
            iframe[data-s9e-mediaembed="steamstore"],
            iframe[src*="steampowered.com"],
            iframe[data-s9e-mediaembed-src*="steampowered.com"],
            [data-s9e-mediaembed="steamstore"],
            [data-media-site-id="steam"] {
                display: none !important;
            }

            /* 5. Сетка карточек */
            [class*="grid-cols-"], [class*="grid"], [class*="tiles"], [class*="cards"] {
                grid-template-columns: repeat(auto-fill, minmax(var(--f95-card-w, 230px), 1fr)) !important;
            }

            .f95-card-new-badge {
                position: absolute !important;
                top: 6px !important;
                left: 6px !important;
                background: #ef4444 !important;
                color: #ffffff !important;
                font-weight: 800 !important;
                font-size: 11px !important;
                padding: 3px 8px !important;
                border-radius: 4px !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.6) !important;
                z-index: 25 !important;
                letter-spacing: 0.5px !important;
                line-height: 1 !important;
                text-transform: uppercase !important;
                pointer-events: none !important;
            }

            /* Контейнеры ползунков и кнопки-замочки */
            .f95-slider-box {
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                vertical-align: middle !important;
            }

            .f95-clean-slider {
                width: 200px !important;
                height: 6px !important;
                border-radius: 3px !important;
                background: #4e5058 !important;
                outline: none !important;
                cursor: pointer !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                vertical-align: middle !important;
            }
            .f95-clean-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 16px !important;
                height: 16px !important;
                border-radius: 50% !important;
                background: #5865f2 !important;
                border: 2px solid #ffffff !important;
                cursor: pointer !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important;
            }

            .f95-lock-btn {
                background: #2b2d31 !important;
                border: 1px solid #4e5058 !important;
                color: #dbdee1 !important;
                border-radius: 4px !important;
                padding: 3px 7px !important;
                font-size: 13px !important;
                cursor: pointer !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                line-height: 1 !important;
                transition: all 0.15s !important;
                user-select: none !important;
            }
            .f95-lock-btn:hover {
                background: #5865f2 !important;
                border-color: #5865f2 !important;
                color: #ffffff !important;
            }

            /* 6. Верхняя панель в темах */
            .f95-top-nav-controls {
                display: inline-flex !important;
                align-items: center !important;
                gap: 12px !important;
                margin-left: 14px !important;
                vertical-align: middle !important;
            }

            .f95-info-btn {
                background: #2b2d31 !important;
                border: 1px solid #4e5058 !important;
                color: #dbdee1 !important;
                border-radius: 4px !important;
                padding: 4px 8px !important;
                font-size: 11px !important;
                cursor: pointer !important;
                transition: all 0.15s !important;
                white-space: nowrap !important;
            }
            .f95-info-btn:hover {
                background: #5865f2 !important;
                color: #fff !important;
                border-color: #5865f2 !important;
            }

            /* 7. Баннер игры */
            .f95-banner-top-right {
                float: right !important;
                clear: right !important;
                width: var(--f95-banner-w) !important;
                max-width: min(var(--f95-banner-w), 62%) !important;
                margin: 0 0 16px 24px !important;
                text-align: right !important;
            }
            .f95-banner-top-right img {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                display: block !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 18px rgba(0,0,0,0.5) !important;
            }

            .message--post:first-of-type .message-body .bbCodeSpoiler {
                margin: 4px 0 6px 0 !important;
            }
            .message--post:first-of-type .message-body br + br {
                display: none !important;
            }

            /* Ползунок над скриншотами */
            .f95-bottom-slider-wrap {
                display: block !important;
                clear: both !important;
                margin: 18px 6px 12px 6px !important;
                padding: 6px 0 !important;
            }
            .f95-bottom-slider-wrap .f95-clean-slider {
                width: 240px !important;
            }

            /* Скриншоты плиткой в ряд */
            .f95-ss-item {
                display: inline-block !important;
                width: var(--f95-ss-w) !important;
                max-width: 100% !important;
                margin: 6px !important;
                vertical-align: top !important;
                text-decoration: none !important;
                border: none !important;
                outline: none !important;
                cursor: pointer !important;
                transition: transform 0.15s ease !important;
            }
            .f95-ss-item:hover {
                transform: translateY(-2px) scale(1.01) !important;
            }
            .f95-ss-item img {
                width: 100% !important;
                height: auto !important;
                display: block !important;
                border-radius: 6px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45) !important;
            }

            /* 8. Аккуратный дубликат скачивания Windows под скриншотами */
            .f95-win-duplicate-box {
                display: block !important;
                clear: both !important;
                text-align: center !important;
                margin: 18px auto 14px auto !important;
                padding: 6px 12px !important;
                font-size: 15px !important;
                line-height: 1.8 !important;
            }
            .f95-win-dup-row {
                display: inline-block !important;
                text-align: center !important;
            }

            /* 9. Полноэкранный просмотрщик скриншотов (Lightbox) */
            #f95-lightbox-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.94) !important;
                z-index: 99999999 !important;
                display: none !important; /* Гарантированно скрыт по умолчанию! */
                align-items: center !important;
                justify-content: center !important;
                cursor: zoom-out !important;
                backdrop-filter: blur(6px) !important;
                user-select: none !important;
            }
            #f95-lightbox-overlay.f95-active {
                display: flex !important; /* Активируется только при открытии */
            }
            #f95-lightbox-img {
                max-width: 96vw !important;
                max-height: 96vh !important;
                object-fit: contain !important;
                border-radius: 8px !important;
                box-shadow: 0 8px 36px rgba(0, 0, 0, 0.85) !important;
                cursor: default !important;
                transition: transform 0.2s ease !important;
            }
            #f95-lightbox-close {
                position: absolute !important;
                top: 20px !important;
                right: 26px !important;
                width: 44px !important;
                height: 44px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: rgba(30, 32, 38, 0.85) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                border-radius: 50% !important;
                font-size: 28px !important;
                font-weight: 700 !important;
                color: #ffffff !important;
                cursor: pointer !important;
                line-height: 1 !important;
                z-index: 100000000 !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7) !important;
            }
            #f95-lightbox-close:hover {
                background: #ef4444 !important;
                border-color: #ef4444 !important;
                transform: scale(1.1) !important;
            }
            /* 10. Кнопка поддержки Terebonkoff Game Studio в правом верхнем углу */
            .f95-tgs-support-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 7px !important;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.16), rgba(88, 101, 242, 0.22)) !important;
                border: 1px solid rgba(239, 68, 68, 0.6) !important;
                color: #ffffff !important;
                padding: 4px 12px !important;
                border-radius: 6px !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                line-height: 1.2 !important;
                margin-right: 14px !important;
                transition: all 0.2s ease !important;
                white-space: nowrap !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45) !important;
                cursor: pointer !important;
                user-select: none !important;
                vertical-align: middle !important;
            }
            .f95-tgs-support-btn:hover {
                background: linear-gradient(135deg, #ef4444, #dc2626) !important;
                border-color: #ef4444 !important;
                color: #ffffff !important;
                box-shadow: 0 0 16px rgba(239, 68, 68, 0.75) !important;
                transform: translateY(-1px) scale(1.02) !important;
            }
            .f95-tgs-heart {
                font-size: 13px !important;
                line-height: 1 !important;
                display: inline-block !important;
                animation: f95-tgs-pulse 2s infinite ease-in-out !important;
            }
            @keyframes f95-tgs-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.22); }
            }
        `;
    }

    injectStyles();

        
    function insertTgsBrandGroup() {
        if (document.getElementById('tgs-brand-group')) return;

        const group = document.createElement('span');
        group.id = 'tgs-brand-group';
        group.className = 'tgs-brand-group';
        group.innerHTML = `
            <a href="https://www.patreon.com/c/terebonkoff/about" target="_blank" rel="noopener noreferrer" class="tgs-support-btn" title="Поддержать Terebonkoff Game Studio на Patreon">
                <span class="tgs-heart">💖</span> <span>Support Me</span>
            </a>
            <a href="https://github.com/Terebonkoff/TGS-UserScripts" target="_blank" rel="noopener noreferrer" class="tgs-github-btn" title="Официальный GitHub TGS: все скрипты и обновления">
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

// --- 2. Очистка инфо-баннеров, подписей в чате и плашки Steam ---
    function purgeAllNotices() {
        // Обычные системные плашки
        document.querySelectorAll('.notice, .notices, .notice--block, .blockMessage, [class*="notice"], [data-notice-id]').forEach(el => {
            el.style.display = 'none';
        });

        // Подписи комментаторов в чате
        document.querySelectorAll('.message-signature, .message-signatureWrapper, [class*="message-signature"]').forEach(el => {
            el.style.display = 'none';
        });

        // Плашка Steam
        document.querySelectorAll('iframe[data-s9e-mediaembed*="steam"], iframe[src*="steampowered.com"], iframe[data-s9e-mediaembed-src*="steampowered.com"]').forEach(el => {
            el.style.display = 'none';
            const p = el.parentElement;
            if (p && (p.classList.contains('bbMediaWrapper') || p.classList.contains('s9e-mediaembed-wrapper'))) {
                p.style.display = 'none';
            }
        });

        const phrases = [
            'disable the old latest updates page',
            'Uploader applications are open',
            'visuals in this game were created with AI',
            'Thank you for your patience'
        ];

        document.querySelectorAll('div, p, span').forEach(el => {
            const txt = el.textContent || '';
            if (txt.length < 350 && phrases.some(p => txt.includes(p))) {
                const box = el.closest('.notice, .blockMessage, div[class*="notice"], div') || el;
                box.style.display = 'none';
                box.classList.add('f95-banner-hidden');
            }
        });
    }

    // --- 3. Парсер чисел ---
    function parseCount(str) {
        if (!str) return null;
        const clean = str.trim().toLowerCase().replace(/,/g, '');
        const m = clean.match(/([\d.]+)\s*([km])?/i);
        if (!m) return null;
        let n = parseFloat(m[1]);
        if (isNaN(n)) return null;
        const unit = (m[2] || '').toLowerCase();
        if (unit === 'm') n *= 1000000;
        else if (unit === 'k') n *= 1000;
        return Math.round(n);
    }

    // --- 4. Золотые иконки ---
    function applyGoldColor(iconEl, glowing) {
        if (!iconEl) return;
        const color = glowing ? '#ffe066' : '#ffd700';
        const shadow = glowing
            ? 'drop-shadow(0 0 6px #ffd700) drop-shadow(0 0 2px #fff)'
            : 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.7))';
        const scale = glowing ? 'scale(1.2)' : 'scale(1.1)';

        iconEl.style.setProperty('color', color, 'important');
        iconEl.style.setProperty('fill', color, 'important');
        iconEl.style.setProperty('filter', shadow, 'important');
        iconEl.style.setProperty('transform', scale, 'important');
        iconEl.style.setProperty('display', 'inline-block', 'important');

        iconEl.querySelectorAll('*').forEach(p => {
            p.style.setProperty('fill', color, 'important');
            p.style.setProperty('color', color, 'important');
            if (p.setAttribute) p.setAttribute('fill', color);
        });
    }

    function resetIconColor(iconEl) {
        if (!iconEl) return;
        iconEl.style.removeProperty('color');
        iconEl.style.removeProperty('fill');
        iconEl.style.removeProperty('filter');
        iconEl.style.removeProperty('transform');
        iconEl.querySelectorAll('*').forEach(p => {
            p.style.removeProperty('fill');
            p.style.removeProperty('color');
        });
    }

    // --- 5. Поиск сетки и карточек на latest_alpha ---
    function findGridAndCards() {
        let candidates = Array.from(document.querySelectorAll('a[href*="threads"], a[href*="thread"], [data-thread-id]'));
        if (candidates.length < 3) {
            candidates = Array.from(document.querySelectorAll('img')).filter(img => {
                return !img.classList.contains('avatar') && !img.closest('.avatar');
            });
        }
        if (candidates.length < 2) return null;

        const parentCounts = new Map();
        candidates.forEach(a => {
            let p = a.parentElement;
            while (p && p !== document.body && p !== document.documentElement) {
                parentCounts.set(p, (parentCounts.get(p) || 0) + 1);
                p = p.parentElement;
            }
        });

        let gridContainer = null;
        let maxDepth = -1;

        parentCounts.forEach((count, el) => {
            if (count >= 3) {
                let depth = 0;
                let cur = el;
                while (cur.parentElement) { depth++; cur = cur.parentElement; }
                if (depth > maxDepth) {
                    const childrenWithGames = Array.from(el.children).filter(c => {
                        return c.querySelector && (c.querySelector('img') || c.querySelector('a[href*="thread"]'));
                    });
                    if (childrenWithGames.length >= 3) {
                        maxDepth = depth;
                        gridContainer = el;
                    }
                }
            }
        });

        if (!gridContainer) return null;

        const cards = Array.from(gridContainer.children).filter(c => {
            return c.querySelector && (c.querySelector('img') || c.querySelector('a[href*="thread"]'));
        });
        return { gridContainer, cards };
    }

    // --- 6. Раскладка latest_alpha (5-6 карточек в ряд, отступ 4 см) ---
    function adjustAlphaLayout(data) {
        const { gridContainer, cards } = data;
        const curCardW = getVal(KEY_CARD_SIZE, DEF_CARD_SIZE);

        gridContainer.style.setProperty('display', 'grid', 'important');
        gridContainer.style.setProperty('grid-template-columns', `repeat(auto-fill, minmax(${curCardW}px, 1fr))`, 'important');
        gridContainer.style.setProperty('gap', '16px', 'important');
        gridContainer.style.setProperty('width', '100%', 'important');
        gridContainer.style.setProperty('max-width', '100%', 'important');
        gridContainer.style.setProperty('flex', '1 1 0%', 'important');
        gridContainer.style.setProperty('min-width', '0', 'important');

        const directParent = gridContainer.parentElement;
        if (directParent && directParent.id !== 'f95-alpha-left-column') {
            const leftCol = document.createElement('div');
            leftCol.id = 'f95-alpha-left-column';
            leftCol.style.cssText = 'flex: 1 1 0% !important; min-width: 0 !important; width: 100% !important; display: flex !important; flex-direction: column !important;';
            directParent.insertBefore(leftCol, gridContainer);
            leftCol.appendChild(gridContainer);
        }

        const leftColumn = document.getElementById('f95-alpha-left-column');
        const mainWrapper = leftColumn ? leftColumn.parentElement : gridContainer.parentElement;

        if (leftColumn) {
            Array.from(gridContainer.children).forEach(child => {
                const txt = (child.textContent || '').trim();
                if (!child.querySelector('img') && (/prev|next/i.test(txt) || child.querySelector('.pageNav, [class*="pagination"], [class*="pageNav"]'))) {
                    leftColumn.appendChild(child);
                    child.style.setProperty('width', '100%', 'important');
                    child.style.setProperty('display', 'flex', 'important');
                    child.style.setProperty('justify-content', 'center', 'important');
                    child.style.setProperty('margin-top', '24px', 'important');
                    child.style.setProperty('margin-bottom', '30px', 'important');
                }
            });
        }

        if (mainWrapper && mainWrapper !== document.body) {
            mainWrapper.style.setProperty('display', 'flex', 'important');
            mainWrapper.style.setProperty('flex-direction', 'row', 'important');
            mainWrapper.style.setProperty('align-items', 'flex-start', 'important');
            mainWrapper.style.setProperty('width', '100%', 'important');
            mainWrapper.style.setProperty('max-width', 'calc(100% - 24px)', 'important');
            mainWrapper.style.setProperty('margin-left', '10px', 'important');
            mainWrapper.style.setProperty('margin-right', '14px', 'important');
            mainWrapper.style.gap = '24px';

            let filterSidebar = null;
            const extraElements = [];

            Array.from(mainWrapper.children).forEach(child => {
                if (child === leftColumn || child === gridContainer) return;
                const txt = (child.textContent || '').trim();
                if (/filters/i.test(txt) && (/category|sorting|tags|search|date/i.test(txt) || child.querySelector('[class*="filter"]'))) {
                    filterSidebar = child;
                } else if (/prev|next/i.test(txt) || child.querySelector('.pageNav, [class*="pagination"], [class*="pageNav"]')) {
                    extraElements.push(child);
                } else {
                    if (!filterSidebar) filterSidebar = child;
                    else extraElements.push(child);
                }
            });

            extraElements.forEach(el => {
                if (leftColumn) {
                    leftColumn.appendChild(el);
                    el.style.setProperty('width', '100%', 'important');
                    el.style.setProperty('max-width', '100%', 'important');
                    el.style.setProperty('display', 'flex', 'important');
                    el.style.setProperty('justify-content', 'center', 'important');
                    el.style.setProperty('align-items', 'center', 'important');
                    el.style.setProperty('margin-top', '24px', 'important');
                    el.style.setProperty('margin-bottom', '30px', 'important');
                    el.style.setProperty('flex', 'none', 'important');
                }
            });

            if (filterSidebar) {
                filterSidebar.style.setProperty('flex', '0 0 300px', 'important');
                filterSidebar.style.setProperty('width', '300px', 'important');
                filterSidebar.style.setProperty('min-width', '280px', 'important');
                filterSidebar.style.setProperty('max-width', '320px', 'important');
            }
        }

        let anc = mainWrapper || gridContainer;
        while (anc && anc !== document.body && anc !== document.documentElement) {
            anc.style.setProperty('max-width', '100%', 'important');
            anc.style.setProperty('width', '100%', 'important');
            anc.style.setProperty('box-sizing', 'border-box', 'important');
            anc = anc.parentElement;
        }

        cards.forEach(card => {
            card.style.setProperty('width', '100%', 'important');
            card.style.setProperty('max-width', '100%', 'important');
            card.style.setProperty('min-width', '0', 'important');
            card.style.setProperty('flex', 'none', 'important');
            card.style.setProperty('box-sizing', 'border-box', 'important');

            const img = card.querySelector('img');
            if (img) {
                img.style.setProperty('width', '100%', 'important');
                img.style.setProperty('max-width', '100%', 'important');
                img.style.height = 'auto';
                img.style.setProperty('display', 'block', 'important');
            }
        });
    }

    // --- 7. Ползунок карточек на latest_alpha с замочком ---
    function updateCardSize(w) {
        document.documentElement.style.setProperty('--f95-card-w', `${w}px`);
        const data = findGridAndCards();
        if (data && data.gridContainer) {
            data.gridContainer.style.setProperty('grid-template-columns', `repeat(auto-fill, minmax(${w}px, 1fr))`, 'important');
        }
    }

    function setupAlphaControls(gridContainer) {
        if (document.querySelector('.f95-alpha-slider-wrap')) return;

        const curCardW = getVal(KEY_CARD_SIZE, DEF_CARD_SIZE);
        let isLocked = getVal(KEY_LOCK_CARD, false);

        const wrap = document.createElement('div');
        wrap.className = 'f95-alpha-slider-wrap';
        wrap.style.cssText = 'display: flex !important; align-items: center !important; justify-content: flex-end !important; margin-bottom: 12px !important; width: 100% !important;';
        wrap.innerHTML = `
            <div class="f95-slider-box">
                <input type="range" class="f95-clean-slider" id="f95-card-slider" min="160" max="440" step="10" value="${curCardW}" title="Размер карточек игр" style="${isLocked ? 'display: none !important;' : ''}">
                <button type="button" class="f95-lock-btn" id="f95-lock-card" title="${isLocked ? 'Разблокировать ползунок' : 'Заблокировать ползунок'}">${isLocked ? '🔒' : '🔓'}</button>
            </div>
        `;

        const leftCol = document.getElementById('f95-alpha-left-column');
        const targetParent = leftCol || gridContainer.parentNode;
        targetParent.insertBefore(wrap, gridContainer);

        const slider = wrap.querySelector('#f95-card-slider');
        const lockBtn = wrap.querySelector('#f95-lock-card');

        slider.addEventListener('input', (e) => {
            const w = parseInt(e.target.value, 10);
            updateCardSize(w);
        });
        slider.addEventListener('change', (e) => {
            const w = parseInt(e.target.value, 10);
            updateCardSize(w);
            setVal(KEY_CARD_SIZE, w);
        });

        lockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isLocked = !isLocked;
            setVal(KEY_LOCK_CARD, isLocked);
            slider.style.setProperty('display', isLocked ? 'none' : 'inline-block', 'important');
            lockBtn.textContent = isLocked ? '🔒' : '🔓';
            lockBtn.title = isLocked ? 'Разблокировать ползунок' : 'Заблокировать ползунок';
        });
    }

    // --- 8. Рамки, глазики, лайки, NEW ---
    function processCardStats(card) {
        let viewsVal = null;
        let likesVal = null;
        let eyeIcon = null;
        let thumbIcon = null;

        const icons = Array.from(card.querySelectorAll('svg, i, [class*="icon"]'));

        icons.forEach(ic => {
            const cls = ((ic.className && typeof ic.className === 'string' ? ic.className : '') + ' ' + (ic.getAttribute('data-icon') || '')).toLowerCase();
            const parentTxt = ic.parentElement ? (ic.parentElement.textContent || '').trim() : '';

            if (/eye|view/i.test(cls)) {
                if (!eyeIcon) eyeIcon = ic;
                const parsed = parseCount(parentTxt);
                if (parsed !== null && viewsVal === null) viewsVal = parsed;
            } else if (/thumb|like/i.test(cls)) {
                if (!thumbIcon) thumbIcon = ic;
                const parsed = parseCount(parentTxt);
                if (parsed !== null && likesVal === null) likesVal = parsed;
            }
        });

        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let tNode;
        while (tNode = walker.nextNode()) {
            const t = (tNode.textContent || '').trim();
            if (t) textNodes.push({ text: t, node: tNode, parent: tNode.parentElement });
        }

        textNodes.forEach(item => {
            const t = item.text;
            if (/\b\d+(\.\d+)?\s*[MKkm]\b/i.test(t)) {
                if (viewsVal === null) {
                    viewsVal = parseCount(t);
                    if (!eyeIcon) {
                        eyeIcon = item.parent.querySelector('svg, i') ||
                                  (item.parent.previousElementSibling ? item.parent.previousElementSibling.querySelector('svg, i') : null) ||
                                  item.parent;
                    }
                }
            }
        });

        textNodes.forEach(item => {
            const t = item.text;
            if (/^\d+$/.test(t.replace(/,/g, '')) || /\b\d+(\.\d+)?\s*k\b/i.test(t)) {
                const n = parseCount(t);
                if (n !== null && !/(hour|day|min|yesterday|ago|v\d)/i.test(t) && n !== viewsVal) {
                    if (likesVal === null && (n > 5 || !card.textContent.includes('★ ' + t))) {
                        likesVal = n;
                        if (!thumbIcon) {
                            thumbIcon = item.parent.querySelector('svg, i') ||
                                        (item.parent.previousElementSibling ? item.parent.previousElementSibling.querySelector('svg, i') : null) ||
                                        item.parent;
                        }
                    }
                }
            }
        });

        const statSvgs = Array.from(card.querySelectorAll('svg, i')).filter(ic => {
            const p = ic.parentElement;
            return p && !p.classList.contains('avatar') && !ic.closest('.f95-card-new-badge');
        });
        if (statSvgs.length >= 2) {
            if (!thumbIcon) thumbIcon = statSvgs[0];
            if (!eyeIcon) eyeIcon = statSvgs[1];
        }

        if (viewsVal !== null && viewsVal >= 2000000) {
            card.style.setProperty('border', '2px solid #ffd700', 'important');
            card.style.setProperty('box-shadow', '0 0 14px rgba(255, 215, 0, 0.45)', 'important');
            card.style.setProperty('border-radius', '8px', 'important');
        } else if (viewsVal !== null && viewsVal >= 500000) {
            card.style.setProperty('border', '2px solid #d1d5db', 'important');
            card.style.setProperty('box-shadow', '0 0 9px rgba(209, 213, 219, 0.35)', 'important');
            card.style.setProperty('border-radius', '8px', 'important');
        } else {
            card.style.setProperty('border', 'none', 'important');
            card.style.setProperty('box-shadow', 'none', 'important');
        }

        if (eyeIcon && viewsVal !== null) {
            if (viewsVal >= 5000000) applyGoldColor(eyeIcon, true);
            else if (viewsVal >= 1000000) applyGoldColor(eyeIcon, false);
            else resetIconColor(eyeIcon);
        }

        if (viewsVal !== null && viewsVal < 100000) {
            if (!card.querySelector('.f95-card-new-badge')) {
                const badge = document.createElement('span');
                badge.className = 'f95-card-new-badge';
                badge.textContent = 'NEW';
                const img = card.querySelector('img');
                const thumbWrap = (img ? img.closest('a, div') : null) || card;
                if (thumbWrap && thumbWrap.style) {
                    thumbWrap.style.setProperty('position', 'relative', 'important');
                    thumbWrap.appendChild(badge);
                }
            }
        } else {
            const oldBadge = card.querySelector('.f95-card-new-badge');
            if (oldBadge) oldBadge.remove();
        }

        if (thumbIcon && likesVal !== null) {
            if (likesVal >= 1000) applyGoldColor(thumbIcon, false);
            else resetIconColor(thumbIcon);
        }
    }

    // --- 9. Исправленный полноэкранный Lightbox просмотрщик ---
    function setupScreenshotLightbox() {
        let overlay = document.getElementById('f95-lightbox-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'f95-lightbox-overlay';
            overlay.innerHTML = `
                <div id="f95-lightbox-close" title="Закрыть (Esc или клик мимо)">&times;</div>
                <img id="f95-lightbox-img" src="" alt="">
            `;
            document.body.appendChild(overlay);

            const closeBtn = overlay.querySelector('#f95-lightbox-close');
            const imgEl = overlay.querySelector('#f95-lightbox-img');

            const closeLb = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                overlay.classList.remove('f95-active');
                overlay.style.setProperty('display', 'none', 'important');
                imgEl.src = '';
                document.body.style.removeProperty('overflow');
            };

            // Клик по крестику
            closeBtn.addEventListener('click', closeLb, true);

            // Клик в любое место фона (за пределами картинки) закрывает
            overlay.addEventListener('click', (e) => {
                if (e.target !== imgEl) {
                    closeLb(e);
                }
            }, true);

            // Клик по картинке не закрывает окно
            imgEl.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Закрытие клавишей Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && overlay.classList.contains('f95-active')) {
                    closeLb(e);
                }
            });
        }
    }

    function openLightbox(fullUrl, fallbackUrl) {
        setupScreenshotLightbox();
        const overlay = document.getElementById('f95-lightbox-overlay');
        const imgEl = document.getElementById('f95-lightbox-img');
        if (overlay && imgEl) {
            // Если полноразмерное изображение не смогло загрузиться — мгновенно подставляем рабочий оригинал
            imgEl.onerror = function() {
                if (fallbackUrl && imgEl.src !== fallbackUrl) {
                    imgEl.src = fallbackUrl;
                }
            };

            imgEl.src = fullUrl || fallbackUrl;
            overlay.classList.add('f95-active');
            overlay.style.setProperty('display', 'flex', 'important');
            document.body.style.setProperty('overflow', 'hidden', 'important');
        }
    }

    // --- 10. Прямое вычисление ссылки на полноразмерный HD оригинал ---
    function resolveFullHdUrl(img) {
        if (!img) return null;

        const parentA = img.closest('a');
        if (parentA) {
            const href = parentA.getAttribute('href') || parentA.href || '';
            if (href.includes('attachments.f95zone.to')) {
                return href.replace('/thumb/', '/').replace(/_thumb(\.[a-z]+)$/i, '$1');
            }
            if (/\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(href) && !/\/show\/|\/view\/|\/gallery\//i.test(href)) {
                return href.replace('/thumb/', '/').replace(/_thumb(\.[a-z]+)$/i, '$1');
            }
        }

        const currentSrc = img.currentSrc || img.getAttribute('src') || img.src || '';

        if (currentSrc.includes('attachments.f95zone.to')) {
            return currentSrc.replace('/thumb/', '/').replace(/_thumb(\.[a-z]+)$/i, '$1');
        }

        if (currentSrc.includes('pixhost.to')) {
            return currentSrc.replace('pixhost.to/thumbs/', 'pixhost.to/images/');
        }

        if (currentSrc.includes('imgbox.com')) {
            return currentSrc.replace(/thumbs(\d*)\.imgbox\.com/i, 'images$1.imgbox.com').replace('_t.', '_o.');
        }

        if (currentSrc.includes('postimg.cc') || currentSrc.includes('postimg.org')) {
            return currentSrc.replace('/thumb/', '/').replace(/_thumb\./i, '.');
        }

        if (/\/thumbs?\//i.test(currentSrc)) {
            return currentSrc.replace(/\/thumbs?\//i, '/');
        }

        const dUrl = img.dataset.url || img.dataset.src || '';
        if (dUrl && /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(dUrl)) {
            return dUrl.replace(/\/thumbs?\//i, '/');
        }

        const wrapper = img.closest('.bbImageWrapper, .js-lbImage, [data-src]');
        if (wrapper) {
            const wrapSrc = wrapper.getAttribute('data-src') || wrapper.getAttribute('data-url') || '';
            if (wrapSrc && /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(wrapSrc)) {
                return wrapSrc.replace(/\/thumbs?\//i, '/');
            }
        }

        return currentSrc || img.src || null;
    }

    // Прямая замена превью на полноразмерный HD оригинал
    function setDirectHd(img) {
        const fullUrl = resolveFullHdUrl(img);
        if (!fullUrl) return;

        if (img.dataset.f95LoadedHd === fullUrl && img.src === fullUrl) return;

        const originalSrc = img.currentSrc || img.src;
        img.onerror = function() {
            if (originalSrc && img.src !== originalSrc) {
                img.src = originalSrc;
            }
        };

        img.removeAttribute('srcset');
        img.removeAttribute('loading');
        img.removeAttribute('width');
        img.removeAttribute('height');

        img.src = fullUrl;
        img.setAttribute('src', fullUrl);
        img.dataset.f95LoadedHd = fullUrl;
        img.dataset.src = fullUrl;
        img.dataset.url = fullUrl;
    }

    function getWrapper(img) {
        const a = img.closest('a');
        if (a && a.closest('.message-body')) return a;
        const wrap = img.closest('.bbImageWrapper, .js-lbImage');
        if (wrap && wrap.closest('.message-body')) return wrap;
        return img;
    }

    let hiddenTabNodes = [];

    function updateHiddenTabs(hide) {
        hiddenTabNodes.forEach(item => {
            if (item.element) item.element.style.display = hide ? 'none' : '';
            if (item.textNode) item.textNode.textContent = hide ? '' : item.originalText;
        });
    }

    function scanTabs(firstPost) {
        const removeRegex = /install|установк|changelog|список измен/i;

        firstPost.querySelectorAll('.bbCodeSpoiler').forEach(sp => {
            const btn = sp.querySelector('.bbCodeSpoiler-button');
            const btnText = (btn ? btn.textContent : '').toLowerCase();

            let targetNodes = [];
            let isTarget = removeRegex.test(btnText);

            let prev = sp.previousSibling;
            while (prev) {
                const text = (prev.textContent || '').trim().toLowerCase();
                if (text === ':' || text === '' || removeRegex.test(text)) {
                    if (prev.nodeType === Node.ELEMENT_NODE) {
                        targetNodes.push({ element: prev });
                    } else if (prev.nodeType === Node.TEXT_NODE) {
                        targetNodes.push({ textNode: prev, originalText: prev.textContent });
                    }
                    if (removeRegex.test(text)) isTarget = true;
                    prev = prev.previousSibling;
                } else {
                    break;
                }
            }

            if (isTarget) {
                hiddenTabNodes.push({ element: sp });
                hiddenTabNodes.push(...targetNodes);
            }
        });

        updateHiddenTabs(getVal(KEY_HIDE_INFO, true));
    }

    // --- 11. Очистка Mac, Android и отдельного Linux; дубликат Windows под скриншотами ---
    function classifyPlatform(txt) {
        if (!txt) return null;
        const clean = txt.replace(/^[\s\u200B\uFEFF\u00A0•\-\*\>|–—🗙⚙☁🅼\:\/]+/, '').trim();
        if (!clean) return null;

        // 1. Mac
        if (/^(mac|macintosh|osx)(\s*\([^)]*\))?(\s*[:\-–—]|\s*$)/i.test(clean) && !/win/i.test(clean)) {
            return 'mac';
        }
        // 2. Android / APK
        if (/^(android|apk)(\s*\([^)]*\))?(\s*[:\-–—]|\s*$)/i.test(clean)) {
            return 'android';
        }
        // 3. Объединенный Windows/Linux в одну строку (оставляем)
        if (/^(win(dows)?\s*[\/\\]\s*lin(ux)?|pc\s*[\/\\]\s*lin(ux)?)(\s*\([^)]*\))?(\s*[:\-–—]|\s*$)/i.test(clean)) {
            return 'win_linux';
        }
        // 4. Отдельный Linux (удаляем)
        if (/^(linux|lin)(\s*\([^)]*\))?(\s*[:\-–—]|\s*$)/i.test(clean)) {
            return 'linux';
        }
        // 5. Windows / PC (оставляем и дублируем)
        if (/^(win|windows|pc)(\s*\([^)]*\))?(\s*[:\-–—]|\s*$)/i.test(clean)) {
            return 'win';
        }

        return null;
    }

    function isScreenshotOrMediaBreak(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
        if (el.classList.contains('bbImageWrapper') || el.classList.contains('js-lbImage') || el.classList.contains('f95-ss-item')) return true;
        const imgs = el.querySelectorAll ? el.querySelectorAll('img') : [];
        for (const img of imgs) {
            if (!img.classList.contains('smilie') && !img.closest('a')) {
                return true;
            }
        }
        return false;
    }

    function cleanAndDuplicateDownloads(firstPost, targetAfterScreenshots) {
        let target = targetAfterScreenshots;
        if (!target) {
            const allSpoilers = firstPost.querySelectorAll('.bbCodeSpoiler');
            for (const sp of allSpoilers) {
                const text = (sp.textContent || '').toLowerCase();
                if (/screen|скрин|preview|art|cg|pic/i.test(text)) {
                    target = sp;
                    break;
                }
            }
        }

        // =========================================================
        // ШАГ 1: Полное и гарантированное удаление строк Mac, Android и отдельного Linux
        // =========================================================
        const walker = document.createTreeWalker(firstPost, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
        const candidates = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentElement && node.parentElement.closest('.f95-win-duplicate-box')) continue;

            let txt = '';
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (/^(b|strong|span|font|u|i|em)$/i.test(node.tagName)) {
                    txt = (node.textContent || '').trim();
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                txt = (node.textContent || '').trim();
            }

            if (!txt) continue;
            const pType = classifyPlatform(txt);
            if (pType) {
                candidates.push({ node, pType });
            }
        }

        const handledRemove = new Set();

        candidates.forEach(({ node, pType }) => {
            if (pType !== 'mac' && pType !== 'android' && pType !== 'linux') return;
            if (handledRemove.has(node) || !node.parentNode) return;

            // Если элемент внутри списка <li>
            const li = node.closest ? node.closest('li') : (node.parentElement ? node.parentElement.closest('li') : null);
            if (li && li.parentNode) {
                const liHasLinks = !!(li.querySelector('a') || li.tagName.toLowerCase() === 'a');
                if (liHasLinks) {
                    handledRemove.add(li);
                    li.parentNode.removeChild(li);
                }
                return;
            }

            let startNode = node;
            while (startNode.parentElement && startNode.parentElement !== firstPost &&
                   !startNode.parentElement.classList.contains('bbWrapper') &&
                   !startNode.parentElement.classList.contains('bbCodeSpoiler-content') &&
                   startNode.parentElement.tagName.toLowerCase() !== 'center' &&
                   startNode.parentElement.tagName.toLowerCase() !== 'div' &&
                   startNode.parentElement.tagName.toLowerCase() !== 'p' &&
                   !startNode.parentElement.querySelector('br')) {
                startNode = startNode.parentElement;
            }

            const container = startNode.parentElement || firstPost;
            const toDelete = [];
            let curr = startNode;

            while (curr && curr.parentNode === container) {
                toDelete.push(curr);
                handledRemove.add(curr);
                if (curr.querySelectorAll) curr.querySelectorAll('*').forEach(c => handledRemove.add(c));

                if (curr.nodeType === Node.ELEMENT_NODE && curr.tagName.toLowerCase() === 'br') {
                    break;
                }

                const next = curr.nextSibling;
                if (!next) break;

                if (next.nodeType === Node.ELEMENT_NODE) {
                    const tag = next.tagName.toLowerCase();
                    if (/^(div|p|ul|ol|li|blockquote|hr|table|center)$/i.test(tag) ||
                        next.classList.contains('bbCodeSpoiler') ||
                        next.classList.contains('bbImageWrapper') ||
                        next.classList.contains('js-lbImage') ||
                        next.classList.contains('f95-ss-item')) {
                        break;
                    }
                }

                const nextClean = (next.textContent || '').replace(/^[\s\u200B\uFEFF\u00A0•\-\*\>|–—🗙⚙☁🅼\:\/]+/, '').trim();
                const nextType = classifyPlatform(nextClean);
                if (nextType && next !== startNode) {
                    break;
                }

                curr = next;
            }

            const hasLinks = toDelete.some(n => n.nodeType === Node.ELEMENT_NODE && (n.tagName.toLowerCase() === 'a' || n.querySelector('a')));
            if (!hasLinks) return;

            const lastNode = toDelete[toDelete.length - 1];
            if (lastNode && lastNode.nextSibling && lastNode.nextSibling.nodeType === Node.ELEMENT_NODE && lastNode.nextSibling.tagName.toLowerCase() === 'br') {
                lastNode.nextSibling.remove();
            }

            toDelete.forEach(n => {
                if (n && n.parentNode) n.parentNode.removeChild(n);
            });
        });

        // =========================================================
        // ШАГ 2: Сбор строк Windows и проверка дублирования под скриншотами
        // =========================================================
        const hasDupBox = !!firstPost.querySelector('.f95-win-duplicate-box');
        let hasWinAfterScreenshots = false;
        const winLines = [];
        const handledWin = new Set();

        candidates.forEach(({ node, pType }) => {
            if (pType !== 'win' && pType !== 'win_linux') return;
            if (handledWin.has(node) || !node.parentNode) return;

            const li = node.closest ? node.closest('li') : (node.parentElement ? node.parentElement.closest('li') : null);
            if (li && li.parentNode) {
                const liHasLinks = !!(li.querySelector('a') || li.tagName.toLowerCase() === 'a');
                if (!liHasLinks) return;
                handledWin.add(li);
                if (target) {
                    try {
                        if (target.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING) {
                            hasWinAfterScreenshots = true;
                        }
                    } catch (e) {}
                }
                if (!hasDupBox) {
                    const clone = li.cloneNode(true);
                    const sig = clone.textContent.trim();
                    if (!winLines.some(existing => existing.map(n => n.textContent || '').join('').trim() === sig)) {
                        winLines.push([clone]);
                    }
                }
                return;
            }

            let startNode = node;
            while (startNode.parentElement && startNode.parentElement !== firstPost &&
                   !startNode.parentElement.classList.contains('bbWrapper') &&
                   !startNode.parentElement.classList.contains('bbCodeSpoiler-content') &&
                   startNode.parentElement.tagName.toLowerCase() !== 'center' &&
                   startNode.parentElement.tagName.toLowerCase() !== 'div' &&
                   startNode.parentElement.tagName.toLowerCase() !== 'p' &&
                   !startNode.parentElement.querySelector('br')) {
                startNode = startNode.parentElement;
            }

            const container = startNode.parentElement || firstPost;
            const lineNodes = [];
            let curr = startNode;

            while (curr && curr.parentNode === container) {
                lineNodes.push(curr);
                handledWin.add(curr);
                if (curr.querySelectorAll) curr.querySelectorAll('*').forEach(c => handledWin.add(c));

                if (curr.nodeType === Node.ELEMENT_NODE && curr.tagName.toLowerCase() === 'br') {
                    break;
                }

                const next = curr.nextSibling;
                if (!next) break;

                if (next.nodeType === Node.ELEMENT_NODE) {
                    const tag = next.tagName.toLowerCase();
                    if (/^(div|p|ul|ol|li|blockquote|hr|table|center)$/i.test(tag) ||
                        next.classList.contains('bbCodeSpoiler') ||
                        next.classList.contains('bbImageWrapper') ||
                        next.classList.contains('js-lbImage') ||
                        next.classList.contains('f95-ss-item')) {
                        break;
                    }
                }

                const nextClean = (next.textContent || '').replace(/^[\s\u200B\uFEFF\u00A0•\-\*\>|–—🗙⚙☁🅼\:\/]+/, '').trim();
                const nextType = classifyPlatform(nextClean);
                if (nextType && next !== startNode) {
                    break;
                }

                curr = next;
            }

            const hasLinks = lineNodes.some(n => n.nodeType === Node.ELEMENT_NODE && (n.tagName.toLowerCase() === 'a' || n.querySelector('a')));
            if (!hasLinks) return;

            if (target) {
                try {
                    if (target.compareDocumentPosition(startNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
                        hasWinAfterScreenshots = true;
                    }
                } catch (e) {}
            }

            if (!hasDupBox) {
                const lineSig = lineNodes.map(n => n.textContent || '').join('').trim();
                const alreadyExists = winLines.some(existing => existing.map(n => n.textContent || '').join('').trim() === lineSig);
                if (!alreadyExists) {
                    const clones = lineNodes
                        .filter(n => !(n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'br'))
                        .map(n => {
                            const cl = n.cloneNode(true);
                            if (cl.querySelectorAll) {
                                cl.querySelectorAll('.bbCodeSpoiler, .bbImageWrapper, .js-lbImage, .f95-ss-item').forEach(el => el.remove());
                            }
                            return cl;
                        });
                    winLines.push(clones);
                }
            }
        });

        // =========================================================
        // ШАГ 3: Управление дубликатом под скриншотами
        // =========================================================
        if (hasWinAfterScreenshots) {
            const oldDup = firstPost.querySelector('.f95-win-duplicate-box');
            if (oldDup) oldDup.remove();
        } else if (winLines.length > 0 && target && !hasDupBox) {
            insertDuplicateDownloads(winLines, target);
        }
    }

    function insertDuplicateDownloads(winLines, targetAfterScreenshots) {
        if (document.querySelector('.f95-win-duplicate-box')) return;
        if (!targetAfterScreenshots || !targetAfterScreenshots.parentNode) return;

        const dupBox = document.createElement('div');
        dupBox.className = 'f95-win-duplicate-box';

        winLines.forEach(lineClones => {
            const row = document.createElement('div');
            row.className = 'f95-win-dup-row';
            lineClones.forEach(n => {
                if (n.nodeType === Node.ELEMENT_NODE) n.style.display = '';
                row.appendChild(n);
            });
            dupBox.appendChild(row);
        });

        targetAfterScreenshots.parentNode.insertBefore(dupBox, targetAfterScreenshots.nextSibling);
    }

    // --- 12. Обработка темы ---
    function processThreadPage() {
        const firstPost = document.querySelector('.message--post:first-of-type, article.message:first-of-type, .block--messages article.message');
        if (!firstPost) return;

        scanTabs(firstPost);
        insertTopNavControls();

        const allImgs = Array.from(firstPost.querySelectorAll('.message-body img')).filter(img => {
            if (img.classList.contains('avatar') || img.classList.contains('reaction-sprite') || img.classList.contains('smilie') ||
                img.closest('.message-cell--user') || img.closest('.reactionsBar') || img.closest('.f95-win-duplicate-box')) return false;
            return true;
        });

        let targetAfterScreenshots = null;

        if (allImgs.length > 0) {
            let bannerImg = null;
            let screenshots = [];

            if (allImgs.length >= 2) {
                bannerImg = allImgs[0];
                screenshots = allImgs.slice(1);
            } else {
                bannerImg = allImgs[0];
            }

            // Баннер
            if (bannerImg && !bannerImg.dataset.f95BannerHandled) {
                const bannerBox = getWrapper(bannerImg);
                bannerBox.classList.add('f95-banner-top-right');
                setDirectHd(bannerImg);

                const bodyWrapper = firstPost.querySelector('.message-body .bbWrapper') || firstPost.querySelector('.message-body');
                const walker = document.createTreeWalker(bodyWrapper, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
                let threadUpdatedNode = null;

                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    const txt = (node.textContent || '').trim();
                    if (/^Thread Updated/i.test(txt) || /^Release Date/i.test(txt)) {
                        let p = node;
                        while (p.parentNode && !p.parentNode.classList.contains('bbWrapper') && p.parentNode !== firstPost) {
                            p = p.parentNode;
                        }
                        threadUpdatedNode = p;
                        break;
                    }
                }

                if (threadUpdatedNode && threadUpdatedNode.parentNode) {
                    threadUpdatedNode.parentNode.insertBefore(bannerBox, threadUpdatedNode);
                }
                bannerImg.dataset.f95BannerHandled = 'true';
            }

            // Скриншоты
            if (screenshots.length > 0) {
                firstPost.querySelectorAll('.bbCodeSpoiler').forEach(sp => {
                    const btn = sp.querySelector('.bbCodeSpoiler-button');
                    const text = (btn ? btn.textContent : '').toLowerCase();
                    const content = sp.querySelector('.bbCodeSpoiler-content');
                    if (/screen|скрин|preview|art|cg|pic/i.test(text) || (content && content.querySelectorAll('img').length >= 2)) {
                        if (btn && (!sp.classList.contains('is-open') || window.getComputedStyle(content).display === 'none')) {
                            btn.click();
                            setTimeout(() => { if (content) content.style.display = 'block'; sp.classList.add('is-open'); }, 50);
                        }
                    }
                });

                screenshots.forEach(img => {
                    const box = getWrapper(img);
                    box.classList.add('f95-ss-item');

                    // Прямая подстановка полноразмерного HD URL
                    setDirectHd(img);

                    // Полноэкранный просмотр по клику (с перехватом useCapture)
                    if (!box.dataset.f95ClickAttached) {
                        box.dataset.f95ClickAttached = 'true';
                        box.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const hd = resolveFullHdUrl(img) || img.currentSrc || img.src;
                            const fallback = img.currentSrc || img.src;
                            openLightbox(hd, fallback);
                        }, true);
                    }
                });

                const firstScreenshotBox = getWrapper(screenshots[0]);
                insertBottomSlider(firstScreenshotBox);

                const lastScreenshotBox = getWrapper(screenshots[screenshots.length - 1]);
                const spoiler = lastScreenshotBox.closest('.bbCodeSpoiler');
                targetAfterScreenshots = spoiler || lastScreenshotBox;
            }
        }

        cleanAndDuplicateDownloads(firstPost, targetAfterScreenshots);
    }

    // Верхняя панель: ползунок баннера с замочком
    function insertTopNavControls() {
        if (document.querySelector('.f95-top-nav-controls')) return;

        const nextBtn = document.querySelector('.pageNav-jump--next, .pageNav-jump') || document.querySelector('.pageNav');
        const targetContainer = nextBtn ? (nextBtn.parentNode || nextBtn) : document.querySelector('.p-body-header, .block-outer');
        if (!targetContainer) return;

        const curBannerW = getVal(KEY_BANNER_WIDTH, DEF_BANNER_WIDTH);
        let isBannerLocked = getVal(KEY_LOCK_BANNER, false);

        const wrap = document.createElement('span');
        wrap.className = 'f95-top-nav-controls';
        wrap.innerHTML = `
            <div class="f95-slider-box">
                <input type="range" class="f95-clean-slider" id="f95-banner-slider" min="300" max="1800" step="15" value="${curBannerW}" title="Размер баннера" style="${isBannerLocked ? 'display: none !important;' : ''}">
                <button type="button" class="f95-lock-btn" id="f95-lock-banner" title="${isBannerLocked ? 'Разблокировать ползунок' : 'Заблокировать ползунок'}">${isBannerLocked ? '🔒' : '🔓'}</button>
            </div>
            <button type="button" class="f95-info-btn" id="f95-info-toggle">Info off/on</button>
        `;

        if (nextBtn && nextBtn.nextSibling) nextBtn.parentNode.insertBefore(wrap, nextBtn.nextSibling);
        else targetContainer.appendChild(wrap);

        const slider = wrap.querySelector('#f95-banner-slider');
        const lockBtn = wrap.querySelector('#f95-lock-banner');

        slider.addEventListener('input', (e) => {
            const w = parseInt(e.target.value, 10);
            document.documentElement.style.setProperty('--f95-banner-w', `${w}px`);
        });
        slider.addEventListener('change', (e) => {
            const w = parseInt(e.target.value, 10);
            document.documentElement.style.setProperty('--f95-banner-w', `${w}px`);
            setVal(KEY_BANNER_WIDTH, w);
        });

        lockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isBannerLocked = !isBannerLocked;
            setVal(KEY_LOCK_BANNER, isBannerLocked);
            slider.style.setProperty('display', isBannerLocked ? 'none' : 'inline-block', 'important');
            lockBtn.textContent = isBannerLocked ? '🔒' : '🔓';
            lockBtn.title = isBannerLocked ? 'Разблокировать ползунок' : 'Заблокировать ползунок';
        });

        const btn = wrap.querySelector('#f95-info-toggle');
        btn.addEventListener('click', () => {
            const newState = !getVal(KEY_HIDE_INFO, true);
            setVal(KEY_HIDE_INFO, newState);
            updateHiddenTabs(newState);
        });
    }

    // Ползунок скриншотов с замочком
    function insertBottomSlider(firstScreenshotBox) {
        if (document.querySelector('.f95-bottom-slider-wrap')) return;

        const curSS = getVal(KEY_SS_WIDTH, DEF_SS_WIDTH);
        let isSSLocked = getVal(KEY_LOCK_SS, false);

        const div = document.createElement('div');
        div.className = 'f95-bottom-slider-wrap';
        div.innerHTML = `
            <div class="f95-slider-box">
                <input type="range" class="f95-clean-slider" id="f95-ss-slider" min="250" max="1200" step="10" value="${curSS}" title="Размер скриншотов" style="${isSSLocked ? 'display: none !important;' : ''}">
                <button type="button" class="f95-lock-btn" id="f95-lock-ss" title="${isSSLocked ? 'Разблокировать ползунок' : 'Заблокировать ползунок'}">${isSSLocked ? '🔒' : '🔓'}</button>
            </div>
        `;

        firstScreenshotBox.parentNode.insertBefore(div, firstScreenshotBox);

        const slider = div.querySelector('#f95-ss-slider');
        const lockBtn = div.querySelector('#f95-lock-ss');

        slider.addEventListener('input', (e) => {
            const w = parseInt(e.target.value, 10);
            document.documentElement.style.setProperty('--f95-ss-w', `${w}px`);
        });
        slider.addEventListener('change', (e) => {
            const w = parseInt(e.target.value, 10);
            document.documentElement.style.setProperty('--f95-ss-w', `${w}px`);
            setVal(KEY_SS_WIDTH, w);
        });

        lockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isSSLocked = !isSSLocked;
            setVal(KEY_LOCK_SS, isSSLocked);
            slider.style.setProperty('display', isSSLocked ? 'none' : 'inline-block', 'important');
            lockBtn.textContent = isSSLocked ? '🔒' : '🔓';
            lockBtn.title = isSSLocked ? 'Разблокировать ползунок' : 'Заблокировать ползунок';
        });
    }

    // --- 13. Запуск и наблюдение ---
    function run() {
        purgeAllNotices();
        insertTgsBrandGroup();
        if (window.location.href.includes('/latest_alpha')) {
            const data = findGridAndCards();
            if (data) {
                adjustAlphaLayout(data);
                setupAlphaControls(data.gridContainer);
                data.cards.forEach(processCardStats);
            }
        } else if (window.location.href.includes('/threads/')) {
            processThreadPage();
        }
    }

    const observer = new MutationObserver(() => {
        run();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        run();
    } else {
        document.addEventListener('DOMContentLoaded', run);
    }

    setInterval(run, 600);

})();
