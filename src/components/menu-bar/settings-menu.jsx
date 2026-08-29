import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import bindAll from 'lodash.bindall';

import {MduiButton, MduiDropdown, MduiMenu} from '../../lib/mdui';

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
    // Push Redux open-state transitions into the dropdown imperatively.
    // (We deliberately do not bind `open` as a controlled prop: mdui flips
    // its own `open` on user interaction and only emits `opened`/`closed`
    // after the animation, so a controlled prop would race with unrelated
    // re-renders and could snap the menu shut mid-animation.)
    componentDidUpdate (prevProps) {
        if (this.dropdownRef && prevProps.settingsMenuOpen !== this.props.settingsMenuOpen) {
            this.dropdownRef.open = this.props.settingsMenuOpen;
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
            <MduiDropdown
                ref={this.setDropdownRef}
                placement={isRtl ? 'bottom-end' : 'bottom-start'}
                onOpened={this.handleOpened}
                onClosed={this.handleClosed}
            >
                <MduiButton
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
                </MduiButton>
                <MduiMenu submenuTrigger="click">
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
                </MduiMenu>
            </MduiDropdown>
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
