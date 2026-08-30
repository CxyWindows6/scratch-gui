import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import InlineMessages from '../../containers/inline-messages.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import {filterInlineAlerts} from '../../reducers/alerts';

import {MduiButton} from '../../lib/mdui';

import styles from './save-status.css';

// D5: the dirty-project "save now" control used to be a bare <div role="button">
// with hand-rolled Enter/Space handling. It is now a real mdui button, which
// provides button semantics, state layer, press feedback and focus-visible
// for free; the visible text is its accessible name.
const TWSaveStatus = ({
    alertsList,
    fileHandle,
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
                <MduiButton
                    variant="filled"
                    className={styles.saveNow}
                    onClick={smartSave}
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
                </MduiButton>
            )}
        </SB3Downloader>
    ));

TWSaveStatus.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    fileHandle: PropTypes.shape({
        name: PropTypes.string
    }),
    projectChanged: PropTypes.bool,
    showSaveFilePicker: PropTypes.func
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList,
    fileHandle: state.scratchGui.tw.fileHandle,
    projectChanged: state.scratchGui.projectChanged
});

export default connect(
    mapStateToProps,
    () => ({})
)(TWSaveStatus);
