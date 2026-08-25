import 'mdui/components/tooltip.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-tooltip: emits open/opened/close/closed lifecycle events.
const MduiTooltip = makeMduiComponent('mdui-tooltip', {
    displayName: 'MduiTooltip',
    events: {
        onOpen: 'open',
        onOpened: 'opened',
        onClose: 'close',
        onClosed: 'closed'
    },
    propTypes: {
        content: PropTypes.string,
        placement: PropTypes.string,
        trigger: PropTypes.string,
        disabled: PropTypes.bool
    }
});

export default MduiTooltip;
