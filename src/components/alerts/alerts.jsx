import React from 'react';
import PropTypes from 'prop-types';

import Box from '../box/box.jsx';
import Alert from '../../containers/alert.jsx';

import styles from './alerts.css';

const AlertsComponent = ({
    alertsList,
    className,
    onCloseAlert
}) => (
    <Box
        bounds="parent"
        className={className}
        role="status"
        aria-live="polite"
    >
        <Box className={styles.alertsInnerContainer} >
            {alertsList.map(a => (
                <Alert
                    alertId={a.alertId}
                    closeButton={a.closeButton}
                    content={a.content}
                    extensionId={a.extensionId}
                    extensionName={a.extensionName}
                    iconSpinner={a.iconSpinner}
                    iconURL={a.iconURL}
                    key={a.alertId}
                    level={a.level}
                    message={a.message}
                    showDownload={a.showDownload}
                    showReconnect={a.showReconnect}
                    showSaveNow={a.showSaveNow}
                    onCloseAlert={onCloseAlert}
                />
            ))}
        </Box>
    </Box>
);

AlertsComponent.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    onCloseAlert: PropTypes.func
};

export default AlertsComponent;
