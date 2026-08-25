import 'mdui/components/checkbox.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-checkbox: emits 'change' and 'input' when checked state changes.
const MduiCheckbox = makeMduiComponent('mdui-checkbox', {
    displayName: 'MduiCheckbox',
    events: {
        onChange: 'change',
        onInput: 'input'
    },
    propTypes: {
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        value: PropTypes.string
    }
});

export default MduiCheckbox;
