import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import InlineMessages from '../../containers/inline-messages.jsx';

import {
    manualUpdateProject
} from '../../reducers/project-state';

import {
    filterInlineAlerts
} from '../../reducers/alerts';

import styles from './save-status.css';

const messages = defineMessages({
    saveNow: {
        id: 'gui.menuBar.saveNowLabel',
        defaultMessage: 'Save now',
        description: 'Accessible label for the save button in the menu bar shown when the project has unsaved changes'
    }
});

// Keyboard support for the div-as-button: activate on Enter or Space.
const handleButtonKeyDown = onClick => event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
    }
};

// Wrapper for inline messages in the nav bar, which are all related to saving.
// Show any inline messages if present, else show the "Save Now" button if the
// project has changed.
// We decided to not use an inline message for "Save Now" because it is a reflection
// of the project state, rather than an event.
const SaveStatus = ({
    alertsList,
    intl,
    projectChanged,
    onClickSave
}) => (
    filterInlineAlerts(alertsList).length > 0 ? (
        <InlineMessages />
    ) : projectChanged && (
        <div
            role="button"
            tabIndex={0}
            aria-label={intl.formatMessage(messages.saveNow)}
            className={styles.saveNow}
            onClick={onClickSave}
            onKeyDown={handleButtonKeyDown(onClickSave)}
        >
            <FormattedMessage
                defaultMessage="Save Now"
                description="Title bar link for saving now"
                id="gui.menuBar.saveNowLink"
            />
        </div>
    ));

SaveStatus.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    intl: intlShape.isRequired,
    onClickSave: PropTypes.func,
    projectChanged: PropTypes.bool
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList,
    projectChanged: state.scratchGui.projectChanged
});

const mapDispatchToProps = dispatch => ({
    onClickSave: () => dispatch(manualUpdateProject())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveStatus));
