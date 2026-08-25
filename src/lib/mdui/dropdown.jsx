import 'mdui/components/dropdown.js';
import makeMduiComponent from './make-component';

const MduiDropdown = makeMduiComponent('mdui-dropdown', {
    displayName: 'MduiDropdown',
    events: {
        onOpen: 'open',
        onOpened: 'opened',
        onClose: 'close',
        onClosed: 'closed'
    }
});

export default MduiDropdown;
