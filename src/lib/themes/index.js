import defaultsDeep from 'lodash.defaultsdeep';

import * as accentPurple from './accent/purple';
import * as accentBlue from './accent/blue';
import * as accentRed from './accent/red';
import * as accentRainbow from './accent/rainbow';
import * as accentGray from './accent/gray';
import * as accentOrange from './accent/orange';

import * as blocksThree from './blocks/three';
import * as blocksHighContrast from './blocks/high-contrast';
import * as blocksDark from './blocks/dark';

const ACCENT_PURPLE = 'purple';
const ACCENT_BLUE = 'blue';
const ACCENT_RED = 'red';
const ACCENT_GRAY = 'gray';
const ACCENT_RAINBOW = 'rainbow';
const ACCENT_ORANGE = 'orange';
const ACCENT_MAP = {
    [ACCENT_PURPLE]: accentPurple,
    [ACCENT_BLUE]: accentBlue,
    [ACCENT_RED]: accentRed,
    [ACCENT_GRAY]: accentGray,
    [ACCENT_RAINBOW]: accentRainbow,
    [ACCENT_ORANGE]: accentOrange
};
const ACCENT_DEFAULT = ACCENT_RED;

const BLOCKS_THREE = 'three';
const BLOCKS_DARK = 'dark';
const BLOCKS_HIGH_CONTRAST = 'high-contrast';
const BLOCKS_CUSTOM = 'custom';
const BLOCKS_DEFAULT = BLOCKS_THREE;
const defaultBlockColors = blocksThree.blockColors;
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksThree.blockColors,
        extensions: blocksThree.extensions,
        customExtensionColors: {},
        useForStage: true
    },
    [BLOCKS_HIGH_CONTRAST]: {
        blocksMediaFolder: 'blocks-media/high-contrast',
        colors: defaultsDeep({}, blocksHighContrast.blockColors, defaultBlockColors),
        extensions: blocksHighContrast.extensions,
        customExtensionColors: blocksHighContrast.customExtensionColors,
        useForStage: true
    },
    [BLOCKS_DARK]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: defaultsDeep({}, blocksDark.blockColors, defaultBlockColors),
        extensions: blocksDark.extensions,
        customExtensionColors: blocksDark.customExtensionColors,
        useForStage: false
    },
    [BLOCKS_CUSTOM]: {
        // to be filled by editor-theme3 addon
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksThree.blockColors,
        extensions: {},
        customExtensionColors: {},
        useForStage: false
    }
};

let themeObjectsCreated = 0;

// Surge Editor (mdui): the legacy GUI theme layer (light/dark/midnight/ember)
// was retired — mdui's own light/dark/auto theme drives the interface chrome.
// The theme object now only carries the accent color and the block palette.
class Theme {
    constructor (accent, blocks) {
        // do not modify these directly
        /** @readonly */
        this.id = ++themeObjectsCreated;
        /** @readonly */
        this.accent = Object.prototype.hasOwnProperty.call(ACCENT_MAP, accent) ? accent : ACCENT_DEFAULT;
        /** @readonly */
        this.blocks = Object.prototype.hasOwnProperty.call(BLOCKS_MAP, blocks) ? blocks : BLOCKS_DEFAULT;
    }

    static light = new Theme(ACCENT_DEFAULT, BLOCKS_DEFAULT);
    static highContrast = new Theme(ACCENT_DEFAULT, BLOCKS_HIGH_CONTRAST);

    set (what, to) {
        if (what === 'accent') {
            return new Theme(to, this.blocks);
        } else if (what === 'blocks') {
            return new Theme(this.accent, to);
        }
        throw new Error(`Unknown theme property: ${what}`);
    }

    getBlocksMediaFolder () {
        return BLOCKS_MAP[this.blocks].blocksMediaFolder;
    }

    // Accent-driven color overrides for legacy UI variables that are not part
    // of the mdui color system (block category colors, highlight colors, ...).
    getGuiColors () {
        return ACCENT_MAP[this.accent].guiColors;
    }

    getBlockColors () {
        return defaultsDeep(
            {},
            ACCENT_MAP[this.accent].blockColors,
            BLOCKS_MAP[this.blocks].colors
        );
    }

    getExtensions () {
        return BLOCKS_MAP[this.blocks].extensions;
    }

    // The GUI theme layer is gone: dark mode now belongs to mdui, which
    // applies the `mdui-theme-dark` class on <html>.
    isDark () {
        return document.documentElement.classList.contains('mdui-theme-dark');
    }

    getStageBlockColors () {
        if (BLOCKS_MAP[this.blocks].useForStage) {
            return this.getBlockColors();
        }
        return defaultsDeep(
            {},
            ACCENT_MAP[this.accent].blockColors,
            defaultBlockColors
        );
    }

    getCustomExtensionColors () {
        return BLOCKS_MAP[this.blocks].customExtensionColors;
    }
}

export {
    Theme,
    defaultBlockColors,

    ACCENT_RED,
    ACCENT_GRAY,
    ACCENT_PURPLE,
    ACCENT_BLUE,
    ACCENT_RAINBOW,
    ACCENT_ORANGE,
    ACCENT_MAP,

    BLOCKS_THREE,
    BLOCKS_DARK,
    BLOCKS_HIGH_CONTRAST,
    BLOCKS_CUSTOM,
    BLOCKS_MAP
};
