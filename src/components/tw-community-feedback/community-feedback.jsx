import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Modal from '../../containers/modal.jsx';
import {fetchFeedbackList, fetchComments, submitComment} from '../../lib/feedback-api.js';
import {getOrCreateIdentifier} from '../../lib/feedback-identifier.js';
import {FEEDBACK_USERNAME_KEY} from '../../lib/feedback-config.js';
import styles from './community-feedback.css';

const KIND_BADGE_CLASS = {
    bug: styles['kind-bug'],
    feature: styles['kind-feature'],
    translation: styles['kind-translation'],
    other: styles['kind-other']
};

const PAGE_SIZE = 20;

const formatDate = dateStr => {
    try {
        const d = new Date(dateStr);
        const pad = n => String(n).padStart(2, '0');
        const datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        const timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        return `${datePart} ${timePart}`;
    } catch (e) {
        return dateStr;
    }
};

const messages = defineMessages({
    title: {
        defaultMessage: 'Community Feedback',
        description: 'Title of the community feedback modal',
        id: 'surge.communityFeedback.title'
    },
    close: {
        defaultMessage: 'Close',
        description: 'Close button in community feedback modal',
        id: 'surge.communityFeedback.close'
    },
    loading: {
        defaultMessage: 'Loading feedback...',
        description: 'Loading state in community feedback',
        id: 'surge.communityFeedback.loading'
    },
    empty: {
        defaultMessage: 'No feedback yet. Be the first!',
        description: 'Empty state in community feedback',
        id: 'surge.communityFeedback.empty'
    },
    previous: {
        defaultMessage: 'Previous',
        description: 'Previous page button',
        id: 'surge.communityFeedback.previous'
    },
    next: {
        defaultMessage: 'Next',
        description: 'Next page button',
        id: 'surge.communityFeedback.next'
    },
    kindBug: {
        defaultMessage: 'Bug',
        description: 'Bug report kind badge',
        id: 'surge.communityFeedback.kindBug'
    },
    kindFeature: {
        defaultMessage: 'Feature',
        description: 'Feature request kind badge',
        id: 'surge.communityFeedback.kindFeature'
    },
    kindTranslation: {
        defaultMessage: 'Translation',
        description: 'Translation issue kind badge',
        id: 'surge.communityFeedback.kindTranslation'
    },
    kindOther: {
        defaultMessage: 'Other',
        description: 'Other kind badge',
        id: 'surge.communityFeedback.kindOther'
    },
    comments: {
        defaultMessage: 'Comments',
        description: 'Comments section heading',
        id: 'surge.communityFeedback.comments'
    },
    commentPlaceholder: {
        defaultMessage: 'Write a comment...',
        description: 'Placeholder for comment input',
        id: 'surge.communityFeedback.commentPlaceholder'
    },
    postComment: {
        defaultMessage: 'Post',
        description: 'Post comment button',
        id: 'surge.communityFeedback.postComment'
    },
    noComments: {
        defaultMessage: 'No comments yet.',
        description: 'Empty state for comments',
        id: 'surge.communityFeedback.noComments'
    },
    commentLoading: {
        defaultMessage: 'Loading comments...',
        description: 'Loading state for comments',
        id: 'surge.communityFeedback.commentLoading'
    }
});

const KIND_MESSAGE = {
    bug: messages.kindBug,
    feature: messages.kindFeature,
    translation: messages.kindTranslation,
    other: messages.kindOther
};

