import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import styles from './settings-menu.css';

const TWDesktopSettings = props => (
    <mdui-menu-item onClick={props.onClick}>
        <div className={styles.option}>
            <mdui-icon name="desktop_windows" />
            <FormattedMessage
                defaultMessage="Desktop Settings"
                description="Button in menu bar under settings to open desktop app settings"
                id="tw.menuBar.desktopSettings"
            />
        </div>
    </mdui-menu-item>
);

TWDesktopSettings.propTypes = {
    onClick: PropTypes.func
};

export default TWDesktopSettings;
