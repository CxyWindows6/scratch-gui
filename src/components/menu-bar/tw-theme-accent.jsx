import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

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

const ColorIcon = props => (
    icons[props.id] ? (
        <img
            className={styles.accentIconOuter}
            src={icons[props.id]}
            draggable={false}
            // Image is decorative
            alt=""
        />
    ) : (
        <div
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
    id: PropTypes.string
};

const AccentMenuItem = props => (
    <mdui-menu-item
        onClick={props.onClick}
        selected={props.isSelected}
    >
        <div className={styles.option}>
            <span
                className={classNames(styles.check, {[styles.selected]: props.isSelected})}
            >
                <mdui-icon name="check" />
            </span>
            <ColorIcon id={props.id} />
            <FormattedMessage {...options[props.id]} />
        </div>
    </mdui-menu-item>
);

AccentMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

class AccentThemeMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleToggleSubmenu',
            'handleSubmenuOpened',
            'handleSubmenuClosed'
        ]);
        this.itemRef = React.createRef();
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
        this.unbindSubmenuEvents();
    }
    bindSubmenuEvents () {
        const element = this.itemRef.current;
        if (element && !element.dataset.mduiSubmenuBound) {
            element.dataset.mduiSubmenuBound = 'true';
            element.addEventListener('submenu-opened', this.handleSubmenuOpened);
            element.addEventListener('submenu-closed', this.handleSubmenuClosed);
        }
    }
    unbindSubmenuEvents () {
        const element = this.itemRef.current;
        if (element && element.dataset.mduiSubmenuBound) {
            delete element.dataset.mduiSubmenuBound;
            element.removeEventListener('submenu-opened', this.handleSubmenuOpened);
            element.removeEventListener('submenu-closed', this.handleSubmenuClosed);
        }
    }
    // mdui only toggles a submenu when the click target is the menu-item host
    // itself; clicks on the option content land on inner elements, so toggle
    // the submenu state manually (mdui still emits submenu-opened/closed).
    handleToggleSubmenu () {
        const element = this.itemRef.current;
        if (element) element.submenuOpen = !element.submenuOpen;
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
            <mdui-menu-item ref={this.itemRef}>
                <div
                    className={styles.option}
                    slot="custom"
                    onClick={this.handleToggleSubmenu}
                >
                    <ColorIcon id={theme.accent} />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Accent"
                            description="Label for menu to choose accent color (eg. TurboWarp's red, Scratch's purple)"
                            id="tw.menuBar.accent"
                        />
                    </span>
                    <span className={styles.expandCaret}>
                        <mdui-icon name="chevron_right" />
                    </span>
                </div>
                <mdui-menu slot="submenu">
                    {Object.keys(options).map(item => (
                        <AccentMenuItem
                            key={item}
                            id={item}
                            isSelected={theme.accent === item}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() => onChangeTheme(theme.set('accent', item))}
                        />
                    ))}
                </mdui-menu>
            </mdui-menu-item>
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
