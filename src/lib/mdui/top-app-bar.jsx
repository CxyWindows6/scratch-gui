import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-top-app-bar: emits show/shown/hide/hidden lifecycle events.
const MduiTopAppBar = makeMduiComponent('mdui-top-app-bar', {
    displayName: 'MduiTopAppBar',
    events: {
        onShow: 'show',
        onShown: 'shown',
        onHide: 'hide',
        onHidden: 'hidden'
    },
    propTypes: {
        scrollTarget: PropTypes.string,
        order: PropTypes.number
    }
});

// mdui-top-app-bar-title: no custom events.
const MduiTopAppBarTitle = makeMduiComponent('mdui-top-app-bar-title', {
    displayName: 'MduiTopAppBarTitle'
});

export {MduiTopAppBar, MduiTopAppBarTitle};
export default MduiTopAppBar;
