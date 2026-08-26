import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import bindAll from 'lodash.bindall';

import {
    getSurgeThemeMode,
    setSurgeThemeMode
} from '../../lib/mdui-theme/index.js';
import styles from './settings-menu.css';

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

const ThemeModeMenuItem = props => {
    const handleClick = React.useCallback(() => {
        props.onSelect(props.mode);
    }, [props.onSelect, props.mode]);

    return (
        <mdui-menu-item
            onClick={handleClick}
            selected={props.isSelected}
        >
            <div className={styles.option}>
                <span
                    className={styles.check}
                    style={{visibility: props.isSelected ? 'visible' : 'hidden'}}
                >
                    <mdui-icon name="check" />
                </span>
                <span className={styles.optionIcon}>
                    <mdui-icon name={MODE_ICONS[props.mode]} />
                </span>
                <FormattedMessage {...messages[props.mode]} />
            </div>
        </mdui-menu-item>
    );
};

ThemeModeMenuItem.propTypes = {
    isSelected: PropTypes.bool,
    mode: PropTypes.oneOf(['light', 'dark', 'auto']).isRequired,
    onSelect: PropTypes.func.isRequired
};

class SurgeThemeMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelectMode',
            'handleToggleSubmenu',
            'handleSubmenuOpened',
            'handleSubmenuClosed'
        ]);
        this.itemRef = React.createRef();
        this.state = {
            current: getSurgeThemeMode()
        };
    }
    componentDidMount () {
        this.bindSubmenuEvents();
    }
    componentDidUpdate (prevProps) {
        if (this.itemRef.current && prevProps.isOpen !== this.props.isOpen) {
            this.itemRef.current.submenuOpen = this.props.isOpen;
        }
        this.bindSubmenuEvents();
    }
    componentWillUnmount () {
        const element = this.itemRef.current;
        if (element && element.dataset.mduiSubmenuBound) {
            delete element.dataset.mduiSubmenuBound;
            element.removeEventListener('submenu-opened', this.handleSubmenuOpened);
            element.removeEventListener('submenu-closed', this.handleSubmenuClosed);
        }
    }
    bindSubmenuEvents () {
        const element = this.itemRef.current;
        if (element && !element.dataset.mduiSubmenuBound) {
            element.dataset.mduiSubmenuBound = 'true';
            element.addEventListener('submenu-opened', this.handleSubmenuOpened);
            element.addEventListener('submenu-closed', this.handleSubmenuClosed);
        }
    }
    // mdui only toggles a submenu when the click target is the menu-item host;
    // clicks on custom slot content need a manual toggle.
    handleToggleSubmenu () {
        const element = this.itemRef.current;
        if (element) element.submenuOpen = !element.submenuOpen;
    }
    handleSubmenuOpened () {
        if (!this.props.isOpen && this.props.onOpenMenu) this.props.onOpenMenu();
    }
    handleSubmenuClosed () {
        if (this.props.isOpen && this.props.onCloseMenu) this.props.onCloseMenu();
    }
    handleSelectMode (mode) {
        setSurgeThemeMode(mode);
        this.setState({current: getSurgeThemeMode()});
        if (this.props.onRequestCloseSettings) this.props.onRequestCloseSettings();
    }
    render () {
        return (
            <mdui-menu-item ref={this.itemRef}>
                <div
                    className={styles.option}
                    slot="custom"
                    onClick={this.handleToggleSubmenu}
                >
                    <span className={styles.optionIcon}>
                        <mdui-icon name="palette" />
                    </span>
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Interface theme"
                            description="Label for menu to choose UI theme mode (light / dark / auto)"
                            id="tw.menuBar.themeMode"
                        />
                        {' '}
                        {'('}
                        <FormattedMessage {...messages[this.state.current]} />
                        {')'}
                    </span>
                    <span className={styles.expandCaret}>
                        <mdui-icon name="chevron_right" />
                    </span>
                </div>
                <mdui-menu slot="submenu">
                    {['light', 'dark', 'auto'].map(mode => (
                        <ThemeModeMenuItem
                            key={mode}
                            mode={mode}
                            isSelected={this.state.current === mode}
                            onSelect={this.handleSelectMode}
                        />
                    ))}
                </mdui-menu>
            </mdui-menu-item>
        );
    }
}

SurgeThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    onCloseMenu: PropTypes.func,
    onOpenMenu: PropTypes.func,
    onRequestCloseSettings: PropTypes.func
};

export default SurgeThemeMenu;
