import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import {
    ACCENT_RED, ACCENT_ORANGE, BLOCKS_CUSTOM, BLOCKS_DARK, BLOCKS_THREE,
    GUI_DARK, GUI_LIGHT, GUI_MIDNIGHT, GUI_EMBER, Theme
} from '../../lib/themes/index.js';
import {closeSettingsMenu, guiThemeMenuOpen, openGuiThemeMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import lightModeIcon from './tw-sun.svg';
import darkModeIcon from './tw-moon.svg';
import midnightModeIcon from './tw-midnight.svg';
import eveningModeIcon from './tw-evening.svg';
import styles from './settings-menu.css';

const options = defineMessages({
    [GUI_LIGHT]: {
        defaultMessage: 'Light',
        description: 'Name of the light GUI theme.',
        id: 'tw.guiTheme.light'
    },
    [GUI_DARK]: {
        defaultMessage: 'Dark',
        description: 'Name of the dark GUI theme.',
        id: 'tw.guiTheme.dark'
    },
    [GUI_MIDNIGHT]: {
        defaultMessage: 'Midnight',
        description: 'Name of the midnight GUI theme.',
        id: 'tw.guiTheme.midnight'
    },
    [GUI_EMBER]: {
        defaultMessage: 'Evening',
        description: 'Name of the evening GUI theme.',
        id: 'tw.guiTheme.ember'
    }
});

const icons = {
    [GUI_LIGHT]: lightModeIcon,
    [GUI_DARK]: darkModeIcon,
    [GUI_MIDNIGHT]: midnightModeIcon,
    [GUI_EMBER]: eveningModeIcon
};

const ThemeIcon = ({id}) => (
    <img
        src={icons[id]}
        draggable={false}
        width={24}
        height={24}
    />
);

ThemeIcon.propTypes = {
    id: PropTypes.string
};

const ThemeMenuItem = ({id, isSelected, onClick}) => (
    <MenuItem onClick={onClick}>
        <div className={styles.option}>
            <img
                width={15}
                height={12}
                className={classNames(styles.check, {[styles.selected]: isSelected})}
                src={check}
                draggable={false}
            />
            <ThemeIcon id={id} />
            <FormattedMessage {...options[id]} />
        </div>
    </MenuItem>
);

ThemeMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

const GuiThemeMenu = ({
    isOpen,
    isRtl,
    onChangeTheme,
    onOpenMenu,
    theme
}) => (
    <MenuItem expanded={isOpen}>
        <div
            className={styles.option}
            onClick={onOpenMenu}
        >
            <ThemeIcon id={theme.gui} />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Theme"
                    description="Label for menu to choose GUI theme, eg. light, dark, or midnight."
                    id="tw.menuBar.guiTheme"
                />
            </span>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
            {[GUI_LIGHT, GUI_DARK, GUI_MIDNIGHT, GUI_EMBER].map(i => (
                <ThemeMenuItem
                    key={i}
                    id={i}
                    isSelected={theme.gui === i}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => onChangeTheme(theme.set('gui', i), i)}
                />
            ))}
        </Submenu>
    </MenuItem>
);

GuiThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    onChangeTheme: PropTypes.func,
    onOpenMenu: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    isOpen: guiThemeMenuOpen(state),
    isRtl: state.locales.isRtl,
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: (theme, gui) => {
        if (gui === GUI_DARK || gui === GUI_MIDNIGHT) {
            if (theme.blocks !== BLOCKS_DARK && theme.blocks !== BLOCKS_CUSTOM) {
                theme = theme.set('blocks', BLOCKS_DARK);
            }
            theme = theme.set('accent', ACCENT_RED);
        } else if (gui === GUI_EMBER) {
            if (theme.blocks !== BLOCKS_DARK && theme.blocks !== BLOCKS_CUSTOM) {
                theme = theme.set('blocks', BLOCKS_DARK);
            }
            theme = theme.set('accent', ACCENT_ORANGE);
        } else if (gui === GUI_LIGHT) {
            if (theme.blocks !== BLOCKS_THREE && theme.blocks !== BLOCKS_CUSTOM) {
                theme = theme.set('blocks', BLOCKS_THREE);
            }
        }
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpenMenu: () => dispatch(openGuiThemeMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GuiThemeMenu);
