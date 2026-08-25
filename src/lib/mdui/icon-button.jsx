import 'mdui/components/button-icon.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-icon-button: no custom events (click/focus/blur are standard DOM events).
const MduiIconButton = makeMduiComponent('mdui-icon-button', {
    displayName: 'MduiIconButton',
    propTypes: {
        icon: PropTypes.string,
        selected: PropTypes.bool,
        disabled: PropTypes.bool,
        loading: PropTypes.bool
    }
});

export default MduiIconButton;
