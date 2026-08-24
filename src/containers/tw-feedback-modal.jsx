import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {closeFeedbackModal, openCommunityFeedbackModal} from '../reducers/modals';
import FeedbackModalComponent from '../components/tw-feedback-modal/feedback-modal.jsx';

class FeedbackModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleOpenCommunity'
        ]);
    }

    handleClose () {
        this.props.onClose();
    }

    handleOpenCommunity () {
        this.props.onClose();
        this.props.onOpenCommunity();
    }

    render () {
        return (
            <FeedbackModalComponent
                onClose={this.handleClose}
                onRequestClose={this.handleClose}
                onOpenCommunity={this.handleOpenCommunity}
            />
        );
    }
}

FeedbackModal.propTypes = {
    onClose: PropTypes.func,
    onOpenCommunity: PropTypes.func // ✅ 补上这行的校验
};

FeedbackModal.defaultProps = {
    onClose: () => {},
    onOpenCommunity: () => {} // ✅ 建议补上默认空函数
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeFeedbackModal()),
    onOpenCommunity: () => dispatch(openCommunityFeedbackModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeedbackModal);
