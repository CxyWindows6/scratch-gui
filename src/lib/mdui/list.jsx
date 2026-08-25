import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/list-subheader.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-list: no custom events.
const MduiList = makeMduiComponent('mdui-list', {
    displayName: 'MduiList',
    propTypes: {
        selectable: PropTypes.bool
    }
});

// mdui-list-item: no custom events (click is a standard DOM event).
const MduiListItem = makeMduiComponent('mdui-list-item', {
    displayName: 'MduiListItem',
    propTypes: {
        icon: PropTypes.string,
        endIcon: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        disabled: PropTypes.bool,
        selected: PropTypes.bool,
        href: PropTypes.string,
        value: PropTypes.string
    }
});

// mdui-list-subheader: no custom events.
const MduiListSubheader = makeMduiComponent('mdui-list-subheader', {
    displayName: 'MduiListSubheader',
    propTypes: {
        icon: PropTypes.string
    }
});

export {MduiList, MduiListItem, MduiListSubheader};
export default MduiList;
