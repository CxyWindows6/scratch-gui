import 'mdui/components/button.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-button: no custom events (click/focus/blur are standard DOM events).
const MduiButton = makeMduiComponent('mdui-button', {
    displayName: 'MduiButton',
    propTypes: {
        variant: PropTypes.oneOf(['elevated', 'filled', 'tonal', 'outlined', 'text']),
        fullWidth: PropTypes.bool,
        icon: PropTypes.string,
        endIcon: PropTypes.string,
        href: PropTypes.string,
        disabled: PropTypes.bool,
        loading: PropTypes.bool
    }
});

export default MduiButton;
