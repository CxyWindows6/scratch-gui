// Surge Editor — mdui (Material Design 3) theme bootstrap.
//
// Generates a Material You color scheme from the Surge Editor brand color and
// applies/persists the light/dark/auto theme mode.
//
// Scope note: this module only manages the *mdui* side of theming. The
// scratch-gui theme system (src/lib/themes) keeps driving the legacy UI with
// its own CSS variables (--ui-primary, --motion-primary, ...). The two
// systems are independent; the page-level glue between them lives in
// ./overrides.css.

import {
    removeColorScheme,
    setColorScheme,
    setTheme
} from 'mdui';

// Follows the existing `surge:` localStorage prefix convention
// (see src/lib/feedback-config.js) and does not collide with any other key.
const STORAGE_KEY = 'surge:mdui-theme';

// Brand seed color (Surge Editor orange) — kept as an *option*; the default
// is mdui's built-in Material 3 scheme (no custom color scheme).
// Evidence for the brand color:
// - src/css/typography.css:5  --ui-hover: rgba(255, 107, 53, 0.12)
// - src/lib/themes/accent/orange.js (full accent theme built on #ff6b35)
// - src/components/tw-feedback-modal/feedback-modal.css (color: #ff6b35)
// - src/components/tw-community-feedback/community-feedback.css (color: #ff6b35)
const DEFAULT_SEED_COLOR = null; // null -> mdui default theme
const DEFAULT_MODE = 'auto';
const MODES = ['light', 'dark', 'auto'];

/**
 * @returns {'light'|'dark'|'auto'} The persisted theme mode, or 'auto' if
 *     nothing is stored (or localStorage is unavailable).
 */
const getSurgeThemeMode = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return MODES.indexOf(stored) === -1 ? DEFAULT_MODE : stored;
    } catch (e) {
        // localStorage may be unavailable (private mode, sandboxed iframe)
        return DEFAULT_MODE;
    }
};

/**
 * Synchronize the <meta name="theme-color"> tag with the current MD3 surface container color.
 */
const syncThemeColorMeta = () => {
    try {
        let meta = document.head.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        const parts = getComputedStyle(document.documentElement)
            .getPropertyValue('--mdui-color-surface-container')
            .trim();
        if (parts) {
            meta.setAttribute('content', `rgb(${parts})`);
        }
    } catch (e) {
        // ignore
    }
};

/**
 * Apply a theme mode to the mdui theme system and persist the choice.
 * @param {'light'|'dark'|'auto'} mode The mode to apply. Invalid values fall
 *     back to 'auto'.
 * @returns {'light'|'dark'|'auto'} The mode that was actually applied.
 */
const setSurgeThemeMode = mode => {
    const nextMode = MODES.indexOf(mode) === -1 ? DEFAULT_MODE : mode;
    setTheme(nextMode);
    try {
        localStorage.setItem(STORAGE_KEY, nextMode);
    } catch (e) {
        // ignore
    }
    // Update theme-color meta tag on the next tick once class mutations propagate
    requestAnimationFrame(() => syncThemeColorMeta());
    return nextMode;
};

/**
 * Initialize the mdui theme: generate a color scheme from the seed color and
 * apply the theme mode.
 *
 * If options.mode is omitted, the previously persisted mode is used (which
 * itself defaults to 'auto' on first run), so a user's choice survives
 * reloads instead of being reset on every boot.
 * @param {object} [options] Options object.
 * @param {string} [options.seedColor] Seed color for the Material You palette.
 * @param {string} [options.mode] Theme mode: 'light', 'dark' or 'auto'.
 */
const initSurgeTheme = (options = {}) => {
    const seedColor = options.seedColor || DEFAULT_SEED_COLOR;
    if (seedColor) {
        setColorScheme(seedColor);
    } else {
        // No seed color: use mdui's built-in default Material 3 scheme.
        // setColorScheme(null) would crash (argbFromHex(null)), so call
        // removeColorScheme() instead.
        removeColorScheme();
    }
    setSurgeThemeMode(options.mode || getSurgeThemeMode());

    // Observe html class attribute changes (e.g., mdui-theme-dark/light) to keep meta updated
    try {
        if (window.MutationObserver && !window.__surgeThemeColorObserver) {
            window.__surgeThemeColorObserver = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                        syncThemeColorMeta();
                        break;
                    }
                }
            });
            window.__surgeThemeColorObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                syncThemeColorMeta();
            });
        }
    } catch (e) {
        // ignore
    }
};

/**
 * Restore mdui's default look: remove the custom color scheme, reset the
 * theme mode to 'auto' and clear the persisted choice.
 */
const removeSurgeTheme = () => {
    removeColorScheme();
    setTheme(DEFAULT_MODE);
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        // ignore
    }
};

export {
    getSurgeThemeMode,
    initSurgeTheme,
    removeSurgeTheme,
    setSurgeThemeMode
};
