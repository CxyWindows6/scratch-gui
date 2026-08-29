import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {MduiIcon, MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {BLOCKS_CUSTOM, BLOCKS_DARK, BLOCKS_HIGH_CONTRAST, BLOCKS_THREE, Theme} from '../../lib/themes/index.js';
import {openBlocksThemeMenu, closeBlocksThemeMenu, blocksThemeMenuOpen,
    closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
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

// 24px block-theme preview. Rendered into a menu item's `icon` slot.
const ThemeIcon = ({id, slot}) => (
    id === BLOCKS_CUSTOM ? (
        <MduiIcon
            name="edit"
            slot={slot}
        />
    ) : (
        <img
            slot={slot}
            src={icons[id]}
            alt=""
            draggable={false}
            width={24}
        />
    )
);

ThemeIcon.propTypes = {
    id: PropTypes.string,
    slot: PropTypes.string
};

const ThemeMenuItem = ({id, disabled, onClick}) => (
    <MduiMenuItem
        value={id}
        selectedIcon="check"
        disabled={disabled}
        endIcon={id === BLOCKS_CUSTOM ? 'open_in_new' : ''}
        onClick={disabled ? null : onClick}
    >
        <ThemeIcon
            id={id}
            slot="icon"
        />
        <FormattedMessage {...options[id]} />
    </MduiMenuItem>
);

ThemeMenuItem.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    onClick: PropTypes.func
};

class BlocksThemeMenu extends React.Component {
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
            onOpenCustomSettings,
            theme
        } = this.props;
        return (
            <MduiMenuItem
                icon="palette"
                onSubmenuOpened={this.handleSubmenuOpened}
                onSubmenuClosed={this.handleSubmenuClosed}
            >
                <FormattedMessage
                    defaultMessage="Block Colors"
                    description="Label for to choose what color blocks should be, eg. original or high contrast"
                    id="tw.menuBar.blockColors"
                />
                <MduiMenu
                    slot="submenu"
                    submenuTrigger="click"
                    selects="single"
                    value={theme.blocks}
                >
                    {[
                        BLOCKS_THREE,
                        BLOCKS_HIGH_CONTRAST,
                        BLOCKS_DARK,
                        ...(onOpenCustomSettings ? [BLOCKS_CUSTOM] : [])
                    ].map(i => (
                        <ThemeMenuItem
                            key={i}
                            id={i}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={
                                i === BLOCKS_CUSTOM ?
                                    onOpenCustomSettings :
                                    () => onChangeTheme(theme.set('blocks', i))
                            }
                            disabled={i !== BLOCKS_CUSTOM && theme.blocks === BLOCKS_CUSTOM}
                        />
                    ))}
                </MduiMenu>
            </MduiMenuItem>
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
