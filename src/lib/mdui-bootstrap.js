// Global entry point for the mdui (Material Design 3 / Web Components) UI library.
// Import this module exactly once, before any mdui component is used.
// - mdui/mdui.css : global design tokens & base styles (loaded as plain CSS, not CSS Modules)
// - mdui          : registers every mdui custom element (dev convenience; T2 wrappers will
//                    switch to per-component imports if needed)
// - @material-symbols/font-400/rounded.css : Material Symbols icon font used by <mdui-icon>
import 'mdui/mdui.css';
import 'mdui';
import '@material-symbols/font-400/rounded.css';
