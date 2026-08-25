import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import locales from '@turbowarp/scratch-l10n';

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
    componentDidMount () {
        this.bindSubmenuEvents();
    }
    componentDidUpdate (prevProps) {
        if (this.itemRef.current && prevProps.menuOpen !== this.props.menuOpen) {
            this.itemRef.current.submenuOpen = this.props.menuOpen;
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
            <mdui-menu-item ref={this.itemRef}>
                <div
                    className={styles.option}
                    slot="custom"
                    onClick={this.handleToggleSubmenu}
                >
                    <mdui-icon name="language" />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Language"
                            description="Language sub-menu"
                            id="gui.menuBar.language"
                        />
                    </span>
                    <span className={styles.expandCaret}>
                        <mdui-icon name="chevron_right" />
                    </span>
                </div>
                <mdui-menu slot="submenu">
                    {
                        Object.keys(locales)
                            .filter(l => ['en', 'zh-cn', 'zh-tw'].includes(l))
                            .map(locale => (
                                <mdui-menu-item
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
                                            <mdui-icon name="check" />
                                        </span>
                                        {locales[locale].name}
                                    </div>
                                </mdui-menu-item>
                            ))
                    }
                </mdui-menu>
            </mdui-menu-item>
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
