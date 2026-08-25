import 'mdui/components/menu.js';
import 'mdui/components/menu-item.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-menu: emits 'change' when the selected menu item changes.
const MduiMenu = makeMduiComponent('mdui-menu', {
    displayName: 'MduiMenu',
    events: {
        onChange: 'change'
    },
    propTypes: {
        open: PropTypes.bool,
        selectable: PropTypes.bool,
        value: PropTypes.string,
        disabled: PropTypes.bool
    }
});

// mdui-menu-item: no custom events (click is a standard DOM event).
const MduiMenuItem = makeMduiComponent('mdui-menu-item', {
    displayName: 'MduiMenuItem',
    propTypes: {
        icon: PropTypes.string,
        endIcon: PropTypes.string,
        value: PropTypes.string,
        disabled: PropTypes.bool,
        selected: PropTypes.bool,
        href: PropTypes.string
    }
});

export {MduiMenu, MduiMenuItem};
export default MduiMenu;
