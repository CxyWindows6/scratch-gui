import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {openAlignmentMenu, closeAlignmentMenu, alignmentMenuOpen, closeSettingsMenu} from '../../reducers/menus.js';
import {setMenuBarAlignment} from '../../reducers/tw.js';

const messages = defineMessages({
    left: {
        defaultMessage: 'Left',
        description: 'Menu bar alignment option: left',
        id: 'tw.menuBar.alignLeft'
    },
    center: {
        defaultMessage: 'Center',
        description: 'Menu bar alignment option: center',
        id: 'tw.menuBar.alignCenter'
    },
    right: {
        defaultMessage: 'Right',
        description: 'Menu bar alignment option: right',
        id: 'tw.menuBar.alignRight'
    }
});

const OPTIONS = ['left', 'center', 'right'];

const AlignmentOption = ({value, onClick}) => (
    <MduiMenuItem
        value={value}
        selectedIcon="check"
        onClick={onClick}
    >
        <FormattedMessage {...messages[value]} />
    </MduiMenuItem>
);

AlignmentOption.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string
};

class MenuBarAlignmentMenu extends React.Component {
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
            alignment,
            onChangeAlignment
        } = this.props;
        return (
            <MduiMenuItem
                icon="format_align_left"
                onSubmenuOpened={this.handleSubmenuOpened}
                onSubmenuClosed={this.handleSubmenuClosed}
            >
                <FormattedMessage
                    defaultMessage="Menu bar alignment"
                    description="Label for menu bar alignment submenu"
                    id="tw.menuBar.menuBarAlignment"
                />
                <MduiMenu
                    slot="submenu"
                    submenuTrigger="click"
                    selects="single"
                    value={alignment}
                >
                    {OPTIONS.map(i => (
                        <AlignmentOption
                            key={i}
                            value={i}
                            /* eslint-disable-next-line react/jsx-no-bind */
                            onClick={() => onChangeAlignment(i)}
                        />
                    ))}
                </MduiMenu>
            </MduiMenuItem>
        );
    }
}

MenuBarAlignmentMenu.propTypes = {
    alignment: PropTypes.string,
    isOpen: PropTypes.bool,
    onChangeAlignment: PropTypes.func,
    onCloseMenu: PropTypes.func,
    onOpenMenu: PropTypes.func
};

const mapStateToProps = state => ({
    alignment: state.scratchGui.tw.menuBarAlignment,
    isOpen: alignmentMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
    onChangeAlignment: alignment => {
        dispatch(setMenuBarAlignment(alignment));
        dispatch(closeSettingsMenu());
        try {
            localStorage.setItem('tw:menuBarAlignment', alignment);
        } catch (e) {
            // ignore
        }
    },
    onOpenMenu: () => dispatch(openAlignmentMenu()),
    onCloseMenu: () => dispatch(closeAlignmentMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBarAlignmentMenu);