class CommunityFeedback extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handlePrevPage',
            'handleNextPage',
            'handleToggleComments',
            'handleCommentInputChange',
            'handlePostComment'
        ]);

        let storedUsername = '';
        try {
            storedUsername = localStorage.getItem(FEEDBACK_USERNAME_KEY) || '';
        } catch (e) {
            // ignore
        }

        this.userIdentifier = getOrCreateIdentifier();
        this.state = {
            entries: [],
            loading: true,
            error: '',
            page: 0,
            expandedId: null,
            comments: {},
            commentsLoading: false,
            commentInput: ''
        };
        this.commentUsername = storedUsername;
    }

    componentDidMount () {
        this.loadPage(0);
    }

    async loadPage (page) {
        this.setState({loading: true, error: ''});
        try {
            const entries = await fetchFeedbackList({
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE
            });
            this.setState({
                entries,
                loading: false,
                page
            });
        } catch (err) {
            this.setState({
                loading: false,
                error: String(err.message || err)
            });
        }
    }

    handleClose () {
        this.props.onClose();
    }

    handlePrevPage () {
        if (this.state.page > 0) {
            this.loadPage(this.state.page - 1);
        }
    }

    handleNextPage () {
        this.loadPage(this.state.page + 1);
    }

    async handleToggleComments (entryId) {
        if (this.state.expandedId === entryId) {
            this.setState({expandedId: null});
            return;
        }
        this.setState({expandedId: entryId, commentsLoading: true});
        try {
            const comments = await fetchComments(entryId);
            this.setState(state => ({
                expandedId: entryId,
                commentsLoading: false,
                comments: {...state.comments, [entryId]: comments},
                commentInput: ''
            }));
        } catch (err) {
            this.setState({
                commentsLoading: false,
                error: String(err.message || err)
            });
        }
    }

    handleCommentInputChange (e) {
        this.setState({commentInput: e.target.value});
    }

    async handlePostComment (entryId) {
        const content = this.state.commentInput.trim();
        if (!content) return;
        this.setState({error: ''});
        try {
            await submitComment({
                feedbackId: entryId,
                username: this.commentUsername || 'Anonymous',
                content,
                userIdentifier: this.userIdentifier
            });
            const comments = await fetchComments(entryId);
            this.setState(state => ({
                comments: {...state.comments, [entryId]: comments},
                commentInput: ''
            }));
        } catch (err) {
            this.setState({error: String(err.message || err)});
        }
    }

    render () {
        const {intl} = this.props;
        const {entries, loading, error, page, expandedId, comments, commentsLoading, commentInput} = this.state;

        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title)}
                id="communityFeedback"
                onRequestClose={this.handleClose}
            >
                <div className={styles.body}>
                    <div className={styles.header}>
                        <span>{intl.formatMessage(messages.title)}</span>
                    </div>

                    {loading && (
                        <div className={styles.loading}>{intl.formatMessage(messages.loading)}</div>
                    )}

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    {!loading && !error && entries.length === 0 && (
                        <div className={styles.empty}>{intl.formatMessage(messages.empty)}</div>
                    )}

                    {!loading && entries.map((entry, i) => {
                        const entryId = entry.id;
                        const isExpanded = expandedId === entryId;
                        const entryComments = comments[entryId];

                        return (
                            <div
                                key={entryId || i}
                                className={styles.entry}
                            >
                                <div className={styles.entryHeader}>
                                    <div className={styles.entryTitle}>{entry.title}</div>
                                    <div className={styles.entryMeta}>
                                        <span
                                            className={
                                                `${styles.kindBadge} ${
                                                    KIND_BADGE_CLASS[entry.kind] || styles['kind-other']
                                                }`
                                            }
                                        >
                                            {intl.formatMessage(KIND_MESSAGE[entry.kind] || messages.kindOther)}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.entryUsername}>{entry.username}</div>
                                {entry.created_at && (
                                    <div className={styles.entryDate}>{formatDate(entry.created_at)}</div>
                                )}
                                {entry.content && (
                                    <div className={styles.entryContent}>{entry.content}</div>
                                )}
                                {entry.screenshot_url && (
                                    <a
                                        href={entry.screenshot_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            className={styles.entryScreenshot}
                                            src={entry.screenshot_url}
                                            alt="screenshot"
                                        />
                                    </a>
                                )}

                                <div className={styles.commentToggle}>
                                    <button
                                        className={styles.commentToggleBtn}
                                        onClick={this.handleToggleComments(entryId)}
                                    >
                                        {intl.formatMessage(messages.comments)}
                                        {entryComments ? ` (${entryComments.length})` : ''}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className={styles.commentSection}>
                                        {commentsLoading && (
                                            <div className={styles.commentLoading}>
                                                {intl.formatMessage(messages.commentLoading)}
                                            </div>
                                        )}
                                        {!commentsLoading && entryComments && entryComments.length === 0 && (
                                            <div className={styles.noComments}>
                                                {intl.formatMessage(messages.noComments)}
                                            </div>
                                        )}
                                        {!commentsLoading && entryComments && entryComments.map(c => (
                                            <div
                                                key={c.id}
                                                className={styles.comment}
                                            >
                                                <span className={styles.commentUser}>{c.username}</span>
                                                <span className={styles.commentDate}>{formatDate(c.created_at)}</span>
                                                <div className={styles.commentText}>{c.content}</div>
                                            </div>
                                        ))}
                                        <div className={styles.commentForm}>
                                            <input
                                                className={styles.commentInput}
                                                type="text"
                                                placeholder={intl.formatMessage(messages.commentPlaceholder)}
                                                value={commentInput}
                                                onChange={this.handleCommentInputChange}
                                            />
                                            <button
                                                className={styles.commentPostBtn}
                                                onClick={this.handlePostComment(entryId)}
                                                disabled={!commentInput.trim()}
                                            >
                                                {intl.formatMessage(messages.postComment)}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {!loading && entries.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                disabled={page === 0}
                                onClick={this.handlePrevPage}
                            >
                                {intl.formatMessage(messages.previous)}
                            </button>
                            <button
                                className={styles.pageBtn}
                                disabled={entries.length < PAGE_SIZE}
                                onClick={this.handleNextPage}
                            >
                                {intl.formatMessage(messages.next)}
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

CommunityFeedback.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func
};

CommunityFeedback.defaultProps = {
    onClose: () => {}
};

export default injectIntl(CommunityFeedback);
