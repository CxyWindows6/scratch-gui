import 'mdui/components/text-field.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

const MduiTextField = makeMduiComponent('mdui-text-field', {
    displayName: 'MduiTextField',
    events: {
        onChange: 'change',
        onInput: 'input',
        onClear: 'clear'
    },
    propTypes: {
        variant: PropTypes.oneOf(['filled', 'outlined']),
        type: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool,
        readonly: PropTypes.bool,
        required: PropTypes.bool,
        clearable: PropTypes.bool,
        icon: PropTypes.string,
        endIcon: PropTypes.string,
        maxlength: PropTypes.number,
        minlength: PropTypes.number
    }
});

export default MduiTextField;
