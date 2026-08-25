import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import bindAll from 'lodash.bindall';

import LanguageMenu from './language-menu.jsx';
import TWAccentThemeMenu from './tw-theme-accent.jsx';
import TWBlocksThemeMenu from './tw-theme-blocks.jsx';
import TWSurgeThemeMenu from './tw-surge-theme.jsx';
import TWDesktopSettings from './tw-desktop-settings.jsx';
import TWMenuBarAlignmentMenu from './tw-menu-bar-alignment.jsx';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

class SettingsMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOpened',
            'handleClosed',
            'setDropdownRef'
        ]);
        this.dropdownRef = null;
    }
    componentDidMount () {
        this.bindDropdown();
    }
    componentDidUpdate (prevProps) {
        if (this.dropdownRef && prevProps.settingsMenuOpen !== this.props.settingsMenuOpen) {
            this.dropdownRef.open = this.props.settingsMenuOpen;
        }
        this.bindDropdown();
    }
    // mdui custom events (opened/closed) cannot be bound via React props, so we
    // bind them directly on the custom element to sync the Redux open state.
    bindDropdown () {
        const element = this.dropdownRef;
        if (element && !element.dataset.mduiMenuBarBound) {
            element.dataset.mduiMenuBarBound = 'true';
            element.addEventListener('opened', this.handleOpened);
            element.addEventListener('closed', this.handleClosed);
        }
    }
    handleOpened () {
        if (!this.props.settingsMenuOpen) this.props.onRequestOpen();
    }
    handleClosed () {
        if (this.props.settingsMenuOpen) this.props.onRequestClose();
    }
    setDropdownRef (element) {
        this.dropdownRef = element;
    }
    render () {
        const {
            canChangeLanguage,
            canChangeTheme,
            isRtl,
            onClickDesktopSettings,
            onOpenCustomSettings
        } = this.props;
        return (
            <mdui-dropdown
                ref={this.setDropdownRef}
                placement={isRtl ? 'bottom-end' : 'bottom-start'}
            >
                <mdui-button
                    slot="trigger"
                    variant="text"
                    icon="settings"
                    className={menuBarStyles.menuBarItem}
                >
                    <span className={styles.dropdownLabel}>
                        <FormattedMessage
                            defaultMessage="设置"
                            description="Settings menu"
                            id="gui.menuBar.settings"
                        />
                    </span>
                </mdui-button>
                <mdui-menu submenu-trigger="click">
                    {canChangeLanguage && <LanguageMenu onRequestCloseSettings={this.props.onRequestClose} />}
                    {canChangeTheme && (
                        <React.Fragment>
                            <TWSurgeThemeMenu
                                onRequestCloseSettings={this.props.onRequestClose}
                            />
                            <TWBlocksThemeMenu
                                onOpenCustomSettings={onOpenCustomSettings}
                            />
                            <TWAccentThemeMenu />
                            <TWMenuBarAlignmentMenu />
                        </React.Fragment>
                    )}
                    {onClickDesktopSettings && <TWDesktopSettings onClick={onClickDesktopSettings} />}
                </mdui-menu>
            </mdui-dropdown>
        );
    }
}

SettingsMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickDesktopSettings: PropTypes.func,
    onOpenCustomSettings: PropTypes.func,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    settingsMenuOpen: PropTypes.bool
};

export default SettingsMenu;
