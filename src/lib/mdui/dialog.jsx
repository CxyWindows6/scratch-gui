import 'mdui/components/dialog.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

const MduiDialog = makeMduiComponent('mdui-dialog', {
    displayName: 'MduiDialog',
    events: {
        onOpen: 'open',
        onOpened: 'opened',
        onClose: 'close',
        onClosed: 'closed',
        onOverlayClick: 'overlay-click'
    },
    propTypes: {
        open: PropTypes.bool,
        fullscreen: PropTypes.bool,
        icon: PropTypes.string,
        headline: PropTypes.string,
        description: PropTypes.string,
        closeOnEsc: PropTypes.bool,
        closeOnOverlayClick: PropTypes.bool,
        stackedActions: PropTypes.bool
    }
});

export default MduiDialog;
