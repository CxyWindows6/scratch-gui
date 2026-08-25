import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {BLOCKS_CUSTOM, BLOCKS_DARK, BLOCKS_HIGH_CONTRAST, BLOCKS_THREE, Theme} from '../../lib/themes/index.js';
import {openBlocksThemeMenu, closeBlocksThemeMenu, blocksThemeMenuOpen,
    closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import styles from './settings-menu.css';
import threeIcon from './tw-blocks-three.svg';
import highContrastIcon from './tw-blocks-high-contrast.svg';
import darkIcon from './tw-blocks-dark.svg';

const options = defineMessages({
    [BLOCKS_THREE]: {
        defaultMessage: 'Original',
        description: 'Name of normal Scratch block colors.',
        id: 'tw.blockColors.three'
    },
    [BLOCKS_HIGH_CONTRAST]: {
        defaultMessage: 'High Contrast',
        description: 'Name of the high contrast block colors.',
        id: 'tw.blockColors.highContrast'
    },
    [BLOCKS_DARK]: {
        defaultMessage: 'Dark (Beta)',
        description: 'Name of the dark block colors',
        id: 'tw.blockColors.dark'
    },
    [BLOCKS_CUSTOM]: {
        defaultMessage: 'Customize in Addon Settings',
        description: 'Link in block color list to open addon settings for more customization',
        id: 'tw.blockColors.custom'
    }
});

const icons = {
    [BLOCKS_THREE]: threeIcon,
    [BLOCKS_HIGH_CONTRAST]: highContrastIcon,
    [BLOCKS_DARK]: darkIcon
};

const ThemeIcon = ({id}) => (
    id === BLOCKS_CUSTOM ? (
        <mdui-icon name="edit" />
    ) : (
        <img
            src={icons[id]}
            draggable={false}
            width={24}
        />
    )
);

ThemeIcon.propTypes = {
    id: PropTypes.string
};

const ThemeMenuItem = ({id, disabled, isSelected, onClick}) => (
    <mdui-menu-item
        onClick={disabled ? null : onClick}
        disabled={disabled}
        selected={isSelected}
    >
        <div className={classNames(styles.option, {[styles.disabled]: disabled})}>
            <span
                className={classNames(styles.check, {[styles.selected]: isSelected})}
            >
                <mdui-icon name="check" />
            </span>
            <ThemeIcon id={id} />
            <FormattedMessage {...options[id]} />
            {id === BLOCKS_CUSTOM && (
                <span className={styles.openLink}>
                    <mdui-icon name="open_in_new" />
                </span>
            )}
        </div>
    </mdui-menu-item>
);

ThemeMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

class BlocksThemeMenu extends React.Component {
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
            // Push Redux open state into the mdui-menu-item's submenu state
            this.itemRef.current.submenuOpen = this.props.isOpen;
        }
        this.bindSubmenuEvents();
    }
    componentWillUnmount () {
        this.unbindSubmenuEvents();
    }
    // mdui custom events cannot be bound via React props, so we bind them
    // directly on the custom element to sync the Redux submenu open state.
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
            onOpenCustomSettings,
            theme
        } = this.props;
        return (
            <mdui-menu-item ref={this.itemRef}>
                <div
                    className={styles.option}
                    slot="custom"
                    onClick={this.handleToggleSubmenu}
                >
                    <mdui-icon name="palette" />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Block Colors"
                            description="Label for to choose what color blocks should be, eg. original or high contrast"
                            id="tw.menuBar.blockColors"
                        />
                    </span>
                    <span className={styles.expandCaret}>
                        <mdui-icon name="chevron_right" />
                    </span>
                </div>
                <mdui-menu slot="submenu">
                    {[
                        BLOCKS_THREE,
                        BLOCKS_HIGH_CONTRAST,
                        BLOCKS_DARK,
                        ...(onOpenCustomSettings ? [BLOCKS_CUSTOM] : [])
                    ].map(i => (
                        <ThemeMenuItem
                            key={i}
                            id={i}
                            isSelected={theme.blocks === i}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={
                                i === BLOCKS_CUSTOM ?
                                    onOpenCustomSettings :
                                    () => onChangeTheme(theme.set('blocks', i))
                            }
                            disabled={i !== BLOCKS_CUSTOM && theme.blocks === BLOCKS_CUSTOM}
                        />
                    ))}
                </mdui-menu>
            </mdui-menu-item>
        );
    }
}

BlocksThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    onChangeTheme: PropTypes.func,
    onCloseMenu: PropTypes.func,
    onOpenCustomSettings: PropTypes.func,
    onOpenMenu: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    isOpen: blocksThemeMenuOpen(state),
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpenMenu: () => dispatch(openBlocksThemeMenu()),
    onCloseMenu: () => dispatch(closeBlocksThemeMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BlocksThemeMenu);
