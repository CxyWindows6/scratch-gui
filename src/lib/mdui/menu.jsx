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
        selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        disabled: PropTypes.bool
    }
});

// mdui-menu-item: emits submenu lifecycle events
const MduiMenuItem = makeMduiComponent('mdui-menu-item', {
    displayName: 'MduiMenuItem',
    events: {
        onSubmenuOpen: 'submenu-open',
        onSubmenuOpened: 'submenu-opened',
        onSubmenuClose: 'submenu-close',
        onSubmenuClosed: 'submenu-closed'
    },
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
