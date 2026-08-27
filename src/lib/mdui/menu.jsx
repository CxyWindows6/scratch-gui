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
        selects: PropTypes.oneOf(['single', 'multiple']),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        dense: PropTypes.bool,
        submenuTrigger: PropTypes.string,
        submenuOpenDelay: PropTypes.number,
        submenuCloseDelay: PropTypes.number,
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
        endText: PropTypes.string,
        selectedIcon: PropTypes.string,
        submenuOpen: PropTypes.bool,
        value: PropTypes.string,
        disabled: PropTypes.bool,
        href: PropTypes.string,
        download: PropTypes.string,
        target: PropTypes.string,
        rel: PropTypes.string,
        autofocus: PropTypes.bool,
        tabIndex: PropTypes.number
    }
});

export {MduiMenu, MduiMenuItem};
export default MduiMenu;
