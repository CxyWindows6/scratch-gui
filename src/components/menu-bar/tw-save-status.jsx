import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import InlineMessages from '../../containers/inline-messages.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import {filterInlineAlerts} from '../../reducers/alerts';

import styles from './save-status.css';

const messages = defineMessages({
    saveNow: {
        id: 'tw.menuBar.saveNow',
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

const TWSaveStatus = ({
    alertsList,
    fileHandle,
    intl,
    projectChanged,
    showSaveFilePicker
}) => (
    filterInlineAlerts(alertsList).length > 0 ? (
        <InlineMessages />
    ) : projectChanged && (
        <SB3Downloader
            showSaveFilePicker={showSaveFilePicker}
        >
            {(_className, _downloadProjectCallback, {smartSave}) => (
                <div
                    role="button"
                    tabIndex={0}
                    aria-label={intl.formatMessage(messages.saveNow)}
                    className={styles.saveNow}
                    onClick={smartSave}
                    onKeyDown={handleButtonKeyDown(smartSave)}
                >
                    {fileHandle ? (
                        <FormattedMessage
                            defaultMessage="Save as {file}"
                            description="Menu bar item to save project to an existing file on the user's computer"
                            id="tw.menuBar.saveAs"
                            values={{
                                file: fileHandle.name
                            }}
                        />
                    ) : (
                        <FormattedMessage
                            defaultMessage="Save to your computer"
                            description="Menu bar item for downloading a project to your computer"
                            id="tw.menuBar.saveToComputer"
                        />
                    )}
                </div>
            )}
        </SB3Downloader>
    ));

TWSaveStatus.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    fileHandle: PropTypes.shape({
        name: PropTypes.string
    }),
    intl: intlShape.isRequired,
    projectChanged: PropTypes.bool,
    showSaveFilePicker: PropTypes.func
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList,
    fileHandle: state.scratchGui.tw.fileHandle,
    projectChanged: state.scratchGui.projectChanged
});

export default injectIntl(connect(
    mapStateToProps,
    () => ({})
)(TWSaveStatus));
