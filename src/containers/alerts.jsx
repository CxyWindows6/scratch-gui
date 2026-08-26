import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
    closeAlertWithId,
    filterPopupAlerts
} from '../reducers/alerts';

import AlertsComponent from '../components/alerts/alerts.jsx';

const Alerts = ({
    alertsList,
    className,
    onCloseAlert
}) => (
    <AlertsComponent
        // only display standard and extension alerts here
        alertsList={filterPopupAlerts(alertsList)}
        className={className}
        onCloseAlert={onCloseAlert}
    />
);

Alerts.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    onCloseAlert: PropTypes.func
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList
});

const mapDispatchToProps = dispatch => ({
    // Close by stable alertId, not by index: alertsList is filtered before
    // rendering, so filtered indexes don't match the full list in the store.
    onCloseAlert: alertId => dispatch(closeAlertWithId(alertId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Alerts);
