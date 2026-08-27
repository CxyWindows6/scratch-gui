import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/list-subheader.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-list: no custom events.
const MduiList = makeMduiComponent('mdui-list', {
    displayName: 'MduiList'
});

// mdui-list-item: no custom events (click is a standard DOM event).
const MduiListItem = makeMduiComponent('mdui-list-item', {
    displayName: 'MduiListItem',
    propTypes: {
        headline: PropTypes.string,
        headlineLine: PropTypes.oneOf([1, 2, 3]),
        description: PropTypes.string,
        descriptionLine: PropTypes.oneOf([1, 2, 3]),
        icon: PropTypes.string,
        endIcon: PropTypes.string,
        disabled: PropTypes.bool,
        active: PropTypes.bool,
        nonclickable: PropTypes.bool,
        rounded: PropTypes.bool,
        alignment: PropTypes.oneOf(['start', 'center', 'end']),
        href: PropTypes.string,
        download: PropTypes.string,
        target: PropTypes.string,
        rel: PropTypes.string,
        autofocus: PropTypes.bool,
        tabIndex: PropTypes.number
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
