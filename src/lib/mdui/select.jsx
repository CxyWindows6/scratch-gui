import 'mdui/components/select.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

const MduiSelect = makeMduiComponent('mdui-select', {
    displayName: 'MduiSelect',
    events: {
        onChange: 'change',
        onClear: 'clear',
        onOpen: 'open',
        onOpened: 'opened',
        onClose: 'close',
        onClosed: 'closed'
    },
    propTypes: {
        variant: PropTypes.oneOf(['filled', 'outlined']),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        label: PropTypes.string,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool,
        readonly: PropTypes.bool,
        required: PropTypes.bool,
        clearable: PropTypes.bool,
        multiple: PropTypes.bool,
        icon: PropTypes.string
    }
});

export default MduiSelect;
