import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import locales from '@turbowarp/scratch-l10n';

import {MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {openLanguageMenu, closeLanguageMenu, languageMenuOpen} from '../../reducers/menus.js';
import {selectLocale} from '../../reducers/locales.js';

import styles from './settings-menu.css';

class LanguageMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeLanguage',
            'handleSubmenuOpened',
            'handleSubmenuClosed'
        ]);
    }
    handleChangeLanguage (locale) {
        this.props.onChangeLanguage(locale);
        this.props.onRequestCloseSettings();
    }
    handleSubmenuOpened () {
        if (!this.props.menuOpen) this.props.onRequestOpen();
    }
    handleSubmenuClosed () {
        if (this.props.menuOpen) this.props.onRequestClose();
    }
    render () {
        const {
            currentLocale
        } = this.props;
        return (
            <MduiMenuItem
                icon="language"
                onSubmenuOpened={this.handleSubmenuOpened}
                onSubmenuClosed={this.handleSubmenuClosed}
            >
                <FormattedMessage
                    defaultMessage="Language"
                    description="Language sub-menu"
                    id="gui.menuBar.language"
                />
                <MduiMenu
                    slot="submenu"
                    submenuTrigger="click"
                    selects="single"
                    value={currentLocale}
                >
                    {
                        Object.keys(locales)
                            .filter(l => ['en', 'zh-cn', 'zh-tw'].includes(l))
                            .map(locale => (
                                <MduiMenuItem
                                    key={locale}
                                    value={locale}
                                    selectedIcon="check"
                                    className={styles.languageMenuItem}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onClick={() => this.handleChangeLanguage(locale)}
                                >
                                    {locales[locale].name}
                                </MduiMenuItem>
                            ))
                    }
                </MduiMenu>
            </MduiMenuItem>
        );
    }
}

LanguageMenu.propTypes = {
    currentLocale: PropTypes.string,
    menuOpen: PropTypes.bool,
    onChangeLanguage: PropTypes.func,
    onRequestClose: PropTypes.func,
    onRequestCloseSettings: PropTypes.func,
    onRequestOpen: PropTypes.func
};

const mapStateToProps = state => ({
    currentLocale: state.locales.locale,
    menuOpen: languageMenuOpen(state),
    messagesByLocale: state.locales.messagesByLocale
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChangeLanguage: locale => {
        dispatch(selectLocale(locale));
        ownProps.onRequestCloseSettings();
    },
    onRequestOpen: () => dispatch(openLanguageMenu()),
    onRequestClose: () => dispatch(closeLanguageMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LanguageMenu);
