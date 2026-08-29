import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import locales from '@turbowarp/scratch-l10n';

import {MduiIcon, MduiMenu, MduiMenuItem} from '../../lib/mdui';

import {openLanguageMenu, closeLanguageMenu, languageMenuOpen} from '../../reducers/menus.js';
import {selectLocale} from '../../reducers/locales.js';

import styles from './settings-menu.css';

class LanguageMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeLanguage',
            'handleToggleSubmenu',
            'handleSubmenuOpened',
            'handleSubmenuClosed'
        ]);
        this.itemRef = React.createRef();
    }
    componentDidUpdate (prevProps) {
        if (this.itemRef.current && prevProps.menuOpen !== this.props.menuOpen) {
            this.itemRef.current.submenuOpen = this.props.menuOpen;
        }
    }
    handleChangeLanguage (locale) {
        this.props.onChangeLanguage(locale);
        this.props.onRequestCloseSettings();
    }
    // mdui only toggles a submenu when the click target is the menu-item host
    // itself; clicks on the option content land on inner elements, so toggle
    // the submenu state manually (mdui still emits submenu-opened/closed).
    handleToggleSubmenu () {
        const element = this.itemRef.current;
        if (element) element.submenuOpen = !element.submenuOpen;
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
                ref={this.itemRef}
                onSubmenuOpened={this.handleSubmenuOpened}
                onSubmenuClosed={this.handleSubmenuClosed}
            >
                <div
                    className={styles.option}
                    slot="custom"
                    onClick={this.handleToggleSubmenu}
                >
                    <MduiIcon name="language" />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Language"
                            description="Language sub-menu"
                            id="gui.menuBar.language"
                        />
                    </span>
                    <span className={styles.expandCaret}>
                        <MduiIcon name="chevron_right" />
                    </span>
                </div>
                <MduiMenu slot="submenu">
                    {
                        Object.keys(locales)
                            .filter(l => ['en', 'zh-cn', 'zh-tw'].includes(l))
                            .map(locale => (
                                <MduiMenuItem
                                    key={locale}
                                    value={locale}
                                    className={styles.languageMenuItem}
                                    selected={currentLocale === locale}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onClick={() => this.handleChangeLanguage(locale)}
                                >
                                    <div className={styles.option}>
                                        <span
                                            className={classNames(styles.check, {
                                                [styles.selected]: currentLocale === locale
                                            })}
                                        >
                                            <MduiIcon name="check" />
                                        </span>
                                        {locales[locale].name}
                                    </div>
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
