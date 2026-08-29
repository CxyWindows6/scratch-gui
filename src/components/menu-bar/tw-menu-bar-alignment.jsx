import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {MduiIcon, MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {openAlignmentMenu, closeAlignmentMenu, alignmentMenuOpen, closeSettingsMenu} from '../../reducers/menus.js';
import {setMenuBarAlignment} from '../../reducers/tw.js';

import styles from './settings-menu.css';

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

const AlignmentOption = ({value, isSelected, onClick}) => (
    <MduiMenuItem
        onClick={onClick}
        selected={isSelected}
    >
        <div className={styles.option}>
            <span
                className={classNames(styles.check, {[styles.selected]: isSelected})}
            >
                <MduiIcon name="check" />
            </span>
            <span className={styles.label}>
                <FormattedMessage {...messages[value]} />
            </span>
        </div>
    </MduiMenuItem>
);

AlignmentOption.propTypes = {
    value: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

class MenuBarAlignmentMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleToggleSubmenu',
            'handleSubmenuOpened',
            'handleSubmenuClosed'
        ]);
        this.itemRef = React.createRef();
    }
    componentDidUpdate (prevProps) {
        if (this.itemRef.current && prevProps.isOpen !== this.props.isOpen) {
            this.itemRef.current.submenuOpen = this.props.isOpen;
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
            alignment,
            onChangeAlignment
        } = this.props;
        return (
            <MduiMenuItem
                ref={this.itemRef}
                onSubmenuOpened={this.handleSubmenuOpened}
                onSubmenuClosed={this.handleSubmenuClosed}
            >
                <div
                    className={styles.option}
                    slot="custom"
                    onClick={this.handleToggleSubmenu}
                >
                    <MduiIcon name="format_align_left" />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Menu bar alignment"
                            description="Label for menu bar alignment submenu"
                            id="tw.menuBar.menuBarAlignment"
                        />
                    </span>
                    <span className={styles.expandCaret}>
                        <MduiIcon name="chevron_right" />
                    </span>
                </div>
                <MduiMenu slot="submenu">
                    {OPTIONS.map(i => (
                        <AlignmentOption
                            key={i}
                            value={i}
                            isSelected={alignment === i}
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
