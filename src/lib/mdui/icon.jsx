import 'mdui/components/icon.js';
import PropTypes from 'prop-types';
import makeMduiComponent from './make-component';

// mdui-icon: no custom events.
const MduiIcon = makeMduiComponent('mdui-icon', {
    displayName: 'MduiIcon',
    propTypes: {
        name: PropTypes.string,
        src: PropTypes.string
    }
});

export default MduiIcon;
