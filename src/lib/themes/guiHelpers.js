import defaultsDeep from 'lodash.defaultsdeep';
import {removeColorScheme, setColorScheme} from 'mdui';
import {syncThemeColorMeta} from '../mdui-theme';
import {ACCENT_MAP, ACCENT_SEED_COLORS} from '.';
import AddonHooks from '../../addons/hooks';
import './global-styles.css';

const BLOCK_COLOR_NAMES = [
    // Corresponds to the name of the object in blockColors
    'motion',
    'looks',
    'sounds',
    'control',
    'event',
    'sensing',
    'pen',
    'operators',
    'data',
    'data_lists',
    'more',
    'addons'
];

/**
 * Resolve the current value of an mdui design token as a full CSS color.
 * --mdui-color-* hold comma-separated RGB components, so they are wrapped in
 * rgb() (optionally with an alpha channel).
 * @param {string} name CSS custom property name, e.g. '--mdui-color-primary'
 * @param {number} [alpha] optional alpha channel (0..1)
 * @param {string} [fallback] color used when the token is unavailable
 * @returns {string} full CSS color
 */
const mduiColor = (name, alpha, fallback) => {
    try {
        const parts = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        if (parts) {
            return typeof alpha === 'number' ? `rgb(${parts}, ${alpha})` : `rgb(${parts})`;
        }
    } catch (e) {
        // ignore, fall through
    }
    return fallback;
};

