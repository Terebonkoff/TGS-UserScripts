// ==UserScript==
// @name         RuTracker: Enhanced Suite by TGS
// @name:ru      RuTracker: Enhanced Suite by TGS
// @name:en      RuTracker: Enhanced Suite by TGS
// @namespace    https://rutracker.org/
// @version      5.4.0
// @description  Единый мощный комплекс для RuTracker: встроенные превью и кнопка скачивания в списке раздач, идеальные колонки (Форум с ресайзером, компактный Автор ~3 см), боковое окно предпросмотра при наведении, единый тулбар в раздачах, полноразмерные скриншоты FastPic/IBB без мыла и полноэкранный Lightbox.
// @description:en All-in-one suite for RuTracker: inline previews & download button in torrent lists, perfect column layout, right-dock hover screenshot preview, single toolbar in topics, full-size FastPic/IBB screenshots & Lightbox.
// @author       Terebonkoff (TGS)
// @icon         https://purepng.com/public/uploads/thumbnail//sexy-little-caprice-in-white-dress-zly.png
// @match        *://rutracker.org/*
// @match        *://*.rutracker.org/*
// @match        *://rutracker.net/*
// @match        *://*.rutracker.net/*
// @match        *://rutracker.nl/*
// @match        *://*.rutracker.nl/*
// @match        *://rutracker.me/*
// @match        *://*.rutracker.me/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      rutracker.org
// @connect      rutracker.net
// @connect      rutracker.nl
// @connect      rutracker.me
// @connect      directupload.eu
// @connect      directupload.net
// @connect      fastpic.org
// @connect      fastpic.ru
// @connect      fastpic.pro
// @connect      fastpic.live
// @connect      imageban.ru
// @connect      ibb.co
// @connect      i.ibb.co
// @connect      pixhost.to
// @connect      postimg.cc
// @connect      imgbox.com
// @connect      imagebam.com
// @connect      turboimagehost.com
// @connect      imagevenue.com
// @connect      lostpix.com
// @connect      imx.to
// @connect      imagetwist.com
// @connect      hosturimage.com
// @connect      vppload.com
// @connect      pic4you.ru
// @connect      pic4share.ru
// @connect      piccash.ru
// @connect      vipr.im
// @connect      extraimage.info
// @connect      extraimage.net
// @connect      fappic.com
// @connect      imgclick.ru
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* =========================================================================
     * 1. КОНФИГУРАЦИЯ И МУЛЬТИЯЗЫЧНОСТЬ
     * ========================================================================= */
    const savedLang = GM_getValue('lang', 'ru');
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : (navigator.language.startsWith('ru') ? 'ru' : 'en');
    const lang = savedLang === 'auto' ? browserLang : (savedLang || 'ru');

    let shortcut = GM_getValue('shortcut', 'ctrl+p');
    const savedImgSize = GM_getValue('imgSize', '200'); // Высота встроенных превью: 150, 200, 300, 500
    const openInNewTab = GM_getValue('openInNewTab', true);
    const showInlinePreviews = GM_getValue('showInlinePreviews', true);

    const t = {
        ru: {
            settings: '⚙️ Настройки RuTracker Suite',
            language: 'Язык / Language',
            shortcutSettings: 'Горячая клавиша настроек',
            imgSizeSettings: 'Размер встроенных превью в списке',
            inlinePreviewsToggle: 'Показывать встроенные превью в списке раздач',
            linkSettings: 'Настройки ссылок',
            openInNewTab: 'Открывать темы в новой вкладке',
            sizeSmall: 'Маленький (150px)',
            sizeMedium: 'Средний (200px)',
            sizeLarge: 'Большой (300px)',
            sizeOriginal: 'Крупный (500px)',
            clickToSet: 'Нажмите для назначения',
            pressKey: 'Нажмите комбинацию клавиш...',
            close: 'Закрыть',
            saveAndReload: 'Сохранить и обновить',
            downloadTorrent: '💾 Скачать .torrent',
            loadingScreenshots: '⏳ Загрузка скриншотов...',
            noScreenshotsFound: 'Скриншотов в раздаче не найдено',
            screenshotsBadge: 'Скриншоты',
            columnsLabel: 'Колонок:',
            lockBtnText: 'Закрепить',
            lockedBtnText: 'Закреплено',
            viewGallery: '🖼️ Галерея',
            scaleScreenshots: '📐 Скриншоты:',
            scaleScreenlist: '📋 Скринлист:',
            overviewFirst: '⬆ Скринлист первым',
            resetScale: 'Сброс'
        },
        en: {
            settings: '⚙️ RuTracker Suite Settings',
            language: 'Language / 语言',
            shortcutSettings: 'Shortcut Settings',
            imgSizeSettings: 'Inline Preview Image Size',
            inlinePreviewsToggle: 'Show inline preview images in list',
            linkSettings: 'Link Settings',
            openInNewTab: 'Open post links in new tab',
            sizeSmall: 'Small (150px)',
            sizeMedium: 'Medium (200px)',
            sizeLarge: 'Large (300px)',
            sizeOriginal: 'Original (500px)',
            clickToSet: 'Click to Set',
            pressKey: 'Press keys...',
            close: 'Close',
            saveAndReload: 'Save & Reload',
            downloadTorrent: '💾 Download Torrent',
            loadingScreenshots: '⏳ Loading screenshots...',
            noScreenshotsFound: 'No screenshots found in topic',
            screenshotsBadge: 'Screenshots',
            columnsLabel: 'Columns:',
            lockBtnText: 'Lock',
            lockedBtnText: 'Locked',
            viewGallery: '🖼️ Gallery',
            scaleScreenshots: '📐 Screenshots:',
            scaleScreenlist: '📋 Screenlist:',
            overviewFirst: '⬆ Screenlist first',
            resetScale: 'Reset'
        },
        zh: {
            settings: '⚙️ 设置',
            language: '语言 / Language',
            shortcutSettings: '快捷键设置',
            imgSizeSettings: '预览图大小',
            inlinePreviewsToggle: '在列表显示预览图',
            linkSettings: '链接设置',
            openInNewTab: '在新标签页打开帖子链接',
            sizeSmall: '小 (150px)',
            sizeMedium: '中 (200px)',
            sizeLarge: '大 (300px)',
            sizeOriginal: '原图 (500px)',
            clickToSet: '点击设置',
            pressKey: '请按键...',
            close: '关闭',
            saveAndReload: '保存并刷新',
            downloadTorrent: '💾 下载种子',
            loadingScreenshots: '⏳ 正在加载截图...',
            noScreenshotsFound: '未找到截图',
            screenshotsBadge: '截图',
            columnsLabel: '列数:',
            lockBtnText: '锁定',
            lockedBtnText: '已锁定',
            viewGallery: '🖼️ 画廊',
            scaleScreenshots: '📐 截图大小:',
            scaleScreenlist: '📋 概览图:',
            overviewFirst: '⬆ 概览图置顶',
            resetScale: '重置'
        }
    }[lang] || {
        settings: '⚙️ Настройки RuTracker Suite',
        downloadTorrent: '💾 Скачать .torrent'
    };

    /* =========================================================================
     * 2. СОСТОЯНИЕ И КЛЮЧИ ХРАНИЛИЩА
     * ========================================================================= */
    const isTopicPage = window.location.pathname.includes('viewtopic.php');
    const isListPage = !isTopicPage && (
        window.location.pathname.includes('tracker.php') ||
        window.location.pathname.includes('viewforum.php') ||
        window.location.pathname.includes('search.php') ||
        window.location.pathname.includes('bookmarks.php') ||
        window.location.pathname.includes('profile.php')
    );

    const STORAGE_KEY = 'rt_screenshot_scale';
    const STORAGE_SCREENLIST_KEY = 'rt_screenlist_scale';
    const STORAGE_OVERVIEW_KEY = 'rt_overview_first';

    const BASE_MAX_W = 1440;
    const BASE_MAX_H = 810;
    const BASE_SCREENLIST_MAX_W = 1920;
    const BASE_SCREENLIST_MAX_H = 1620;

    const savedForumWidth = localStorage.getItem('rt_forum_col_w') || '220px';
    const savedPreviewCols = localStorage.getItem('rt_pv_cols') || '3';
    const resolvedUrlCache = {};
    const topicDataCache = {};

    /* =========================================================================
     * 3. CSS СТИЛИ
     * ========================================================================= */
    function injectMasterStyles() {
        if (document.getElementById('rt-master-styles')) return;
        const style = document.createElement('style');
        style.id = 'rt-master-styles';
        style.textContent = `
            :root {
                --rt-img-max-w: 1440px;
                --rt-img-max-h: 810px;
                --rt-screenlist-max-w: 1920px;
                --rt-screenlist-max-h: 1620px;
                --rt-forum-col-w: ${savedForumWidth};
                --rt-pv-cols: ${savedPreviewCols};
                --rt-pv-width: 1040px;
                --rt-inline-img-h: ${savedImgSize}px;
            }

            /* -----------------------------------------------------------------
             * ТАБЛИЦА РАЗДАЧ: ИДЕАЛЬНОЕ РАСПРЕДЕЛЕНИЕ ШИРИНЫ КОЛОНОК
             * ----------------------------------------------------------------- */
            #tor-tbl th.rt-forum-col,
            #tor-tbl td.rt-forum-col,
            table.forumline th.rt-forum-col,
            table.forumline td.rt-forum-col,
            .vf-table th.rt-forum-col,
            .vf-table td.rt-forum-col {
                width: var(--rt-forum-col-w, 220px) !important;
                max-width: var(--rt-forum-col-w, 220px) !important;
                min-width: 130px !important;
                padding: 8px 10px !important;
                box-sizing: border-box !important;
                font-size: 12px !important;
                line-height: 1.4 !important;
                position: relative !important;
                vertical-align: middle !important;
            }

            #tor-tbl td.rt-forum-col a,
            table.forumline td.rt-forum-col a,
            .vf-table td.rt-forum-col a {
                display: inline !important;
                white-space: normal !important;
                word-break: normal !important;
                overflow-wrap: break-word !important;
                color: #9cb0cc !important;
                text-decoration: none !important;
            }
            #tor-tbl td.rt-forum-col a:hover {
                color: #58a6ff !important;
                text-decoration: underline !important;
            }

            .rt-col-resizer {
                position: absolute !important;
                right: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
                width: 7px !important;
                cursor: col-resize !important;
                background: rgba(255, 255, 255, 0.15) !important;
                user-select: none !important;
                z-index: 10 !important;
                transition: background 0.15s ease !important;
            }
            .rt-col-resizer:hover, .rt-col-resizer.is-resizing {
                background: #388bfd !important;
            }

            /* Колонка ТЕМА: занимает всё свободное пространство таблицы */
            #tor-tbl th.rt-topic-col,
            #tor-tbl td.rt-topic-col,
            #tor-tbl td.t-title,
            td.t-title,
            td.row4.tLeft,
            td.tt {
                width: auto !important;
                box-sizing: border-box !important;
            }

            /* Колонка АВТОР: строго компактная ~3 см (105-115px) */
            #tor-tbl th.rt-author-col,
            #tor-tbl td.rt-author-col,
            #tor-tbl td.u-name,
            #tor-tbl td.author,
            th.rt-author-col,
            td.rt-author-col {
                width: 110px !important;
                max-width: 120px !important;
                min-width: 95px !important;
                text-align: center !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                box-sizing: border-box !important;
            }

            /* Колонка РАЗМЕР: аккуратная */
            #tor-tbl td.tor-size,
            #tor-tbl th.tor-size {
                width: 80px !important;
                white-space: nowrap !important;
                text-align: center !important;
            }

            /* Стандартная дискетка */
            a[href*="dl.php?t="] img,
            .attach_link img,
            .dl-stub img {
                max-width: 38px !important;
                max-height: 38px !important;
                width: auto !important;
                height: auto !important;
                transform: scale(0.7) !important;
                vertical-align: middle !important;
            }

            /* -----------------------------------------------------------------
             * ВСТРОЕННЫЕ ПРЕВЬЮ И КНОПКА СКАЧИВАНИЯ В СПИСКЕ РАЗДАЧ
             * ----------------------------------------------------------------- */
            .pl-inline-wrap {
                margin-top: 8px !important;
                margin-bottom: 6px !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 7px !important;
            }
            .pl-inline-dl-row {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .pl-inline-dl-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 3px 10px !important;
                border-radius: 6px !important;
                background: linear-gradient(135deg, #2b5278 0%, #1f3e5c 100%) !important;
                color: #ffffff !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                text-decoration: none !important;
                cursor: pointer !important;
                transition: transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
                border: 1px solid #486581 !important;
                width: fit-content !important;
            }
            .pl-inline-dl-btn:hover {
                background: linear-gradient(135deg, #386799 0%, #294e73 100%) !important;
                transform: translateY(-1px) !important;
                color: #ffffff !important;
                text-decoration: none !important;
                box-shadow: 0 4px 10px rgba(56, 139, 253, 0.4) !important;
            }
            .pl-inline-imgs-container {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 8px !important;
                overflow: hidden !important;
                max-width: 100% !important;
                padding: 4px 0 !important;
            }
            .pl-inline-thumb {
                max-height: var(--rt-inline-img-h, 200px) !important;
                height: auto !important;
                width: auto !important;
                object-fit: contain !important;
                display: block !important;
                cursor: zoom-in !important;
                border-radius: 5px !important;
                border: 1px solid #30363d !important;
                background: #111419 !important;
                transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease !important;
            }
            .pl-inline-thumb:hover {
                transform: scale(1.03) !important;
                border-color: #58a6ff !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;
                z-index: 5 !important;
            }

            /* -----------------------------------------------------------------
             * ЕДИНАЯ СТРОЧКА ТУЛБАРА В РАЗДАЧАХ (СТРОГО ОДНА)
             * ----------------------------------------------------------------- */
            .rt-toolbar {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                flex-wrap: wrap !important;
                gap: 12px !important;
                background: #1e2329 !important;
                border: 1px solid #363c48 !important;
                border-radius: 8px !important;
                padding: 10px 16px !important;
                margin: 14px 0 10px 0 !important;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                box-sizing: border-box !important;
                color: #c9d1d9 !important;
            }
            .rt-toolbar-left, .rt-toolbar-right {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                flex-wrap: wrap !important;
            }
            .rt-torrent-dl-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 10px !important;
                background: linear-gradient(135deg, #2b5278 0%, #1f3e5c 100%) !important;
                color: #ffffff !important;
                text-decoration: none !important;
                padding: 6px 14px !important;
                border-radius: 6px !important;
                font-weight: bold !important;
                border: 1px solid #486581 !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
                transition: background 0.15s ease, transform 0.1s ease !important;
            }
            .rt-torrent-dl-btn:hover {
                background: linear-gradient(135deg, #386799 0%, #294e73 100%) !important;
                transform: translateY(-1px) !important;
                color: #fff !important;
                text-decoration: none !important;
            }
            .rt-floppy-icon {
                flex-shrink: 0;
            }
            .rt-torrent-dl-text {
                display: flex;
                flex-direction: column;
                line-height: 1.15;
            }
            .rt-torrent-dl-main {
                font-size: 13px;
                letter-spacing: 0.3px;
            }
            .rt-torrent-dl-sub {
                font-size: 10px;
                color: #9cb0cc;
                font-weight: normal;
            }
            .rt-scale-box {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                background: #14181d !important;
                border: 1px solid #2d333b !important;
                border-radius: 6px !important;
                padding: 4px 10px !important;
                font-size: 12px !important;
            }
            .rt-scale-label {
                color: #8b949e !important;
                white-space: nowrap !important;
            }
            .rt-scale-slider {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 90px !important;
                height: 6px !important;
                border-radius: 3px !important;
                background: #30363d !important;
                outline: none !important;
                cursor: pointer !important;
            }
            .rt-scale-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 14px !important;
                height: 14px !important;
                border-radius: 50% !important;
                background: #58a6ff !important;
                cursor: pointer !important;
            }
            .rt-scale-badge {
                min-width: 34px !important;
                text-align: right !important;
                font-weight: bold !important;
                color: #58a6ff !important;
                font-variant-numeric: tabular-nums !important;
            }
            .rt-btn {
                background: #21262d !important;
                color: #c9d1d9 !important;
                border: 1px solid #363c48 !important;
                border-radius: 6px !important;
                padding: 5px 10px !important;
                font-size: 12px !important;
                cursor: pointer !important;
                transition: all 0.15s ease !important;
            }
            .rt-btn:hover {
                background: #30363d !important;
                border-color: #8b949e !important;
            }
            .rt-scale-reset {
                padding: 2px 6px !important;
                font-size: 11px !important;
            }

            /* -----------------------------------------------------------------
             * СЕТКА СКРИНШОТОВ В ТЕМЕ
             * ----------------------------------------------------------------- */
            .rt-screenshots-grid {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 14px !important;
                align-items: flex-start !important;
                margin: 12px 0 !important;
                min-height: 40px !important;
            }
            .rt-screenshots-grid a, .rt-screenshots-grid img {
                max-width: var(--rt-img-max-w, 1440px) !important;
                max-height: var(--rt-img-max-h, 810px) !important;
                width: auto !important;
                height: auto !important;
                object-fit: contain !important;
                border-radius: 4px !important;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45) !important;
            }
            .rt-screenlist a img, a.rt-screenlist img {
                max-width: var(--rt-screenlist-max-w, 1920px) !important;
                max-height: var(--rt-screenlist-max-h, 1620px) !important;
                width: auto !important;
                height: auto !important;
                object-fit: contain !important;
            }

            /* -----------------------------------------------------------------
             * ОКНО ПРЕДПРОСМОТРА СКРИНШОТОВ (СПРАВА НАЛЕВО)
             * ----------------------------------------------------------------- */
            #torrent-preview {
                position: fixed !important;
                right: 15px !important;
                left: auto !important;
                width: var(--rt-pv-width, 1040px) !important;
                max-width: calc(100vw - 30px) !important;
                max-height: calc(100vh - 30px) !important;
                box-sizing: border-box !important;
                background: #161a20 !important;
                border: 1px solid #363c48 !important;
                border-radius: 10px !important;
                padding: 14px 16px !important;
                z-index: 999999 !important;
                box-shadow: 0 16px 50px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                color: #c9d1d9 !important;
                display: flex !important;
                flex-direction: column !important;
                opacity: 0;
                transform: translateX(12px) scale(0.98);
                transition: opacity 0.18s ease-out, transform 0.18s ease-out, border-color 0.18s ease !important;
                pointer-events: none;
            }
            #torrent-preview.rt-pv-visible {
                opacity: 1 !important;
                transform: translateX(0) scale(1) !important;
                pointer-events: auto !important;
            }
            #torrent-preview.rt-pv-locked {
                border-color: #f59e0b !important;
                box-shadow: 0 16px 50px rgba(0, 0, 0, 0.95), 0 0 16px rgba(245, 158, 11, 0.35) !important;
            }
            .rt-pv-header {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 12px !important;
                padding-bottom: 10px !important;
                border-bottom: 1px solid #282f3d !important;
                user-select: none !important;
                position: sticky !important;
                top: 0 !important;
                background: #161a20 !important;
                z-index: 10 !important;
            }
            .rt-pv-header-left {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .rt-pv-badge {
                font-size: 13px !important;
                font-weight: 600 !important;
                color: #8b949e !important;
            }
            .rt-pv-badge strong {
                color: #58a6ff !important;
                font-size: 14px !important;
            }
            .rt-pv-header-center {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }
            .rt-pv-scale-box {
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                background: #0f1217 !important;
                padding: 4px 10px !important;
                border-radius: 6px !important;
                border: 1px solid #2a313d !important;
                font-size: 12px !important;
                color: #c9d1d9 !important;
            }
            .rt-pv-scale-label {
                color: #8b949e !important;
                white-space: nowrap !important;
                font-size: 11px !important;
            }
            .rt-pv-cols-slider {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 75px !important;
                height: 5px !important;
                border-radius: 3px !important;
                background: #30363d !important;
                outline: none !important;
                cursor: pointer !important;
            }
            .rt-pv-cols-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 14px !important;
                height: 14px !important;
                border-radius: 50% !important;
                background: #58a6ff !important;
                cursor: pointer !important;
            }
            .rt-pv-cols-val {
                min-width: 12px !important;
                font-weight: bold !important;
                color: #58a6ff !important;
                font-variant-numeric: tabular-nums !important;
            }
            .rt-pv-header-right {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .rt-pv-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 5px !important;
                background: #21262d !important;
                border: 1px solid #363c48 !important;
                color: #c9d1d9 !important;
                padding: 4px 9px !important;
                border-radius: 5px !important;
                font-size: 12px !important;
                cursor: pointer !important;
                transition: all 0.15s ease !important;
            }
            .rt-pv-btn:hover {
                background: #30363d !important;
                border-color: #58a6ff !important;
                color: #ffffff !important;
            }
            .rt-pv-btn.active {
                background: rgba(245, 158, 11, 0.2) !important;
                border-color: #f59e0b !important;
                color: #fbbf24 !important;
            }
            .rt-pv-close-btn {
                background: transparent !important;
                border: none !important;
                color: #8b949e !important;
                font-size: 16px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                padding: 2px 7px !important;
                border-radius: 4px !important;
            }
            .rt-pv-close-btn:hover {
                color: #ff7b72 !important;
                background: rgba(255, 123, 114, 0.15) !important;
            }
            .rt-pv-grid {
                display: grid !important;
                grid-template-columns: repeat(var(--rt-pv-cols, 3), 1fr) !important;
                gap: 9px !important;
                margin-top: 10px !important;
            }
            .rt-pv-thumb-wrap {
                position: relative !important;
                width: 100% !important;
                aspect-ratio: 16 / 9 !important;
                min-height: 160px !important;
                overflow: hidden !important;
                border-radius: 6px !important;
                background: #0d1117 !important;
                border: 1px solid #2a313d !important;
                cursor: pointer !important;
                transition: transform 0.12s ease, border-color 0.12s ease !important;
            }
            .rt-pv-thumb-wrap:hover {
                transform: scale(1.025) !important;
                border-color: #58a6ff !important;
                z-index: 2 !important;
            }
            .rt-pv-thumb-img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                display: block !important;
            }

            /* -----------------------------------------------------------------
             * LIGHTBOX VIEWER
             * ----------------------------------------------------------------- */
            .rt-lightbox {
                position: fixed !important;
                top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
                background: rgba(8, 10, 14, 0.96) !important;
                z-index: 2147483647 !important;
                display: none !important;
                flex-direction: column !important;
                backdrop-filter: blur(8px) !important;
                user-select: none !important;
            }
            .rt-lightbox.active {
                display: flex !important;
            }
            .rt-lb-topbar {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 10px 20px !important;
                background: rgba(18, 22, 28, 0.85) !important;
                border-bottom: 1px solid #282f3d !important;
            }
            .rt-lb-center {
                position: relative !important;
                flex: 1 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                padding: 16px !important;
            }
            .rt-lb-main-img {
                max-width: 96vw !important;
                max-height: calc(100vh - 170px) !important;
                object-fit: contain !important;
                border-radius: 6px !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
            }
            .rt-lb-nav {
                position: absolute !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                background: rgba(22, 27, 34, 0.75) !important;
                color: #ffffff !important;
                border: 1px solid #363c48 !important;
                border-radius: 50% !important;
                width: 48px !important;
                height: 48px !important;
                font-size: 24px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.15s ease !important;
            }
            .rt-lb-nav:hover {
                background: rgba(56, 139, 253, 0.9) !important;
                transform: translateY(-50%) scale(1.1) !important;
            }
            .rt-lb-prev { left: 24px !important; }
            .rt-lb-next { right: 24px !important; }
            .rt-lb-thumbs {
                height: 75px !important;
                background: rgba(18, 22, 28, 0.85) !important;
                border-top: 1px solid #282f3d !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                padding: 8px 16px !important;
                overflow-x: auto !important;
                justify-content: center !important;
            }
            .rt-lb-thumb {
                height: 55px !important;
                width: 90px !important;
                object-fit: cover !important;
                border-radius: 4px !important;
                opacity: 0.5 !important;
                cursor: pointer !important;
                border: 2px solid transparent !important;
                transition: all 0.15s ease !important;
                flex-shrink: 0 !important;
            }
            .rt-lb-thumb.active, .rt-lb-thumb:hover {
                opacity: 1 !important;
                border-color: #58a6ff !important;
                transform: scale(1.05) !important;
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

            /* Старая кнопка Terebonkoff Game Studio */
            .tgs-support-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                width: fit-content !important;
                max-width: fit-content !important;
                flex: 0 0 auto !important;
                box-sizing: border-box !important;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(88, 101, 242, 0.25)) !important;
                border: 1px solid rgba(239, 68, 68, 0.7) !important;
                color: #ffffff !important;
                padding: 4px 11px !important;
                border-radius: 5px !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                line-height: 1.2 !important;
                margin: 2px 10px !important;
                transition: all 0.2s ease !important;
                white-space: nowrap !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45) !important;
                cursor: pointer !important;
                user-select: none !important;
                vertical-align: middle !important;
            }
            .tgs-support-btn:hover {
                background: linear-gradient(135deg, #ef4444, #dc2626) !important;
                border-color: #ef4444 !important;
                color: #ffffff !important;
                box-shadow: 0 0 14px rgba(239, 68, 68, 0.75) !important;
                transform: translateY(-1px) scale(1.02) !important;
            }
            .tgs-heart {
                font-size: 13px !important;
                line-height: 1 !important;
                display: inline-block !important;
                animation: tgs-pulse 2s infinite ease-in-out !important;
            }
            @keyframes tgs-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.22); }
            }
`;
        style.textContent += `
            /* =================================================================
             * TGS BRANDING BAR (Terebonkoff Game Studio / TGS Scripts)
             * ================================================================= */
            .tgs-branding-bar {
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                background: rgba(22, 27, 34, 0.9) !important;
                border: 1px solid #363d4a !important;
                border-radius: 6px !important;
                padding: 3px 10px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45) !important;
                white-space: nowrap !important;
                width: fit-content !important;
                max-width: fit-content !important;
                flex: 0 0 auto !important;
                vertical-align: middle !important;
                user-select: none !important;
                box-sizing: border-box !important;
                margin: 0 8px !important;
            }

            .tgs-title-label {
                display: inline-flex !important;
                align-items: center !important;
                gap: 5px !important;
                font-size: 11px !important;
                color: #f0f6fc !important;
                font-weight: 700 !important;
                letter-spacing: 0.2px !important;
            }

            .tgs-title-label .tgs-logo-icon {
                font-size: 12px !important;
                line-height: 1 !important;
            }

            .tgs-title-label .tgs-sub-tag {
                color: #58a6ff !important;
                font-weight: 600 !important;
                font-size: 11px !important;
            }

            .tgs-actions {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
            }

            .tgs-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 5px !important;
                padding: 2px 8px !important;
                border-radius: 4px !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                line-height: 1.2 !important;
                transition: all 0.2s ease !important;
                cursor: pointer !important;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3) !important;
                white-space: nowrap !important;
            }

            .tgs-btn-patreon {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.28), rgba(225, 29, 72, 0.28)) !important;
                border: 1px solid rgba(239, 68, 68, 0.75) !important;
                color: #ffffff !important;
            }
            .tgs-btn-patreon:hover {
                background: linear-gradient(135deg, #ef4444, #dc2626) !important;
                border-color: #ef4444 !important;
                color: #ffffff !important;
                box-shadow: 0 0 12px rgba(239, 68, 68, 0.75) !important;
                transform: translateY(-1px) !important;
            }

            .tgs-btn-github {
                background: rgba(33, 38, 45, 0.85) !important;
                border: 1px solid #444c56 !important;
                color: #e6edf3 !important;
            }
            .tgs-btn-github:hover {
                background: #238636 !important;
                border-color: #2ea043 !important;
                color: #ffffff !important;
                box-shadow: 0 0 12px rgba(35, 134, 54, 0.7) !important;
                transform: translateY(-1px) !important;
            }

            .tgs-heart {
                font-size: 11px !important;
                line-height: 1 !important;
                display: inline-block !important;
                animation: tgs-pulse 2s infinite ease-in-out !important;
            }
            @keyframes tgs-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.22); }
            }

            /* Удаление назойливых плашек объявлений и донатов */
            .donate, #donate, [class*="donate"], [id*="donate"],
            a[href*="donate"], a[href*="help_us"], .announcement,
            #announcement, .top_warning, .site_alert, .brand-banner,
            #sidebar1, div.warning, div.alert-error, div.alert-warning {
                display: none !important;
            }
`;
        document.head.appendChild(style);
    }

    /* =========================================================================
     * 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И РАЗРЕШЕНИЕ ХОСТИНГОВ
     * ========================================================================= */
    function getSavedScale() {
        return parseInt(localStorage.getItem(STORAGE_KEY) || '80', 10);
    }
    function applyScale(scale) {
        document.documentElement.style.setProperty('--rt-img-max-w', `${Math.round(BASE_MAX_W * (scale / 100))}px`);
        document.documentElement.style.setProperty('--rt-img-max-h', `${Math.round(BASE_MAX_H * (scale / 100))}px`);
    }
    function getSavedScreenlistScale() {
        return parseInt(localStorage.getItem(STORAGE_SCREENLIST_KEY) || '100', 10);
    }
    function applyScreenlistScale(scale) {
        document.documentElement.style.setProperty('--rt-screenlist-max-w', `${Math.round(BASE_SCREENLIST_MAX_W * (scale / 100))}px`);
        document.documentElement.style.setProperty('--rt-screenlist-max-h', `${Math.round(BASE_SCREENLIST_MAX_H * (scale / 100))}px`);
    }
    function getSavedOverviewFirst() {
        return localStorage.getItem(STORAGE_OVERVIEW_KEY) === 'true';
    }

    function getTorrentDownloadInfo() {
        const dlLink = document.querySelector('a[href*="dl.php?t="], a.dl-link, a.attach_link');
        let dlUrl = dlLink ? (dlLink.getAttribute('href') || dlLink.href) : null;
        if (dlUrl && !dlUrl.startsWith('http')) {
            dlUrl = window.location.origin + (dlUrl.startsWith('/') ? '' : '/forum/') + dlUrl;
        }
        let sizeText = '';
        const sizeNode = document.querySelector('#tor-size, .attach_link + .attach-size, .dl-link + span');
        if (sizeNode) sizeText = sizeNode.textContent.trim();
        return { dlUrl, sizeText };
    }

    function fetchPage(url, callback, referer) {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Referer': referer || url
                },
                onload: (res) => callback(res.responseText, res.finalUrl || url),
                onerror: () => callback('', url)
            });
        } else {
            fetch(url).then(r => r.text()).then(html => callback(html, url)).catch(() => callback('', url));
        }
    }

    function extractDirectImageUrl(html) {
        if (!html) return null;

        const cleanUrl = (u) => {
            if (!u) return null;
            let res = u.trim().replace(/&amp;/g, '&');
            res = res.replace(/[?&]dl=1(&|$)/, '$1').replace(/\?$/, '');
            if (res.startsWith('//')) res = window.location.protocol + res;
            return res;
        };

        // 1. FastPic: loading_img со всеми токенами ?md5=...&expires=...
        let m = html.match(/loading_img\s*=\s*['"]([^'"]+)['"]/i);
        if (m && m[1]) return cleanUrl(m[1]);

        m = html.match(/<img[^>]+src=["'](https?:\/\/i\d+\.fastpic\.[a-z]+\/big\/[^"']+)["']/i);
        if (m && m[1]) return cleanUrl(m[1]);

        m = html.match(/(https?:\/\/i\d+\.fastpic\.[a-z]+\/big\/[^"'><\s]+)/i);
        if (m && m[1]) return cleanUrl(m[1]);

        // 2. IBB (ImgBB)
        m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["'](https?:\/\/i\.ibb\.co\/[^"'\s<]+)["']/i);
        if (m && m[1]) return cleanUrl(m[1]);
        m = html.match(/<a[^>]+href=["'](https?:\/\/i\.ibb\.co\/[^"'\s<]+)["']/i);
        if (m && m[1]) return cleanUrl(m[1]);
        m = html.match(/(https?:\/\/i\.ibb\.co\/[^"'\s<]+)/i);
        if (m && m[1]) return cleanUrl(m[1]);

        // 3. ImageBan
        m = html.match(/(https?:\/\/i\d*\.imageban\.ru\/out\/[^"'><\s]+)/i);
        if (m && m[1]) return cleanUrl(m[1]);

        // 4. PixHost
        m = html.match(/(https?:\/\/img\d+\.pixhost\.to\/images\/[^"'\s<]+)/i);
        if (m && m[1]) return cleanUrl(m[1]);

        // 5. IMX.to
        m = html.match(/<img[^>]+class=["'][^"']*centred[^"']*["'][^>]+src=["']([^"']+)["']/i);
        if (m && m[1]) return cleanUrl(m[1]);
        m = html.match(/(https?:\/\/[^"'\s<]*imx\.to\/upload\/[^"'\s<]+)/i);
        if (m && m[1]) return cleanUrl(m[1]);

        // 6. ImageTwist
        m = html.match(/<img[^>]+class=["'][^"']*pic[^"']*["'][^>]+src=["']([^"']+)["']/i);
        if (m && m[1]) return cleanUrl(m[1]);

        // 7. General og:image & twitter:image
        m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["'](https?:\/\/[^"'\s<]+)["']/i);
        if (m && m[1] && !m[1].includes('logo') && !m[1].includes('favicon')) return cleanUrl(m[1]);
        m = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["'](https?:\/\/[^"'\s<]+)["']/i);
        if (m && m[1] && !m[1].includes('logo') && !m[1].includes('favicon')) return cleanUrl(m[1]);

        return null;
    }

    function trySafeFastTransform(imgSrc) {
        if (!imgSrc) return null;
        if (/i\d+\.pixhost\.to\/thumbs\//i.test(imgSrc)) {
            return imgSrc.replace('/thumbs/', '/images/');
        }
        if (/imgbox\.com\//i.test(imgSrc) && /_[b|s]\./i.test(imgSrc)) {
            return imgSrc.replace(/_[b|s]\./i, '_o.');
        }
        if (/postimg\.cc\//i.test(imgSrc) || /postimages\.org\//i.test(imgSrc)) {
            return imgSrc.replace(/\.th\.(jpe?g|png|webp)$/i, '.$1');
        }
        return null;
    }

    
    function isBadgeOrTrashUrl(url) {
        if (!url) return true;
        const u = url.toLowerCase();
        if (u.includes('smilies/') || u.includes('.gif') || u.includes('avatars/') || u.includes('/ranks/')) return true;
        if (/\b(badge|genre|tag|icon|btn|flag|star|rating|logo|banner)\b/i.test(u)) return true;
        if (/\b(turn-based|jrpg|adv|rpg_maker|visual_novel|uncensored|pixel|action|adventure|simulation|strategy|anime)\.(png|jpg|webp)/i.test(u)) return true;
        return false;
    }

    function filterValidScreenshots(items) {
        if (!items || items.length === 0) return Promise.resolve([]);

        const promises = items.map(item => {
            return new Promise((resolve) => {
                const url = item.thumbUrl || item.fullUrl;
                if (isBadgeOrTrashUrl(url)) {
                    resolve(null);
                    return;
                }

                const pre = new Image();
                pre.referrerPolicy = 'no-referrer';
                let resolved = false;

                const finish = (valid) => {
                    if (resolved) return;
                    resolved = true;
                    resolve(valid ? item : null);
                };

                pre.onload = () => {
                    const maxDim = Math.max(pre.naturalWidth, pre.naturalHeight);
                    const minDim = Math.min(pre.naturalWidth, pre.naturalHeight);
                    if (maxDim >= 220 && minDim >= 120) {
                        finish(true);
                    } else {
                        finish(false);
                    }
                };
                pre.onerror = () => finish(false);
                pre.src = url;

                setTimeout(() => finish(false), 2200);
            });
        });

        return Promise.all(promises).then(res => res.filter(Boolean));
    }

    function resolveFullsizeFromHosting(rawHref, currentImgSrc, onFound) {
        const safeInstant = trySafeFastTransform(currentImgSrc);
        if (safeInstant) {
            onFound(safeInstant);
            return;
        }

        if (!rawHref || !rawHref.startsWith('http')) return;

        if (resolvedUrlCache[rawHref]) {
            onFound(resolvedUrlCache[rawHref]);
            return;
        }

        if (/fastpic\./i.test(rawHref)) {
            let pageUrl = rawHref.replace('/view/', '/fullview/');
            pageUrl = pageUrl.replace(/fastpic\.(ru|pro|live)/g, 'fastpic.org');
            fetchPage(pageUrl, (html) => {
                const direct = extractDirectImageUrl(html);
                if (direct) {
                    resolvedUrlCache[rawHref] = direct;
                    onFound(direct);
                }
            }, 'https://fastpic.org/');
            return;
        }

        fetchPage(rawHref, (html) => {
            const direct = extractDirectImageUrl(html);
            if (direct) {
                resolvedUrlCache[rawHref] = direct;
                onFound(direct);
            }
        }, rawHref);
    }

    /* =========================================================================
     * 5. ПАНЕЛЬ НАСТРОЕК (CTRL+P И МЕНЮ)
     * ========================================================================= */
    function openSettings() {
        if (document.querySelector('#rt-settings-panel')) return;

        const overlay = document.createElement('div');
        overlay.id = 'rt-settings-panel';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0,0,0,0.65); backdrop-filter: blur(3px);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000002; opacity: 0; transition: opacity 0.2s;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #1c2128; color: #adbac7; width: 440px; border-radius: 12px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden; display: flex; flex-direction: column;
            border: 1px solid #373e47; transform: scale(0.95); transition: transform 0.2s;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px 22px; background: #22272e; border-bottom: 1px solid #373e47;
            display: flex; justify-content: space-between; align-items: center;
        `;
        const title = document.createElement('h3');
        title.textContent = t.settings;
        title.style.cssText = 'margin: 0; font-size: 17px; font-weight: 600; color: #cdd9e5;';

        const closeIcon = document.createElement('div');
        closeIcon.innerHTML = '✕';
        closeIcon.style.cssText = `
            cursor: pointer; opacity: 0.6; padding: 4px 8px; border-radius: 50%;
            font-size: 16px; font-weight: bold; color: #adbac7; transition: all 0.2s;
        `;
        closeIcon.onmouseover = () => { closeIcon.style.opacity = '1'; closeIcon.style.backgroundColor = 'rgba(255,255,255,0.1)'; };
        closeIcon.onmouseout = () => { closeIcon.style.opacity = '0.6'; closeIcon.style.backgroundColor = 'transparent'; };
        closeIcon.onclick = closePanel;

        header.appendChild(title);
        header.appendChild(closeIcon);

        const content = document.createElement('div');
        content.style.cssText = 'padding: 20px; max-height: 70vh; overflow-y: auto;';

        function createSection(titleText) {
            const section = document.createElement('div');
            section.style.marginBottom = '22px';
            const sectionTitle = document.createElement('div');
            sectionTitle.textContent = titleText;
            sectionTitle.style.cssText = 'font-size: 12px; color: #58a6ff; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; font-weight: 700;';
            section.appendChild(sectionTitle);
            return section;
        }

        // 1. Язык
        const langSection = createSection(t.language);
        const langOptions = [
            { label: '🇷🇺 Русский', value: 'ru' },
            { label: '🇺🇸 English', value: 'en' },
            { label: '🇨🇳 中文', value: 'zh' }
        ];
        const langContainer = document.createElement('div');
        langContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;';
        langOptions.forEach(opt => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex; align-items: center; justify-content: center; padding: 8px 10px;
                background: #2d333b; border-radius: 6px; cursor: pointer; border: 1px solid #444c56;
                font-size: 13px; color: #cdd9e5; transition: all 0.15s; text-align: center;
            `;
            if (lang === opt.value) {
                label.style.borderColor = '#58a6ff';
                label.style.background = 'rgba(88, 166, 255, 0.15)';
                label.style.color = '#58a6ff';
                label.style.fontWeight = 'bold';
            }
            label.onclick = () => {
                GM_setValue('lang', opt.value);
                location.reload();
            };
            label.textContent = opt.label;
            langContainer.appendChild(label);
        });
        langSection.appendChild(langContainer);
        content.appendChild(langSection);

        // 2. Размер встроенных превью
        const imgSizeSection = createSection(t.imgSizeSettings);
        const sizeOptions = [
            { label: t.sizeSmall, value: '150' },
            { label: t.sizeMedium, value: '200' },
            { label: t.sizeLarge, value: '300' },
            { label: t.sizeOriginal, value: '500' }
        ];
        const sizeContainer = document.createElement('div');
        sizeContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;';
        sizeOptions.forEach(opt => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex; align-items: center; padding: 9px 12px; background: #2d333b;
                border-radius: 6px; cursor: pointer; border: 1px solid #444c56; font-size: 13px;
                transition: all 0.15s; color: #cdd9e5;
            `;
            if (savedImgSize === opt.value) {
                label.style.borderColor = '#58a6ff';
                label.style.background = 'rgba(88, 166, 255, 0.15)';
                label.style.color = '#58a6ff';
            }
            label.onclick = () => {
                GM_setValue('imgSize', opt.value);
                location.reload();
            };
            label.textContent = opt.label;
            sizeContainer.appendChild(label);
        });
        imgSizeSection.appendChild(sizeContainer);
        content.appendChild(imgSizeSection);

        // 3. Переключатели: Встроенные превью & Новая вкладка
        const linkSection = createSection(t.linkSettings);

        function createToggleRow(titleText, currentVal, onToggle) {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex; align-items: center; justify-content: space-between; padding: 10px 14px;
                background: #2d333b; border-radius: 6px; cursor: pointer; border: 1px solid #444c56;
                margin-bottom: 8px; font-size: 13px; color: #cdd9e5; transition: all 0.15s;
            `;
            const text = document.createElement('span');
            text.textContent = titleText;
            const toggle = document.createElement('div');
            toggle.style.cssText = `
                width: 38px; height: 20px; background: ${currentVal ? '#58a6ff' : '#444c56'};
                border-radius: 20px; position: relative; transition: background 0.25s; flex-shrink: 0;
            `;
            const knob = document.createElement('div');
            knob.style.cssText = `
                width: 16px; height: 16px; background: white; border-radius: 50%;
                position: absolute; top: 2px; left: ${currentVal ? '20px' : '2px'};
                transition: left 0.25s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            `;
            toggle.appendChild(knob);
            row.appendChild(text);
            row.appendChild(toggle);
            row.onclick = () => onToggle(!currentVal);
            return row;
        }

        const inlineToggle = createToggleRow(t.inlinePreviewsToggle, showInlinePreviews, (val) => {
            GM_setValue('showInlinePreviews', val);
            location.reload();
        });
        const tabToggle = createToggleRow(t.openInNewTab, openInNewTab, (val) => {
            GM_setValue('openInNewTab', val);
            location.reload();
        });
        linkSection.appendChild(inlineToggle);
        linkSection.appendChild(tabToggle);
        content.appendChild(linkSection);

        // 4. Горячая клавиша
        const shortcutSection = createSection(t.shortcutSettings);
        const scContainer = document.createElement('div');
        scContainer.style.cssText = `
            display: flex; align-items: center; justify-content: space-between; padding: 10px 14px;
            background: #2d333b; border-radius: 6px; border: 1px solid #444c56;
        `;
        const scLabel = document.createElement('span');
        scLabel.textContent = shortcut.toUpperCase();
        scLabel.style.cssText = 'font-family: monospace; font-size: 13px; background: #22272e; padding: 4px 8px; border-radius: 4px; color: #58a6ff; border: 1px solid #373e47;';

        const setBtn = document.createElement('button');
        setBtn.textContent = t.clickToSet;
        setBtn.style.cssText = `
            padding: 5px 12px; background: #238636; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;
        `;
        setBtn.onclick = () => {
            setBtn.textContent = t.pressKey;
            setBtn.disabled = true;
            setBtn.style.background = '#555';
            const handler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
                const keys = [];
                if (e.ctrlKey) keys.push('ctrl');
                if (e.altKey) keys.push('alt');
                if (e.shiftKey) keys.push('shift');
                if (e.metaKey) keys.push('meta');
                keys.push(e.key.toLowerCase());
                const newSc = keys.join('+');
                GM_setValue('shortcut', newSc);
                shortcut = newSc;
                scLabel.textContent = newSc.toUpperCase();
                setBtn.textContent = t.clickToSet;
                setBtn.disabled = false;
                setBtn.style.background = '#238636';
                document.removeEventListener('keydown', handler, true);
            };
            document.addEventListener('keydown', handler, true);
        };
        scContainer.appendChild(scLabel);
        scContainer.appendChild(setBtn);
        shortcutSection.appendChild(scContainer);
        content.appendChild(shortcutSection);

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            panel.style.transform = 'scale(1)';
        });

        function closePanel() {
            overlay.style.opacity = '0';
            panel.style.transform = 'scale(0.95)';
            setTimeout(() => overlay.remove(), 200);
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePanel();
        });
    }

    GM_registerMenuCommand(t.settings, openSettings);

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        const keys = [];
        if (e.ctrlKey) keys.push('ctrl');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey) keys.push('shift');
        if (e.metaKey) keys.push('meta');
        if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
        keys.push(e.key.toLowerCase());
        if (keys.join('+') === shortcut) {
            e.preventDefault();
            openSettings();
        }
    });

    /* =========================================================================
     * 6. ТАБЛИЦА РАЗДАЧ: НАСТРОЙКА КОЛОНОК (БЕЗ СДВИГА)
     * ========================================================================= */
    function patchRuTrackerTable(tbl) {
        const allThs = tbl.querySelectorAll('th');
        let forumTh = null;
        let topicTh = null;
        let authorTh = null;

        allThs.forEach(th => {
            const txt = th.textContent.trim().toLowerCase();
            if (/форум|forum/i.test(txt)) forumTh = th;
            else if (/тема|topic/i.test(txt)) topicTh = th;
            else if (/автор|author/i.test(txt)) authorTh = th;
        });

        if (forumTh) {
            forumTh.classList.add('rt-forum-col');

            if (!forumTh.querySelector('.rt-col-resizer')) {
                const resizer = document.createElement('div');
                resizer.className = 'rt-col-resizer';
                resizer.title = 'Перетащите ширину колонки Форум (двойной клик — сброс на 220px)';

                let startX = 0;
                let startWidth = 0;

                resizer.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startX = e.clientX;
                    startWidth = forumTh.offsetWidth;
                    resizer.classList.add('is-resizing');

                    const onMouseMove = (ev) => {
                        const newW = Math.max(100, Math.min(500, startWidth + (ev.clientX - startX)));
                        document.documentElement.style.setProperty('--rt-forum-col-w', `${newW}px`);
                        localStorage.setItem('rt_forum_col_w', `${newW}px`);
                    };

                    const onMouseUp = () => {
                        resizer.classList.remove('is-resizing');
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mouseup', onMouseUp);
                    };

                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                });

                resizer.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.documentElement.style.setProperty('--rt-forum-col-w', '220px');
                    localStorage.setItem('rt_forum_col_w', '220px');
                });

                forumTh.appendChild(resizer);
            }
        }

        if (topicTh) topicTh.classList.add('rt-topic-col');
        if (authorTh) authorTh.classList.add('rt-author-col');

        const rows = tbl.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.querySelector('th')) return;

            const fNameTd = row.querySelector('td.f-name') ||
                            Array.from(row.querySelectorAll('td')).find(td => td.querySelector('a[href*="viewforum.php"]'));
            if (fNameTd) fNameTd.classList.add('rt-forum-col');

            const tTitleTd = row.querySelector('td.t-title, td.row4.tLeft, td.tt') ||
                             Array.from(row.querySelectorAll('td')).find(td => td.querySelector('a[href*="viewtopic.php?t="]'));
            if (tTitleTd) tTitleTd.classList.add('rt-topic-col');

            const authorTd = row.querySelector('td.u-name, td.author') ||
                             Array.from(row.querySelectorAll('td')).find(td => td.querySelector('a[href*="profile.php"]'));
            if (authorTd) authorTd.classList.add('rt-author-col');
        });
    }

    /* =========================================================================
     * 7. ВСТРОЕННЫЕ ПРЕВЬЮ И КНОПКА СКАЧИВАНИЯ В СПИСКЕ РАЗДАЧ
     * ========================================================================= */
    function initInlineListPreviews() {
        const rows = document.querySelectorAll('tr.tCenter, tr.hl-tr, tr[id^="tr-"], tr[id^="trs-tr-"]');

        const fetchQueue = [];
        let activeRequests = 0;
        const MAX_CONCURRENT = 4;

        function processQueue() {
            if (activeRequests >= MAX_CONCURRENT || fetchQueue.length === 0) return;
            const task = fetchQueue.shift();
            activeRequests++;
            task(() => {
                activeRequests--;
                processQueue();
            });
        }

        rows.forEach((row, index) => {
            if (row.dataset.rtProcessed) return;

            const td = row.querySelector('td.t-title, td.row4.tLeft, td.tt') ||
                       Array.from(row.querySelectorAll('td')).find(c => c.querySelector('a.tLink, a.tt-text, a[href*="viewtopic.php?t="]'));
            const anchor = td?.querySelector('a.tLink, a.tt-text, a.topictitle, a[href*="viewtopic.php?t="]');

            if (!anchor || !td) return;
            row.dataset.rtProcessed = 'true';

            if (openInNewTab) {
                anchor.target = '_blank';
            }

            const rawHref = anchor.getAttribute('href') || anchor.href;
            const fullLink = rawHref.startsWith('http')
                ? rawHref
                : new URL(rawHref.replace(/^\.\//, '/forum/'), window.location.origin).href;

            const topicIdMatch = fullLink.match(/[?&]t=(\d+)/);
            const topicId = topicIdMatch ? topicIdMatch[1] : null;

            fetchQueue.push((onDone) => {
                if (topicId && topicDataCache[topicId]) {
                    renderInlineContent(td, topicDataCache[topicId]);
                    onDone();
                    return;
                }

                fetchPage(fullLink, (html) => {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const data = parseTopicDocument(doc);
                        if (topicId) topicDataCache[topicId] = data;
                        renderInlineContent(td, data);
                    } catch (err) {
                        console.error('Error parsing topic:', err);
                    }
                    onDone();
                });
            });

            processQueue();
        });
    }

        function parseTopicDocument(doc) {
        const postContent = doc.querySelector('.post_body') || doc.body;
        const dlLinkNode = postContent.querySelector('.dl-stub.dl-link, a[href*="dl.php?t="], a.attach_link');
        let dlUrl = dlLinkNode ? (dlLinkNode.getAttribute('href') || dlLinkNode.href) : null;
        if (dlUrl && !dlUrl.startsWith('http')) {
            dlUrl = window.location.origin + (dlUrl.startsWith('/') ? '' : '/forum/') + dlUrl;
        }

        const screenshots = [];
        const seen = new Set();

        const spWraps = postContent.querySelectorAll('.sp-wrap');
        const screenshotSpWraps = [];
        spWraps.forEach(wrap => {
            const head = wrap.querySelector('.sp-head');
            if (head && /скрин|screen|shot|пример|caps|кадр|превью|snaps|pic/i.test(head.textContent)) {
                const b = wrap.querySelector('.sp-body');
                if (b) screenshotSpWraps.push(b);
            }
        });
        // Если есть спойлеры скриншотов - берем ТОЛЬКО из них, игнорируя бейджи из описания!
        const targetContainers = screenshotSpWraps.length > 0 ? screenshotSpWraps : [postContent];

        targetContainers.forEach(container => {
            container.querySelectorAll('var.postImg, img.postImg, img').forEach(node => {
                let thumbUrl = '';
                if (node.tagName.toLowerCase() === 'var') {
                    thumbUrl = node.getAttribute('title') || node.getAttribute('data-src') || '';
                } else {
                    thumbUrl = node.getAttribute('src') || '';
                }
                thumbUrl = (thumbUrl || '').trim();
                if (!thumbUrl || thumbUrl.includes('smilies/') || thumbUrl.includes('.gif') || thumbUrl.includes('avatars/')) return;
                // Фильтр иконок жанров, тегов и бейджей
                if (/\b(badge|genre|tag|icon|btn|flag|star)\b/i.test(thumbUrl) ||
                    /\b(turn-based|jrpg|visual_novel|uncensored|rpg_maker)\b/i.test(thumbUrl)) return;

                const parentA = node.closest('a');
                let fullUrl = parentA ? (parentA.getAttribute('href') || parentA.href || '') : thumbUrl;

                const key = thumbUrl + fullUrl;
                if (seen.has(key)) return;
                seen.add(key);

                screenshots.push({ thumbUrl, fullUrl, resolvedUrl: null });
            });
        });

        return { dlUrl, screenshots };
    }

        function renderInlineContent(td, data) {
        if (!td || td.querySelector('.pl-inline-wrap')) return;

        const { dlUrl, screenshots } = data;
        if (!dlUrl && (!screenshots || screenshots.length === 0)) return;

        const wrap = document.createElement('div');
        wrap.className = 'pl-inline-wrap';

        // 1. Кнопка скачивания
        if (dlUrl) {
            const dlRow = document.createElement('div');
            dlRow.className = 'pl-inline-dl-row';

            const dlBtn = document.createElement('a');
            dlBtn.className = 'pl-inline-dl-btn';
            dlBtn.href = dlUrl;
            dlBtn.textContent = t.downloadTorrent;
            dlBtn.target = '_blank';
            dlBtn.title = 'Скачать .torrent файл';

            dlRow.appendChild(dlBtn);
            wrap.appendChild(dlRow);
        }

        // 2. Встроенные превью: валидируем в памяти без мерцания
        if (showInlinePreviews && screenshots && screenshots.length > 0) {
            const candidates = screenshots.slice(0, 25);
            filterValidScreenshots(candidates).then(validScreenshots => {
                if (validScreenshots.length === 0) return;

                const imgContainer = document.createElement('div');
                imgContainer.className = 'pl-inline-imgs-container';

                const limit = Math.min(validScreenshots.length, 20);
                for (let i = 0; i < limit; i++) {
                    const item = validScreenshots[i];
                    const img = document.createElement('img');
                    img.className = 'pl-inline-thumb';
                    img.src = item.thumbUrl || item.fullUrl;
                    img.loading = 'lazy';
                    img.referrerPolicy = 'no-referrer';

                    img.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const galleryItems = validScreenshots.map(s => ({
                            src: s.resolvedUrl || s.fullUrl,
                            thumb: s.thumbUrl || s.resolvedUrl || s.fullUrl
                        }));
                        openLightbox(i, galleryItems);
                    });

                    imgContainer.appendChild(img);
                }

                wrap.appendChild(imgContainer);
            });
        }

        td.appendChild(wrap);
    }

    function initListing() {
        const tables = document.querySelectorAll('#tor-tbl, .vf-table, table.forumline');
        tables.forEach(patchRuTrackerTable);

        initInlineListPreviews();

        const obs = new MutationObserver(() => {
            const currentTables = document.querySelectorAll('#tor-tbl, .vf-table, table.forumline');
            currentTables.forEach(patchRuTrackerTable);
            initInlineListPreviews();
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    /* =========================================================================
     * 8. БОКОВОЕ ОКНО ПРЕДПРОСМОТРА СКРИНШОТОВ (СПРАВА НАЛЕВО)
     * ========================================================================= */
    let previewWindow = null;
    let currentPreviewLink = null;
    let hoverTimeout = null;
    let closeTimeout = null;
    let isPreviewLocked = false;
    let activePreviewRequestId = 0;

    function positionPreviewWindow() {
        if (!previewWindow || !currentPreviewLink) return;
        const linkRect = currentPreviewLink.getBoundingClientRect();
        const pHeight = previewWindow.offsetHeight || 550;
        let topPos = linkRect.top - 20;
        const maxTop = window.innerHeight - pHeight - 15;
        if (topPos > maxTop) topPos = maxTop;
        if (topPos < 15) topPos = 15;
        previewWindow.style.top = `${Math.round(topPos)}px`;
    }

    function createPreviewElement() {
        if (document.getElementById('torrent-preview')) return document.getElementById('torrent-preview');
        const el = document.createElement('div');
        el.id = 'torrent-preview';
        el.innerHTML = `
            <div class="rt-pv-header">
                <div class="rt-pv-header-left">
                    <span class="rt-pv-badge">${t.screenshotsBadge}: <strong id="rt-pv-count">0</strong></span>
                </div>
                <div class="rt-pv-header-center">
                    <div class="rt-pv-scale-box" title="Количество колонок сетки">
                        <span class="rt-pv-scale-label">${t.columnsLabel}</span>
                        <input type="range" class="rt-pv-cols-slider" min="1" max="4" value="${savedPreviewCols}" step="1">
                        <span class="rt-pv-cols-val">${savedPreviewCols}</span>
                    </div>
                </div>
                <div class="rt-pv-header-right">
                    <button class="rt-pv-btn" id="rt-pv-lock-btn" title="Зафиксировать окно">
                        <span id="rt-pv-lock-icon">🔓</span>
                        <span id="rt-pv-lock-text">${t.lockBtnText}</span>
                    </button>
                    <button class="rt-pv-close-btn" id="rt-pv-close-btn" title="Закрыть">✕</button>
                </div>
            </div>
            <div class="rt-pv-body" id="rt-pv-body" style="overflow-y:auto; flex:1; max-height:calc(100vh - 100px);"></div>
        `;
        document.body.appendChild(el);

        const lockBtn = el.querySelector('#rt-pv-lock-btn');
        const lockIcon = el.querySelector('#rt-pv-lock-icon');
        const lockText = el.querySelector('#rt-pv-lock-text');
        lockBtn.addEventListener('click', () => {
            isPreviewLocked = !isPreviewLocked;
            lockBtn.classList.toggle('active', isPreviewLocked);
            el.classList.toggle('rt-pv-locked', isPreviewLocked);
            lockIcon.textContent = isPreviewLocked ? '🔒' : '🔓';
            lockText.textContent = isPreviewLocked ? t.lockedBtnText : t.lockBtnText;
        });

        el.querySelector('#rt-pv-close-btn').addEventListener('click', () => {
            isPreviewLocked = false;
            lockBtn.classList.remove('active');
            el.classList.remove('rt-pv-locked');
            lockIcon.textContent = '🔓';
            lockText.textContent = t.lockBtnText;
            hidePreview();
        });

        const slider = el.querySelector('.rt-pv-cols-slider');
        const sliderVal = el.querySelector('.rt-pv-cols-val');
        slider.addEventListener('input', (e) => {
            const v = e.target.value;
            sliderVal.textContent = v;
            document.documentElement.style.setProperty('--rt-pv-cols', v);
            localStorage.setItem('rt_pv_cols', v);
        });

        el.addEventListener('mouseenter', () => clearTimeout(closeTimeout));
        el.addEventListener('mouseleave', () => {
            if (!isPreviewLocked) closeTimeout = setTimeout(hidePreview, 300);
        });

        return el;
    }

    function showPreview(link) {
        if (!link) return;
        currentPreviewLink = link;
        previewWindow = createPreviewElement();
        positionPreviewWindow();
        previewWindow.classList.add('rt-pv-visible');

        const topicHref = link.getAttribute('href') || link.href;
        const topicIdMatch = topicHref.match(/[?&]t=(\d+)/);
        const topicId = topicIdMatch ? topicIdMatch[1] : null;

        const bodyEl = previewWindow.querySelector('#rt-pv-body');
        const countEl = previewWindow.querySelector('#rt-pv-count');

        if (topicId && topicDataCache[topicId] && topicDataCache[topicId].screenshots) {
            renderPreviewScreenshots(topicDataCache[topicId].screenshots, bodyEl, countEl);
            return;
        }

        bodyEl.innerHTML = `<div style="padding:40px; text-align:center; color:#8b949e; font-size:14px;">${t.loadingScreenshots}</div>`;
        countEl.textContent = '...';

        const reqId = ++activePreviewRequestId;
        fetchPage(topicHref, (html) => {
            if (reqId !== activePreviewRequestId) return;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const data = parseTopicDocument(doc);

            if (topicId) topicDataCache[topicId] = data;
            renderPreviewScreenshots(data.screenshots, bodyEl, countEl);
        });
    }

    function hidePreview() {
        if (previewWindow) previewWindow.classList.remove('rt-pv-visible');
        currentPreviewLink = null;
    }

        function renderPreviewScreenshots(rawScreenshots, bodyEl, countEl) {
        bodyEl.innerHTML = `<div style="padding:40px; text-align:center; color:#8b949e; font-size:14px;">${t.loadingScreenshots}</div>`;
        countEl.textContent = '...';

        filterValidScreenshots(rawScreenshots).then(validScreenshots => {
            bodyEl.innerHTML = '';
            countEl.textContent = validScreenshots.length;

            if (validScreenshots.length === 0) {
                bodyEl.innerHTML = `<div style="padding:40px; text-align:center; color:#8b949e;">${t.noScreenshotsFound}</div>`;
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'rt-pv-grid';

            validScreenshots.forEach((item, index) => {
                const wrap = document.createElement('div');
                wrap.className = 'rt-pv-thumb-wrap';

                const img = document.createElement('img');
                img.className = 'rt-pv-thumb-img';
                img.src = item.thumbUrl || item.fullUrl;
                img.loading = 'lazy';
                img.referrerPolicy = 'no-referrer';

                resolveFullsizeFromHosting(item.fullUrl, item.thumbUrl, (resolvedUrl) => {
                    if (!resolvedUrl || resolvedUrl === img.src) return;
                    const pre = new Image();
                    pre.referrerPolicy = 'no-referrer';
                    pre.onload = () => {
                        img.src = resolvedUrl;
                        item.resolvedUrl = resolvedUrl;
                    };
                    pre.src = resolvedUrl;
                });

                wrap.appendChild(img);
                wrap.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const galleryItems = validScreenshots.map(s => ({
                        src: s.resolvedUrl || s.fullUrl,
                        thumb: s.thumbUrl || s.resolvedUrl || s.fullUrl
                    }));
                    openLightbox(index, galleryItems);
                });

                grid.appendChild(wrap);
            });

            bodyEl.appendChild(grid);
            positionPreviewWindow();
        });
    }

    function initListHoverPreviews() {
        document.addEventListener('mouseover', (e) => {
            if (isPreviewLocked) return;
            const link = e.target.closest('a.tLink, a.tt-text, a.topictitle, a[href*="viewtopic.php?t="]');
            if (!link) return;
            if (link.closest('#torrent-preview') || link.closest('.pl-inline-wrap')) return;

            clearTimeout(closeTimeout);
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => showPreview(link), 350);
        });

        document.addEventListener('mouseout', (e) => {
            if (isPreviewLocked) return;
            const link = e.target.closest('a.tLink, a.tt-text, a.topictitle, a[href*="viewtopic.php?t="]');
            if (link) {
                clearTimeout(hoverTimeout);
                closeTimeout = setTimeout(hidePreview, 300);
            }
        });
    }

    /* =========================================================================
     * 9. СТРАНИЦА РАЗДАЧИ: СТРОГО ЕДИНАЯ СТРОЧКА ТУЛБАРА И ОТОБРАЖЕНИЕ СКРИНШОТОВ
     * ========================================================================= */
    let galleryImages = [];
    let currentLightboxIdx = 0;

    function checkIfScreenlist(img, href) {
        const text = ((img.alt || '') + ' ' + (img.title || '') + ' ' + href).toLowerCase();
        return text.includes('screenlist') || text.includes('скринлист') || text.includes('screens') || text.includes('caps');
    }

    function markAsScreenlist(item) {
        item.isScreenlist = true;
        if (item.targetNode) {
            item.targetNode.classList.add('rt-screenlist');
            item.el.title = '📋 Скринлист (кликните для просмотра в галерее)';
        }
    }

    function injectScreenshotToolbar(container) {
        if (document.getElementById('rt-single-toolbar') || document.querySelector('.rt-toolbar')) return;

        const dlInfo = getTorrentDownloadInfo();
        const currentScale = getSavedScale();
        const currentScreenlistScale = getSavedScreenlistScale();
        const isOverviewFirst = getSavedOverviewFirst();

        const toolbar = document.createElement('div');
        toolbar.id = 'rt-single-toolbar';
        toolbar.className = 'rt-toolbar';
        toolbar.innerHTML = `
            <div class="rt-toolbar-left">
                ${dlInfo.dlUrl ? `
                    <a href="${dlInfo.dlUrl}" class="rt-torrent-dl-btn" title="Скачать .torrent файл">
                        <svg class="rt-floppy-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M19 12v7H5v-7h14m0-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2m-3-8H5a2 2 0 0 0-2 2v2h16V6a2 2 0 0 0-2-2m-3 3H7V5h6v2z"/>
                        </svg>
                        <div class="rt-torrent-dl-text">
                            <span class="rt-torrent-dl-main">Скачать .torrent</span>
                            ${dlInfo.sizeText ? `<span class="rt-torrent-dl-sub">${dlInfo.sizeText}</span>` : ''}
                        </div>
                    </a>
                ` : ''}
                <div class="rt-scale-box" title="Размер скриншотов">
                    <span class="rt-scale-label">${t.scaleScreenshots}</span>
                    <input type="range" class="rt-scale-slider" min="25" max="100" value="${currentScale}" step="1">
                    <span class="rt-scale-badge">${currentScale}%</span>
                    <button class="rt-btn rt-scale-reset" title="${t.resetScale}">↺</button>
                </div>
                <div class="rt-scale-box" title="Размер скринлистов">
                    <span class="rt-scale-label">${t.scaleScreenlist}</span>
                    <input type="range" class="rt-screenlist-slider rt-scale-slider" min="30" max="150" value="${currentScreenlistScale}" step="1">
                    <span class="rt-screenlist-badge rt-scale-badge" style="color:#10b981">${currentScreenlistScale}%</span>
                    <button class="rt-btn rt-screenlist-reset rt-scale-reset" title="${t.resetScale}">↺</button>
                </div>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                    <input type="checkbox" class="rt-overview-toggle" ${isOverviewFirst ? 'checked' : ''}>
                    <span>${t.overviewFirst}</span>
                </label>
            </div>
            <div class="rt-toolbar-right">
                <div id="rt-tb-tgs-container"></div>
                <button class="rt-btn rt-tb-gallery-btn" title="Открыть просмотрщик во весь экран">${t.viewGallery}</button>
            </div>
        `;

        container.parentNode.insertBefore(toolbar, container);

        const slider = toolbar.querySelector('.rt-scale-slider');
        const badge = toolbar.querySelector('.rt-scale-badge');
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            badge.textContent = `${val}%`;
            localStorage.setItem(STORAGE_KEY, val);
            applyScale(val);
        });
        toolbar.querySelector('.rt-scale-reset').addEventListener('click', () => {
            slider.value = 80;
            badge.textContent = '80%';
            localStorage.setItem(STORAGE_KEY, '80');
            applyScale(80);
        });

        const slSlider = toolbar.querySelector('.rt-screenlist-slider');
        const slBadge = toolbar.querySelector('.rt-screenlist-badge');
        slSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            slBadge.textContent = `${val}%`;
            localStorage.setItem(STORAGE_SCREENLIST_KEY, val);
            applyScreenlistScale(val);
        });
        toolbar.querySelector('.rt-screenlist-reset').addEventListener('click', () => {
            slSlider.value = 100;
            slBadge.textContent = '100%';
            localStorage.setItem(STORAGE_SCREENLIST_KEY, '100');
            applyScreenlistScale(100);
        });

        toolbar.querySelector('.rt-overview-toggle').addEventListener('change', (e) => {
            localStorage.setItem(STORAGE_OVERVIEW_KEY, String(e.target.checked));
            document.querySelectorAll('.rt-screenshots-grid').forEach(g => {
                g.classList.toggle('rt-overview-active', e.target.checked);
            });
        });

        
        const tgsCont = toolbar.querySelector('#rt-tb-tgs-container');
        if (tgsCont) {
            tgsCont.appendChild(createTgsBrandBar());
        }

        toolbar.querySelector('.rt-tb-gallery-btn').addEventListener('click', () => {
            if (galleryImages.length) openLightbox(0);
        });
    }

            function processTopicScreenshots() {
        const postBody = document.querySelector('.post_body, .postbody, #post_body');
        if (!postBody) return;

        // Полностью исключаем подписи автора снизу поста
        const sig = postBody.querySelector('.signature, .user_sig, .post_sig, .signature_div');
        if (sig) {
            sig.querySelectorAll('img, var').forEach(el => el.setAttribute('data-rt-ignore', 'true'));
        }

        const spWraps = postBody.querySelectorAll('.sp-wrap');
        const screenshotSpWraps = [];
        spWraps.forEach(wrap => {
            const head = wrap.querySelector('.sp-head');
            if (head && /скрин|screen|shot|кадр|пример|caps|превью|snaps|pic/i.test(head.textContent)) {
                wrap.classList.add('sp-opened');
                wrap.classList.remove('sp-folded');
                head.classList.add('sp-opened');
                head.classList.remove('folded');
                const b = wrap.querySelector('.sp-body');
                if (b) {
                    b.style.display = 'block';
                    screenshotSpWraps.push({ wrap, body: b });
                }
            }
        });

        // ПРАВИЛО ЧИСТОТЫ: Если есть спойлеры со скриншотами - работаем СТРОГО внутри них!
        // Никогда не берем картинки из описания (где жанры) или футера (где подписи)
        const containers = screenshotSpWraps.length > 0 ? screenshotSpWraps : [{ wrap: postBody, body: postBody }];

        if (containers.length > 0) {
            injectScreenshotToolbar(containers[0].wrap);
        }

        galleryImages = [];
        const processedKeys = new Set();
        const isOverviewFirst = getSavedOverviewFirst();

        containers.forEach(({ wrap, body }) => {
            // Раскрываем var.postImg
            body.querySelectorAll('var.postImg').forEach(v => {
                if (v.hasAttribute('data-rt-ignore')) return;
                let src = v.getAttribute('title') || v.getAttribute('data-src') || v.getAttribute('data-original') || '';
                src = src.trim();
                if (src && !isBadgeOrTrashUrl(src)) {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = 'postImg';
                    img.referrerPolicy = 'no-referrer';
                    v.parentNode.replaceChild(img, v);
                } else {
                    v.remove();
                }
            });

            let grid = body.querySelector('.rt-screenshots-grid');
            if (!grid) {
                grid = document.createElement('div');
                grid.className = `rt-screenshots-grid ${isOverviewFirst ? 'rt-overview-active' : ''}`;
                body.insertBefore(grid, body.firstChild);
            }

            body.querySelectorAll('img').forEach(img => {
                if (img.classList.contains('rt-floppy-icon') ||
                    img.src.includes('.gif') ||
                    img.src.includes('smilies/') ||
                    img.src.includes('avatars/') ||
                    img.hasAttribute('data-rt-ignore') ||
                    isBadgeOrTrashUrl(img.src)) {
                    return;
                }

                const parentA = img.closest('a');
                const rawHref = parentA ? (parentA.getAttribute('href') || parentA.href || '') : '';
                const originalSrc = img.dataset.originalSrc || img.src;
                if (!originalSrc || originalSrc.startsWith('data:')) return;

                img.dataset.originalSrc = originalSrc;
                img.referrerPolicy = 'no-referrer';

                const dedupeKey = originalSrc + rawHref;
                if (processedKeys.has(dedupeKey)) return;
                processedKeys.add(dedupeKey);

                const targetNode = parentA || img;
                let isHandled = false;

                // Функция валидации: только проверенные и загруженные изображения добавляются в сетку
                const attachIfValid = () => {
                    if (isHandled) return;
                    const maxDim = Math.max(img.naturalWidth, img.naturalHeight);
                    const minDim = Math.min(img.naturalWidth, img.naturalHeight);

                    // Если картинка битая (0px) или мелкий бейдж (< 220px) — ПОЛНОСТЬЮ удаляем её из страницы!
                    if (maxDim < 220 || minDim < 120) {
                        isHandled = true;
                        targetNode.remove();
                        const gIdx = galleryImages.findIndex(g => g.el === img);
                        if (gIdx !== -1) galleryImages.splice(gIdx, 1);
                        return;
                    }

                    isHandled = true;
                    if (targetNode.parentNode !== grid) {
                        grid.appendChild(targetNode);
                    }

                    const galleryItem = {
                        src: originalSrc,
                        thumb: originalSrc,
                        el: img,
                        targetNode: targetNode,
                        isScreenlist: false
                    };
                    galleryImages.push(galleryItem);

                    if (checkIfScreenlist(img, rawHref)) {
                        markAsScreenlist(galleryItem);
                    }

                    img.style.cursor = 'zoom-in';
                    img.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = galleryImages.findIndex(g => g.src === img.src || g.thumb === img.src);
                        openLightbox(idx !== -1 ? idx : 0);
                    });

                    resolveFullsizeFromHosting(rawHref, originalSrc, (fullUrl) => {
                        if (!fullUrl || fullUrl === originalSrc) return;
                        const pre = new Image();
                        pre.referrerPolicy = 'no-referrer';
                        pre.onload = () => {
                            img.src = fullUrl;
                            galleryItem.src = fullUrl;
                        };
                        pre.src = fullUrl;
                    });
                };

                const cleanupDead = () => {
                    if (isHandled) return;
                    isHandled = true;
                    targetNode.remove();
                    const gIdx = galleryImages.findIndex(g => g.el === img);
                    if (gIdx !== -1) galleryImages.splice(gIdx, 1);
                };

                img.onerror = cleanupDead;

                // Таймаут для зависших или битых хостингов (исключает 5 пустых черных квадратов)
                setTimeout(() => {
                    if (!isHandled && (!img.complete || img.naturalWidth === 0)) {
                        cleanupDead();
                    }
                }, 3000);

                if (img.complete && img.naturalWidth > 0) {
                    attachIfValid();
                } else {
                    img.addEventListener('load', attachIfValid);
                }
            });
        });
    }

