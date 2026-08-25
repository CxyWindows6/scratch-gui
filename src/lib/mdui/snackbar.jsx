import 'mdui/components/snackbar.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-snackbar: emits open/opened/close/closed lifecycle events and
// 'action-click' when the action button is clicked.
const MduiSnackbar = makeMduiComponent('mdui-snackbar', {
    displayName: 'MduiSnackbar',
    events: {
        onOpen: 'open',
        onOpened: 'opened',
        onClose: 'close',
        onClosed: 'closed',
        onActionClick: 'action-click'
    },
    propTypes: {
        open: PropTypes.bool,
        placement: PropTypes.oneOf([
            'top',
            'top-start',
            'top-end',
            'bottom',
            'bottom-start',
            'bottom-end'
        ]),
        action: PropTypes.string,
        actionLoading: PropTypes.bool,
        closeable: PropTypes.bool,
        closeIcon: PropTypes.string,
        messageLine: PropTypes.number,
        autoCloseDelay: PropTypes.number,
        closeOnOutsideClick: PropTypes.bool
    }
});

export default MduiSnackbar;
