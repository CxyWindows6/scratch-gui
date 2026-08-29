import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {ACCENT_BLUE, ACCENT_GRAY, ACCENT_MAP, ACCENT_ORANGE, ACCENT_PURPLE,
    ACCENT_RED, ACCENT_RAINBOW, Theme} from '../../lib/themes/index.js';
import {openAccentMenu, closeAccentMenu, accentMenuOpen, closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import rainbowIcon from './tw-accent-rainbow.svg';
import styles from './settings-menu.css';

const options = defineMessages({
    [ACCENT_RED]: {
        defaultMessage: 'Red',
        description: 'Name of the red color scheme, used by TurboWarp by default.',
        id: 'tw.accent.red'
    },
    [ACCENT_ORANGE]: {
        defaultMessage: 'Orange',
        description: 'Name of the orange color scheme.',
        id: 'tw.accent.orange'
    },
    [ACCENT_PURPLE]: {
        defaultMessage: 'Purple',
        description: 'Name of the purple color scheme. Matches modern Scratch.',
        id: 'tw.accent.purple'
    },
    [ACCENT_BLUE]: {
        defaultMessage: 'Blue',
        description: 'Name of the blue color scheme. Matches Scratch before the high contrast update.',
        id: 'tw.accent.blue'
    },
    [ACCENT_GRAY]: {
        defaultMessage: 'Gray',
        description: 'Name of the gray color scheme.',
        id: 'tw.accent.gray'
    },
    [ACCENT_RAINBOW]: {
        defaultMessage: 'Rainbow',
        description: 'Name of color scheme that uses a rainbow.',
        id: 'tw.accent.rainbow'
    }
});

const icons = {
    [ACCENT_RAINBOW]: rainbowIcon
};

// A 24px color swatch. Rendered into a menu item's `icon` slot (the `slot`
// prop is forwarded to the DOM element so mdui assigns it).
const ColorIcon = props => (
    icons[props.id] ? (
        <img
            slot={props.slot}
            className={styles.accentIconOuter}
            src={icons[props.id]}
            draggable={false}
            // Image is decorative
            alt=""
        />
    ) : (
        <div
            slot={props.slot}
            className={styles.accentIconOuter}
            style={{
                // menu-bar-background is var(...), don't want to evaluate with the current values
                backgroundColor: ACCENT_MAP[props.id].guiColors['looks-secondary'],
                backgroundImage: ACCENT_MAP[props.id].guiColors['menu-bar-background-image']
            }}
        />
    )
);

ColorIcon.propTypes = {
    id: PropTypes.string,
    slot: PropTypes.string
};

const AccentMenuItem = props => (
    <MduiMenuItem
        value={props.id}
        selectedIcon="check"
        onClick={props.onClick}
    >
        <ColorIcon
            id={props.id}
            slot="icon"
        />
        <FormattedMessage {...options[props.id]} />
    </MduiMenuItem>
);

AccentMenuItem.propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func
};

class AccentThemeMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSubmenuOpened',
            'handleSubmenuClosed'
        ]);
    }
    handleSubmenuOpened () {
        if (!this.props.isOpen) this.props.onOpenMenu();
    }
    handleSubmenuClosed () {
        if (this.props.isOpen) this.props.onCloseMenu();
    }
    render () {
        const {
            onChangeTheme,
            theme
        } = this.props;
        return (
            <MduiMenuItem
                onSubmenuOpened={this.handleSubmenuOpened}
                onSubmenuClosed={this.handleSubmenuClosed}
            >
                <ColorIcon
                    id={theme.accent}
                    slot="icon"
                />
                <FormattedMessage
                    defaultMessage="Accent"
                    description="Label for menu to choose accent color (eg. TurboWarp's red, Scratch's purple)"
                    id="tw.menuBar.accent"
                />
                <MduiMenu
                    slot="submenu"
                    submenuTrigger="click"
                    selects="single"
                    value={theme.accent}
                >
                    {Object.keys(options).map(item => (
                        <AccentMenuItem
                            key={item}
                            id={item}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() => onChangeTheme(theme.set('accent', item))}
                        />
                    ))}
                </MduiMenu>
            </MduiMenuItem>
        );
    }
}

AccentThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    onChangeTheme: PropTypes.func,
    onCloseMenu: PropTypes.func,
    onOpenMenu: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    isOpen: accentMenuOpen(state),
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpenMenu: () => dispatch(openAccentMenu()),
    onCloseMenu: () => dispatch(closeAccentMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccentThemeMenu);
