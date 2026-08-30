// Global entry point for the mdui (Material Design 3 / Web Components) UI library.
// Import this module exactly once, before any mdui component is used.
// - mdui/mdui.css : global design tokens & base styles (loaded as plain CSS, not CSS Modules)
// - mdui          : registers every mdui custom element (dev convenience; T2 wrappers will
//                    switch to per-component imports if needed)
// - @material-symbols/font-400/rounded.css : Material Symbols icon font used by <mdui-icon>
// - mdui locale packs: registered with loadLocale so mdui built-in strings follow the app locale
import 'mdui/mdui.css';
import 'mdui';
import '@material-symbols/font-400/rounded.css';
import {loadLocale} from 'mdui/functions/loadLocale.js';
import * as localeZhCn from 'mdui/locales/zh-cn.js';
import * as localeZhTw from 'mdui/locales/zh-tw.js';

const localizedTemplates = new Map([
    ['zh-cn', localeZhCn],
    ['zh-tw', localeZhTw]
]);
loadLocale(locale => Promise.resolve(localizedTemplates.get(locale)));
