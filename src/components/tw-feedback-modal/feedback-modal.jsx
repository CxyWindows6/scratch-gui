import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import bowser from 'bowser';

import Modal from '../../containers/modal.jsx';
import Button from '../button/button.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import {APP_NAME} from '../../lib/brand.js';
import {submitFeedback, uploadScreenshot} from '../../lib/feedback-api.js';
import {prepareScreenshot, generateFilename} from '../../lib/feedback-screenshot.js';
import {
    FEEDBACK_USERNAME_KEY,
    USERNAME_COOLDOWN_KEY,
    USERNAME_CHANGE_COOLDOWN_DAYS
} from '../../lib/feedback-config.js';
import {getOrCreateIdentifier} from '../../lib/feedback-identifier.js';
import styles from './feedback-modal.css';

const BufferedInput = BufferedInputHOC(Input);

const FEEDBACK_KINDS = ['bug', 'feature', 'translation', 'other'];

const messages = defineMessages({
    title: {
        defaultMessage: '{APP_NAME} Feedback',
        description: 'Title of the feedback modal',
        id: 'surge.feedbackModal.title'
    },
    titleLabel: {
        defaultMessage: 'Title',
        description: 'Label for feedback title field',
        id: 'surge.feedbackModal.titleLabel'
    },
    titlePlaceholder: {
        defaultMessage: 'Short summary of your feedback',
        description: 'Placeholder for feedback title field',
        id: 'surge.feedbackModal.titlePlaceholder'
    },
    kindLabel: {
        defaultMessage: 'Type',
        description: 'Label for feedback type field',
        id: 'surge.feedbackModal.kindLabel'
    },
    kindBug: {
        defaultMessage: 'Bug Report',
        description: 'Bug report type',
        id: 'surge.feedbackModal.kindBug'
    },
    kindFeature: {
        defaultMessage: 'Feature Request',
        description: 'Feature request type',
        id: 'surge.feedbackModal.kindFeature'
    },
    kindTranslation: {
        defaultMessage: 'Translation Issue',
        description: 'Translation issue type',
        id: 'surge.feedbackModal.kindTranslation'
    },
    kindOther: {
        defaultMessage: 'Other',
        description: 'Other feedback type',
        id: 'surge.feedbackModal.kindOther'
    },
    usernameLabel: {
        defaultMessage: 'Username',
        description: 'Label for feedback username field',
        id: 'surge.feedbackModal.usernameLabel'
    },
    usernamePlaceholder: {
        defaultMessage: 'Your name or nickname',
        description: 'Placeholder for feedback username field',
        id: 'surge.feedbackModal.usernamePlaceholder'
    },
    contentLabel: {
        defaultMessage: 'Description',
        description: 'Label for feedback content field',
        id: 'surge.feedbackModal.contentLabel'
    },
    contentPlaceholder: {
        defaultMessage: 'Describe your feedback in detail. Markdown is supported.' +
            '\n\nFor bug reports, please include:\n' +
            '1. Steps to reproduce\n2. Expected behavior\n3. Actual behavior',
        description: 'Placeholder for feedback content field',
        id: 'surge.feedbackModal.contentPlaceholder'
    },
    screenshotLabel: {
        defaultMessage: 'Screenshot (optional)',
        description: 'Label for screenshot upload',
        id: 'surge.feedbackModal.screenshotLabel'
    },
    chooseFile: {
        defaultMessage: 'Choose image',
        description: 'Button text to choose screenshot file',
        id: 'surge.feedbackModal.chooseFile'
    },
    remove: {
        defaultMessage: 'Remove',
        description: 'Button text to remove screenshot',
        id: 'surge.feedbackModal.remove'
    },
    submit: {
        defaultMessage: 'Submit feedback',
        description: 'Submit feedback button text',
        id: 'surge.feedbackModal.submit'
    },
    submitting: {
        defaultMessage: 'Submitting…',
        description: 'Submitting state of submit button',
        id: 'surge.feedbackModal.submitting'
    },
    errorEmptyTitle: {
        defaultMessage: 'Please fill in all required fields.',
        description: 'Validation error shown when a required field is empty',
        id: 'surge.feedbackModal.errorEmptyTitle'
    },
    successMessage: {
        defaultMessage: 'Thank you! Your feedback has been submitted.',
        description: 'Success message after feedback submission',
        id: 'surge.feedbackModal.successMessage'
    },
    usernameCooldownError: {
        defaultMessage: 'Username can only be changed once every {days} days. Last change was {daysAgo} day(s) ago.',
        description: 'Error shown when trying to change username before cooldown expires',
        id: 'surge.feedbackModal.usernameCooldownError'
    },
    viewCommunity: {
        defaultMessage: 'View community feedback',
        description: 'Button to open the community feedback modal',
        id: 'surge.feedbackModal.viewCommunity'
    },
    alertTitle: {
        defaultMessage: 'Error',
        description: 'Title for error alert dialog',
        id: 'surge.feedbackModal.alertTitle'
    }
});

class FeedbackModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTitleChange',
            'handleKindChange',
            'handleUsernameChange',
            'handleUsernameClick',
            'handleUsernameKeyDown',
            'handleContentChange',
            'handleScreenshotPick',
            'handleScreenshotRemove',
            'handleSubmit',
            'handleClose',
            'handleCloseAlert'
        ]);

        let storedUsername = '';
        let cooldownDaysLeft = 0;
        let lastChangeDaysAgo = 0;
        try {
            storedUsername = localStorage.getItem(FEEDBACK_USERNAME_KEY) || '';
            const cooldownRaw = localStorage.getItem(USERNAME_COOLDOWN_KEY);
            if (cooldownRaw) {
                const cooldown = JSON.parse(cooldownRaw);
                if (cooldown.username === storedUsername && cooldown.changedAt) {
                    const elapsed = Date.now() - cooldown.changedAt;
                    lastChangeDaysAgo = Math.floor(elapsed / (1000 * 60 * 60 * 24));
                    cooldownDaysLeft = Math.max(0, USERNAME_CHANGE_COOLDOWN_DAYS - lastChangeDaysAgo);
                }
            }
        } catch (e) {
            // localStorage may be unavailable; we just continue without the value.
        }

        this.cooldownDaysAgo = lastChangeDaysAgo;

        this.userIdentifier = getOrCreateIdentifier();
        this.fileInputRef = React.createRef();

        this.state = {
            title: '',
            kind: 'bug',
            username: storedUsername,
            usernameLocked: cooldownDaysLeft > 0,
            content: '',
            screenshotBlob: null,
            screenshotPreview: '',
            submitting: false,
            success: false,
            showAlert: false,
            alertTitle: '',
            alertMessage: ''
        };
    }

    handleTitleChange (value) {
        this.setState({title: value});
    }

    handleKindChange (e) {
        this.setState({kind: e.target.value});
    }

    handleUsernameChange (value) {
        if (this.state.usernameLocked) {
            const {intl} = this.props;
            this.setState({
                showAlert: true,
                alertTitle: intl.formatMessage(messages.alertTitle),
                alertMessage: intl.formatMessage(messages.usernameCooldownError, {
                    days: USERNAME_CHANGE_COOLDOWN_DAYS,
                    daysAgo: this.cooldownDaysAgo
                })
            });
            return;
        }
        this.setState({username: value, usernameLocked: true});
        try {
            localStorage.setItem(FEEDBACK_USERNAME_KEY, value);
            localStorage.setItem(USERNAME_COOLDOWN_KEY, JSON.stringify({
                username: value,
                changedAt: Date.now()
            }));
        } catch (e) {
            // ignore write failures
        }
    }

    handleUsernameClick () {
        if (this.state.usernameLocked) {
            const {intl} = this.props;
            this.setState({
                showAlert: true,
                alertTitle: intl.formatMessage(messages.alertTitle),
                alertMessage: intl.formatMessage(messages.usernameCooldownError, {
                    days: USERNAME_CHANGE_COOLDOWN_DAYS,
                    daysAgo: this.cooldownDaysAgo
                })
            });
        }
    }

    handleUsernameKeyDown (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleUsernameClick();
        }
    }

    handleContentChange (e) {
        this.setState({content: e.target.value});
    }

    async handleScreenshotPick (e) {
        const file = e.target.files && e.target.files[0];
        e.target.value = ''; // reset so user can repick same file
        if (!file) return;
        try {
            const {blob, previewUrl} = await prepareScreenshot(file);
            this.setState({
                screenshotBlob: blob,
                screenshotPreview: previewUrl
            });
        } catch (err) {
            const {intl} = this.props;
            this.setState({
                showAlert: true,
                alertTitle: intl.formatMessage(messages.alertTitle),
                alertMessage: String(err.message || err)
            });
        }
    }

    handleScreenshotRemove () {
        this.setState({
            screenshotBlob: null,
            screenshotPreview: ''
        });
    }

    async handleSubmit () {
        const {title, kind, username, content, screenshotBlob} = this.state;
        if (!title.trim() || !username.trim() || !content.trim()) {
            const {intl} = this.props;
            this.setState({
                showAlert: true,
                alertTitle: intl.formatMessage(messages.alertTitle),
                alertMessage: intl.formatMessage(messages.errorEmptyTitle)
            });
            return;
        }
        this.setState({submitting: true, success: false});
        try {
            let screenshotUrl = '';
            if (screenshotBlob) {
                const filename = generateFilename();
                screenshotUrl = await uploadScreenshot(screenshotBlob, filename);
            }
            const userAgent = `${bowser.name} ${bowser.version} / ${bowser.osname || 'Unknown'}`;
            await submitFeedback({
                title: title.trim(),
                kind,
                username: username.trim(),
                content: content.trim(),
                screenshotUrl,
                userAgent,
                userIdentifier: this.userIdentifier
            });
            this.setState({
                submitting: false,
                success: true,
                title: '',
                content: '',
                screenshotBlob: null,
                screenshotPreview: ''
            });
        } catch (err) {
            const {intl} = this.props;
            this.setState({
                submitting: false,
                showAlert: true,
                alertTitle: intl.formatMessage(messages.alertTitle),
                alertMessage: String(err.message || err)
            });
        }
    }

    handleCloseAlert () {
        this.setState({showAlert: false, alertTitle: '', alertMessage: ''});
    }

    handleClose () {
        if (this.state.submitting) return;
        if (this.state.success) {
            this.setState({success: false});
        }
        this.props.onClose();
    }

    render () {
        const {intl} = this.props;
        const {title, kind, username, content,
            screenshotPreview, submitting, success,
            usernameLocked, showAlert, alertTitle,
            alertMessage} = this.state;

        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title, {APP_NAME})}
                id="feedbackModal"
                onRequestClose={this.handleClose}
            >
                <div className={styles.body}>
                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            htmlFor="feedback-title"
                        >
                            {intl.formatMessage(messages.titleLabel)}
                            <span className={styles.required}>{'*'}</span>
                        </label>
                        <BufferedInput
                            id="feedback-title"
                            className={styles.textInput}
                            value={title}
                            placeholder={intl.formatMessage(messages.titlePlaceholder)}
                            onSubmit={this.handleTitleChange}
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label
                                className={styles.label}
                                htmlFor="feedback-kind"
                            >
                                {intl.formatMessage(messages.kindLabel)}
                                <span className={styles.required}>{'*'}</span>
                            </label>
                            <select
                                id="feedback-kind"
                                className={styles.select}
                                value={kind}
                                onChange={this.handleKindChange}
                                disabled={submitting}
                            >
                                {FEEDBACK_KINDS.map(k => (
                                    <option
                                        key={k}
                                        value={k}
                                    >
                                        {intl.formatMessage(messages[`kind${k.charAt(0).toUpperCase()}${k.slice(1)}`])}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label
                                className={styles.label}
                                htmlFor="feedback-username"
                            >
                                {intl.formatMessage(messages.usernameLabel)}
                                <span className={styles.required}>{'*'}</span>
                            </label>
                            {usernameLocked ? (
                                <div
                                    className={styles.usernameLockedText}
                                    onClick={this.handleUsernameClick}
                                    onKeyDown={this.handleUsernameKeyDown}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {username}
                                </div>
                            ) : (
                                <BufferedInput
                                    id="feedback-username"
                                    className={styles.textInput}
                                    value={username}
                                    placeholder={intl.formatMessage(messages.usernamePlaceholder)}
                                    onSubmit={this.handleUsernameChange}
                                    disabled={submitting}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            htmlFor="feedback-content"
                        >
                            {intl.formatMessage(messages.contentLabel)}
                            <span className={styles.required}>{'*'}</span>
                        </label>
                        <textarea
                            id="feedback-content"
                            className={styles.textarea}
                            value={content}
                            placeholder={intl.formatMessage(messages.contentPlaceholder)}
                            onChange={this.handleContentChange}
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            {intl.formatMessage(messages.screenshotLabel)}
                        </label>
                        <div className={styles.uploadRow}>
                            <label className={styles.uploadButton}>
                                <FormattedMessage {...messages.chooseFile} />
                                <input
                                    ref={this.fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{display: 'none'}}
                                    onChange={this.handleScreenshotPick}
                                    disabled={submitting}
                                />
                            </label>
                            {screenshotPreview && (
                                <button
                                    type="button"
                                    className={styles.screenshotRemove}
                                    onClick={this.handleScreenshotRemove}
                                    disabled={submitting}
                                >
                                    <FormattedMessage {...messages.remove} />
                                </button>
                            )}
                        </div>
                        {screenshotPreview && (
                            <img
                                className={styles.screenshotPreview}
                                src={screenshotPreview}
                                alt="screenshot"
                            />
                        )}
                    </div>

                    <div className={styles.actions}>
                        {success && <div className={styles.submitSuccess}>
                            <FormattedMessage {...messages.successMessage} />
                        </div>}
                        <div className={styles.buttonRow}>
                            <Button
                                className={styles.submitButton}
                                onClick={this.handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ?
                                    <FormattedMessage {...messages.submitting} /> :
                                    <FormattedMessage {...messages.submit} />}
                            </Button>
                            <Button
                                className={styles.communityButton}
                                onClick={this.props.onOpenCommunity}
                                disabled={submitting}
                            >
                                <FormattedMessage {...messages.viewCommunity} />
                            </Button>
                        </div>
                    </div>
                </div>
                {showAlert && (
                    <Modal
                        className={styles.alertModal}
                        contentLabel={alertTitle}
                        id="feedbackAlert"
                        onRequestClose={this.handleCloseAlert}
                    >
                        <div className={styles.alertBody}>
                            <div className={styles.alertMessage}>{alertMessage}</div>
                            <div className={styles.alertButtonRow}>
                                <Button
                                    className={styles.alertButton}
                                    onClick={this.handleCloseAlert}
                                >
                                    {'OK'}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </Modal>
        );
    }
}

FeedbackModal.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func,
    onRequestClose: PropTypes.func,
    onOpenCommunity: PropTypes.func
};

FeedbackModal.defaultProps = {
    onClose: () => {},
    onRequestClose: () => {},
    onOpenCommunity: () => {}
};

export default injectIntl(FeedbackModal);
