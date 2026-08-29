import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {MduiIcon, MduiMenuItem} from '../../lib/mdui';

import styles from './settings-menu.css';

const TWDesktopSettings = props => (
    <MduiMenuItem onClick={props.onClick}>
        <div className={styles.option}>
            <MduiIcon name="desktop_windows" />
            <FormattedMessage
                defaultMessage="Desktop Settings"
                description="Button in menu bar under settings to open desktop app settings"
                id="tw.menuBar.desktopSettings"
            />
        </div>
    </MduiMenuItem>
);

TWDesktopSettings.propTypes = {
    onClick: PropTypes.func
};

export default TWDesktopSettings;
