import 'mdui/components/radio.js';
import 'mdui/components/radio-group.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-radio: emits 'change' when selected state changes.
const MduiRadio = makeMduiComponent('mdui-radio', {
    displayName: 'MduiRadio',
    events: {
        onChange: 'change'
    },
    propTypes: {
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        value: PropTypes.string
    }
});

// mdui-radio-group: emits 'change' and 'input' when the selected value changes.
const MduiRadioGroup = makeMduiComponent('mdui-radio-group', {
    displayName: 'MduiRadioGroup',
    events: {
        onChange: 'change',
        onInput: 'input'
    },
    propTypes: {
        value: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool
    }
});

export {MduiRadio, MduiRadioGroup};
export default MduiRadioGroup;
