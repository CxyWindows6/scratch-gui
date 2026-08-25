import 'mdui/components/select.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

const MduiSelect = makeMduiComponent('mdui-select', {
    displayName: 'MduiSelect',
    events: {
        onChange: 'change',
        onClear: 'clear'
    },
    propTypes: {
        variant: PropTypes.oneOf(['filled', 'outlined']),
        value: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool,
        readonly: PropTypes.bool,
        required: PropTypes.bool,
        clearable: PropTypes.bool,
        icon: PropTypes.string
    }
});

export default MduiSelect;
