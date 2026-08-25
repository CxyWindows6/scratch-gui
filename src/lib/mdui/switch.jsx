import 'mdui/components/switch.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

const MduiSwitch = makeMduiComponent('mdui-switch', {
    displayName: 'MduiSwitch',
    events: {
        onChange: 'change',
        onInput: 'input'
    },
    propTypes: {
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        uncheckedIcon: PropTypes.string,
        checkedIcon: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string
    }
});

export default MduiSwitch;
