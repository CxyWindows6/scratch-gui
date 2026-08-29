import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {MduiMenuItem} from '../../lib/mdui';

const TWDesktopSettings = props => (
    <MduiMenuItem
        icon="desktop_windows"
        onClick={props.onClick}
    >
        <FormattedMessage
            defaultMessage="Desktop Settings"
            description="Button in menu bar under settings to open desktop app settings"
            id="tw.menuBar.desktopSettings"
        />
    </MduiMenuItem>
);

TWDesktopSettings.propTypes = {
    onClick: PropTypes.func
};

export default TWDesktopSettings;
