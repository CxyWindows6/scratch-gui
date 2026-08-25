import 'mdui/components/button-icon.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-icon-button (custom element: <mdui-button-icon>): emits 'change' when selectable
const MduiIconButton = makeMduiComponent('mdui-button-icon', {
    displayName: 'MduiIconButton',
    events: {
        onChange: 'change'
    },
    propTypes: {
        icon: PropTypes.string,
        selectedIcon: PropTypes.string,
        selected: PropTypes.bool,
        selectable: PropTypes.bool,
        disabled: PropTypes.bool,
        loading: PropTypes.bool,
        variant: PropTypes.oneOf(['standard', 'filled', 'tonal', 'outlined'])
    }
});

export default MduiIconButton;
