import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import {alignmentMenuOpen, openAlignmentMenu, closeSettingsMenu} from '../../reducers/menus.js';
import {setMenuBarAlignment} from '../../reducers/tw.js';

import settingsMenuStyles from './settings-menu.css';
import styles from './tw-menu-bar-alignment.css';

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
    <MenuItem onClick={onClick}>
        <div className={styles.option}>
            <img
                width={15}
                height={12}
                className={classNames(styles.check, {[styles.selected]: isSelected})}
                src={check}
                draggable={false}
            />
            <span className={styles.label}>
                <FormattedMessage {...messages[value]} />
            </span>
        </div>
    </MenuItem>
);

AlignmentOption.propTypes = {
    value: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

const MenuBarAlignmentMenu = ({
    alignment,
    isOpen,
    isRtl,
    onChangeAlignment,
    onOpenMenu
}) => (
    <MenuItem expanded={isOpen}>
        <div
            className={styles.option}
            onClick={onOpenMenu}
        >
            <span className={styles.label}>
                <FormattedMessage
                    defaultMessage="Menu bar alignment"
                    description="Label for menu bar alignment submenu"
                    id="tw.menuBar.menuBarAlignment"
                />
            </span>
            <img
                className={settingsMenuStyles.expandCaret}
                src={dropdownCaret}
                draggable={false}
                width={8}
                height={5}
            />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
            {OPTIONS.map(i => (
                <AlignmentOption
                    key={i}
                    value={i}
                    isSelected={alignment === i}
                    /* eslint-disable-next-line react/jsx-no-bind */
                    onClick={() => onChangeAlignment(i)}
                />
            ))}
        </Submenu>
    </MenuItem>
);

MenuBarAlignmentMenu.propTypes = {
    alignment: PropTypes.string,
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    onChangeAlignment: PropTypes.func,
    onOpenMenu: PropTypes.func
};

const mapStateToProps = state => ({
    alignment: state.scratchGui.tw.menuBarAlignment,
    isOpen: alignmentMenuOpen(state),
    isRtl: state.locales.isRtl
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
    onOpenMenu: () => dispatch(openAlignmentMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBarAlignmentMenu);
