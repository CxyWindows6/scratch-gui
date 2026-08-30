import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import bindAll from 'lodash.bindall';

import {MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {
    getSurgeThemeMode,
    setSurgeThemeMode
} from '../../lib/mdui-theme/index.js';

const messages = defineMessages({
    light: {
        defaultMessage: 'Light',
        description: 'Label for the light theme mode option',
        id: 'tw.menuBar.themeMode.light'
    },
    dark: {
        defaultMessage: 'Dark',
        description: 'Label for the dark theme mode option',
        id: 'tw.menuBar.themeMode.dark'
    },
    auto: {
        defaultMessage: 'Auto (follow system)',
        description: 'Label for the auto theme mode option that follows the system setting',
        id: 'tw.menuBar.themeMode.auto'
    }
});

const MODE_ICONS = {
    light: 'light_mode',
    dark: 'dark_mode',
    auto: 'brightness_auto'
};

const MODES = ['light', 'dark', 'auto'];

const ThemeModeMenuItem = props => (
    <MduiMenuItem
        icon={MODE_ICONS[props.mode]}
        value={props.mode}
        selectedIcon="check"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => props.onSelect(props.mode)}
    >
        <FormattedMessage {...messages[props.mode]} />
    </MduiMenuItem>
);

ThemeModeMenuItem.propTypes = {
    mode: PropTypes.oneOf(MODES).isRequired,
    onSelect: PropTypes.func.isRequired
};

class SurgeThemeMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelectMode'
        ]);
        this.state = {
            current: getSurgeThemeMode()
        };
    }
    handleSelectMode (mode) {
        setSurgeThemeMode(mode);
        this.setState({current: getSurgeThemeMode()});
        if (this.props.onRequestCloseSettings) this.props.onRequestCloseSettings();
    }
    render () {
        return (
            <MduiMenuItem icon={MODE_ICONS[this.state.current]}>
                <FormattedMessage
                    defaultMessage="Interface theme"
                    description="Label for menu to choose UI theme mode (light / dark / auto)"
                    id="tw.menuBar.themeMode"
                />
                {/* D4: current value as secondary end-text instead of hardcoded
                    parentheses in the label. mdui styles the end-text slot as
                    on-surface-variant secondary text. */}
                <span slot="end-text">
                    <FormattedMessage {...messages[this.state.current]} />
                </span>
                <MduiMenu
                    slot="submenu"
                    submenuTrigger="click"
                    selects="single"
                    value={this.state.current}
                >
                    {MODES.map(mode => (
                        <ThemeModeMenuItem
                            key={mode}
                            mode={mode}
                            onSelect={this.handleSelectMode}
                        />
                    ))}
                </MduiMenu>
            </MduiMenuItem>
        );
    }
}

SurgeThemeMenu.propTypes = {
    onRequestCloseSettings: PropTypes.func
};

export default SurgeThemeMenu;