/* =========================================================================
     * 10. LIGHTBOX ПОЛНОЭКРАННЫЙ ПРОСМОТРЩИК
     * ========================================================================= */
        let lightboxEl = null;
    let customGalleryItems = null;

    function openLightbox(index, customItems) {
        customGalleryItems = customItems || null;
        const items = customGalleryItems || galleryImages;
        if (!items || items.length === 0) return;

        currentLightboxIdx = Math.max(0, Math.min(index, items.length - 1));

        if (!lightboxEl) {
            lightboxEl = document.createElement('div');
            lightboxEl.className = 'rt-lightbox';
            lightboxEl.innerHTML = `
                <div class="rt-lb-topbar">
                    <span style="font-weight:600; color:#c9d1d9;">Просмотр скриншотов (<span id="rt-lb-idx">1</span> / <span id="rt-lb-total">1</span>)</span>
                    <button class="rt-btn" id="rt-lb-close" style="font-size:14px; padding:4px 14px; cursor:pointer;">✕ Закрыть (Esc)</button>
                </div>
                <div class="rt-lb-center">
                    <button class="rt-lb-nav rt-lb-prev" id="rt-lb-prev">‹</button>
                    <img class="rt-lb-main-img" id="rt-lb-img" src="" referrerpolicy="no-referrer">
                    <button class="rt-lb-nav rt-lb-next" id="rt-lb-next">›</button>
                </div>
                <div class="rt-lb-thumbs" id="rt-lb-thumbs"></div>
            `;
            document.body.appendChild(lightboxEl);

            const closeBtn = lightboxEl.querySelector('#rt-lb-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeLightbox();
                });
            }

            lightboxEl.querySelector('#rt-lb-prev').addEventListener('click', (e) => {
                e.stopPropagation();
                changeLightboxSlide(-1);
            });
            lightboxEl.querySelector('#rt-lb-next').addEventListener('click', (e) => {
                e.stopPropagation();
                changeLightboxSlide(1);
            });

            lightboxEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('rt-lb-center') || e.target.classList.contains('rt-lightbox') || e.target.id === 'rt-lb-close') {
                    closeLightbox();
                }
            });

            // Захватывающий глобальный слушатель Escape (useCapture = true, перехватывает до скриптов форума)
            window.addEventListener('keydown', (e) => {
                if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
                if (e.key === 'Escape' || e.code === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    closeLightbox();
                } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
                    e.preventDefault();
                    changeLightboxSlide(-1);
                } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
                    e.preventDefault();
                    changeLightboxSlide(1);
                }
            }, true);
        }

        lightboxEl.classList.add('active');
        lightboxEl.style.display = 'flex';
        renderLightboxContent();
    }

    function closeLightbox() {
        if (lightboxEl) {
            lightboxEl.classList.remove('active');
            lightboxEl.style.display = 'none';
        }
    }

    function changeLightboxSlide(dir) {
        const items = customGalleryItems || galleryImages;
        if (!items || items.length === 0) return;
        currentLightboxIdx = (currentLightboxIdx + dir + items.length) % items.length;
        renderLightboxContent();
    }

    function renderLightboxContent() {
        const items = customGalleryItems || galleryImages;
        if (!items || !items[currentLightboxIdx]) return;

        const cur = items[currentLightboxIdx];
        lightboxEl.querySelector('#rt-lb-idx').textContent = currentLightboxIdx + 1;
        lightboxEl.querySelector('#rt-lb-total').textContent = items.length;

        const mainImg = lightboxEl.querySelector('#rt-lb-img');
        mainImg.src = cur.src || cur.thumb;

        const thumbsContainer = lightboxEl.querySelector('#rt-lb-thumbs');
        thumbsContainer.innerHTML = '';
        items.forEach((it, idx) => {
            const t = document.createElement('img');
            t.className = `rt-lb-thumb ${idx === currentLightboxIdx ? 'active' : ''}`;
            t.src = it.thumb || it.src;
            t.referrerPolicy = 'no-referrer';
            t.addEventListener('click', (e) => {
                e.stopPropagation();
                currentLightboxIdx = idx;
                renderLightboxContent();
            });
            thumbsContainer.appendChild(t);
        });

        const activeT = thumbsContainer.querySelector('.active');
        if (activeT) activeT.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

/* =========================================================================
     * 11. СТАРТ
     * ========================================================================= */

    
    function insertTgsBrandGroup() {
        if (document.getElementById('tgs-brand-group')) return;

        const group = document.createElement('span');
        group.id = 'tgs-brand-group';
        group.className = 'tgs-brand-group';
        group.innerHTML = `
            <a href="https://www.patreon.com/c/terebonkoff/about?utm_source=userscript_rutracker&utm_medium=tgs_suite" target="_blank" rel="noopener noreferrer" class="tgs-support-btn" title="Поддержать Terebonkoff Game Studio на Patreon">
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

    function insertSupportButton() {
        if (document.getElementById('tgs-support-btn')) return;

        const btn = document.createElement('a');
        btn.id = 'tgs-support-btn';
        btn.href = 'https://www.patreon.com/c/terebonkoff/about?utm_source=userscript_rutracker&utm_medium=tgs_suite';
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'tgs-support-btn';
        btn.innerHTML = `<span class="tgs-heart">💖</span> <span>Support Me Terebonkoff Game Studio</span>`;

        // 1. В тулбар раздачи
        const tb = document.querySelector('.rt-toolbar');
        if (tb) {
            tb.appendChild(btn);
            return;
        }

        // 2. В главное меню/шапку сайта
        const nav = document.querySelector('#main-nav, #page_header, #top-nav, .topmenu, #nav-panel');
        if (nav) {
            nav.appendChild(btn);
            return;
        }
    }


    function createTgsBrandBar(extraClass = '') {
        const bar = document.createElement('div');
        bar.className = 'tgs-branding-bar ' + extraClass;
        bar.id = 'tgs-branding-bar';
        bar.innerHTML = `
            <span class="tgs-title-label">
                <span class="tgs-logo-icon">🚀</span>
                <b>Terebonkoff Game Studio</b> <span class="tgs-sub-tag">/ TGS Scripts</span>
            </span>
            <div class="tgs-actions">
                <a href="https://www.patreon.com/c/terebonkoff/about?utm_source=userscript_rutracker&utm_medium=tgs_suite" target="_blank" rel="noopener noreferrer" class="tgs-btn tgs-btn-patreon" title="Поддержать Terebonkoff Game Studio на Patreon">
                    <span class="tgs-heart">💖</span> <span>Support Me</span>
                </a>
                <a href="https://github.com/Terebonkoff/TGS-UserScripts" target="_blank" rel="noopener noreferrer" class="tgs-btn tgs-btn-github" title="Официальный GitHub TGS: все скрипты и обновления">
                    <span>⭐</span> <span>GitHub</span>
                </a>
            </div>
        `;
        return bar;
    }


    function purgeRuTrackerAnnouncements() {
        const badPhrases = [
            'помочь ресурсу',
            'donate for us',
            'donate',
            'пожертвован',
            'сбор средств',
            'на оплату серверов'
        ];

        document.querySelectorAll('div, tr, td, p, table, span').forEach(el => {
            const txt = (el.textContent || '').trim().toLowerCase();
            if (txt.length < 350 && badPhrases.some(p => txt.includes(p))) {
                const box = el.closest('tr, table, div.warning, div.alert, div.info, div') || el;
                if (box && !box.closest('.tgs-branding-bar') && !box.closest('.rt-toolbar')) {
                    box.style.setProperty('display', 'none', 'important');
                }
            }
        });

        document.querySelectorAll('.donate, #donate, [class*="donate"], [id*="donate"], a[href*="donate"]').forEach(el => {
            if (!el.closest('.tgs-branding-bar') && !el.closest('.rt-toolbar')) {
                el.style.setProperty('display', 'none', 'important');
            }
        });
    }

    function init() {
        purgeRuTrackerAnnouncements();
        
        const topNav = document.querySelector('#main-nav, #page_header');
        if (topNav && !document.querySelector('.tgs-branding-bar')) {
            topNav.appendChild(createTgsBrandBar());
        }

        setTimeout(purgeRuTrackerAnnouncements, 400);
        insertTgsBrandGroup();
        injectMasterStyles();

        if (isTopicPage) {
            applyScale(getSavedScale());
            applyScreenlistScale(getSavedScreenlistScale());
            processTopicScreenshots();
            setTimeout(processTopicScreenshots, 350);
            setTimeout(processTopicScreenshots, 1000);

            document.addEventListener('click', (e) => {
                if (!e.isTrusted) return;
                if (e.target.closest('.sp-head')) {
                    setTimeout(processTopicScreenshots, 200);
                }
            });
        }

        if (isListPage) {
            initListing();
            initListHoverPreviews();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
