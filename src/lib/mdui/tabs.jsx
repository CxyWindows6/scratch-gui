import 'mdui/components/tabs.js';
import 'mdui/components/tab.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-tabs: emits 'change' when the active tab changes.
const MduiTabs = makeMduiComponent('mdui-tabs', {
    displayName: 'MduiTabs',
    events: {
        onChange: 'change'
    },
    propTypes: {
        value: PropTypes.string,
        disabled: PropTypes.bool,
        fullWidth: PropTypes.bool
    }
});

// mdui-tab: no custom events.
const MduiTab = makeMduiComponent('mdui-tab', {
    displayName: 'MduiTab',
    propTypes: {
        value: PropTypes.string,
        icon: PropTypes.string,
        disabled: PropTypes.bool
    }
});

export {MduiTabs, MduiTab};
export default MduiTabs;