const isThemeDark = () => {
    if (typeof document === 'undefined') return false;
    const doc = document.documentElement;
    if (doc.classList.contains('mdui-theme-dark')) return true;
    if (doc.classList.contains('mdui-theme-light')) return false;
    return typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Build the legacy --ui-* color table from the mdui (MD3) design tokens, so
 * the remaining scratch-gui chrome and addons follow the mdui light/dark
 * theme. Block category colors are fixed legacy palette values — mdui does
 * not theme blocks, and the accent color overrides the relevant entries.
 * @returns {object} gui color table (keys map to --<key> CSS variables)
 */
const mduiGuiColors = () => {
    const isDark = isThemeDark();
    const surface = mduiColor('--mdui-color-surface', null, '#ffffff');
    const onSurface = mduiColor('--mdui-color-on-surface', null, '#1c1b1f');
    const surfaceLow = mduiColor('--mdui-color-surface-container-low', null, surface);
    const surfaceContainer = mduiColor('--mdui-color-surface-container', null, surface);
    const surfaceHigh = mduiColor('--mdui-color-surface-container-high', null, surface);
    const primary = mduiColor('--mdui-color-primary', null, '#6750a4');
    const onPrimary = mduiColor('--mdui-color-on-primary', null, '#ffffff');
    const outline = mduiColor('--mdui-color-outline', null, '#79747e');
    const outlineVariant = mduiColor('--mdui-color-outline-variant', null, '#cac4d0');

    return {
        'color-scheme': isDark ? 'dark' : 'light',

        'ui-primary': surfaceLow,
        'ui-secondary': surfaceContainer,
        'ui-tertiary': surfaceHigh,
        'ui-border': outlineVariant,
        'ui-hover': mduiColor('--mdui-color-primary', 0.12, 'rgba(255, 107, 53, 0.12)'),

        'ui-modal-overlay': mduiColor('--mdui-color-scrim', 0.4, 'rgba(0, 0, 0, 0.4)'),
        'ui-modal-background': surfaceLow,
        'ui-modal-foreground': onSurface,
        'ui-modal-header-background': primary,
        'ui-modal-header-foreground': onPrimary,

        'ui-white': surface,
        'ui-white-dim': mduiColor('--mdui-color-surface', 0.75, surface),
        'ui-white-transparent': mduiColor('--mdui-color-surface', 0.25, surface),
        'ui-transparent': 'transparent',

        'ui-black-transparent': mduiColor('--mdui-color-outline', 0.15, outline),

        'text-primary': onSurface,
        'text-primary-transparent': mduiColor('--mdui-color-on-surface', 0.75, onSurface),

        // Block category colors — fixed legacy palette, not part of the mdui
        // color system. The accent color overrides motion/looks/extensions.
        'motion-primary': 'hsla(215, 100%, 65%, 1)',
        'motion-primary-transparent': 'hsla(215, 100%, 65%, 0.9)',
        'motion-tertiary': 'hsla(215, 60%, 50%, 1)',

        'red-primary': 'hsla(20, 100%, 55%, 1)',
        'red-tertiary': 'hsla(20, 100%, 45%, 1)',

        'sound-primary': 'hsla(300, 53%, 60%, 1)',
        'sound-tertiary': 'hsla(300, 48%, 50%, 1)',

        'control-primary': 'hsla(38, 100%, 55%, 1)',

        'data-primary': 'hsla(30, 100%, 55%, 1)',

        'pen-primary': 'hsla(163, 85%, 40%, 1)',
        'pen-transparent': 'hsla(163, 85%, 40%, 0.25)',
        'pen-tertiary': 'hsla(163, 86%, 30%, 1)',

        'error-primary': 'hsla(30, 100%, 55%, 1)',
        'error-light': 'hsla(30, 100%, 70%, 1)',
        'error-transparent': 'hsla(30, 100%, 55%, 0.25)',

        'drop-highlight': 'hsla(215, 100%, 77%, 1)',

        'menu-bar-background': surfaceContainer,
        'menu-bar-background-image': 'none',
        'menu-bar-foreground': onSurface,

        'assets-background': surface,

        'input-background': surfaceLow,

        'popover-background': surfaceContainer,

        'shadow': 'hsla(0, 0%, 0%, 0.15)',

        'badge-background': surfaceHigh,
        'badge-border': outlineVariant,

        'fullscreen-background': surface,
        'fullscreen-accent': surfaceHigh,

        'page-background': surface,
        'page-foreground': onSurface,

        'project-title-inactive': mduiColor('--mdui-color-on-surface', 0.25, onSurface),
        'project-title-hover': mduiColor('--mdui-color-on-surface', 0.5, onSurface),

        'link-color': primary,

        'filter-icon-black': 'none',
        'filter-icon-gray': 'grayscale(100%)',
        'filter-icon-white': 'none',

        'paint-ui-pane-border': 'var(--ui-black-transparent)',
        'paint-text-primary': 'var(--text-primary)',
        'paint-form-border': 'var(--ui-black-transparent)',
        'paint-looks-secondary': 'var(--looks-secondary)',
        'paint-looks-transparent': 'var(--looks-transparent)',
        'paint-input-background': 'var(--input-background)',
        'paint-popover-background': 'var(--popover-background)',
        'paint-filter-icon-gray': 'none'
    };
};

/**
 * @param {Theme} theme the theme
 */
const applyGuiColors = theme => {
    const doc = document.documentElement;

    // Apply the accent theme to mdui's Material 3 dynamic color system
    if (typeof document !== 'undefined') {
        const seedColor = ACCENT_SEED_COLORS && ACCENT_SEED_COLORS[theme.accent];
        if (seedColor) {
            setColorScheme(seedColor);
        } else {
            removeColorScheme();
        }
    }

    // The legacy GUI theme layer is retired: the --ui-* variables are now
    // driven by the mdui tokens, with the accent color layered on top for the
    // block category colors that mdui does not own.
    const guiColors = defaultsDeep({}, ACCENT_MAP[theme.accent].guiColors, mduiGuiColors());
    for (const [name, value] of Object.entries(guiColors)) {
        doc.style.setProperty(`--${name}-default`, value);
    }
    for (const [name, value] of Object.entries(guiColors)) {
        doc.style.setProperty(`--${name}`, value);
    }

    const blockColors = theme.getBlockColors();
    doc.style.setProperty('--editorTheme3-blockText', blockColors.text);
    doc.style.setProperty('--editorTheme3-inputColor', blockColors.textField);
    doc.style.setProperty('--editorTheme3-inputColor-text', blockColors.textFieldText);
    for (const color of BLOCK_COLOR_NAMES) {
        doc.style.setProperty(`--editorTheme3-${color}-primary`, blockColors[color].primary);
        doc.style.setProperty(`--editorTheme3-${color}-secondary`, blockColors[color].secondary);
        doc.style.setProperty(`--editorTheme3-${color}-tertiary`, blockColors[color].tertiary);
        doc.style.setProperty(`--editorTheme3-${color}-field-background`, blockColors[color].quaternary);
    }

    // Pass MD3 background colors to ScratchBlocks if available
    const surfaceLow = mduiColor('--mdui-color-surface-container-low', null, null);
    const surfaceVal = mduiColor('--mdui-color-surface', null, null);
    if (surfaceLow) {
        doc.style.setProperty('--blockly-flyout-background', surfaceLow);
        doc.style.setProperty('--blockly-toolbox-background', surfaceLow);
    }
    if (surfaceVal) {
        doc.style.setProperty('--blockly-main-background', surfaceVal);
    }

    doc.setAttribute('data-gui', theme.isDark() ? 'dark' : 'light');

    // Some browsers will color their interfaces to match theme-color, so if we make it the same color as our
    // menu bar (or current surface-container), it'll look pretty cool.
    // Delegate to the single writer of <meta name="theme-color"> in
    // lib/mdui-theme so both call sites cannot fight over the tag. It reads
    // --mdui-color-surface-container and falls back to --menu-bar-background,
    // which was just applied to :root above.
    syncThemeColorMeta();

    // a horrible hack for icons...
    // Surge Editor (mdui): recolor icons with the current MD3 primary instead
    // of the legacy accent color. The SVG data URIs cannot resolve CSS custom
    // properties, so resolve the component value lazily via a getter: tw-recolor
    // reads `Recolor.primary` every time an icon renders, and the mdui tokens
    // are only guaranteed to exist after the mdui styles are injected. Falls
    // back to the accent color when the token is unavailable (e.g. pages that
    // do not run the mdui bootstrap).
    window.Recolor = {
        get primary () {
            try {
                const parts = getComputedStyle(document.documentElement)
                    .getPropertyValue('--mdui-color-primary')
                    .trim();
                if (parts) return `rgb(${parts})`;
            } catch (e) {
                // ignore, fall through
            }
            return guiColors['looks-secondary'];
        }
    };
    AddonHooks.recolorCallbacks.forEach(i => i());
};

export {
    applyGuiColors
};
