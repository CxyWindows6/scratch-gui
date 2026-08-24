import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {closeCommunityFeedbackModal} from '../reducers/modals';
import CommunityFeedbackComponent from '../components/tw-community-feedback/community-feedback.jsx';

class CommunityFeedbackModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose'
        ]);
    }

    handleClose () {
        this.props.onClose();
    }

    render () {
        return (
            <CommunityFeedbackComponent
                onClose={this.handleClose}
                onRequestClose={this.handleClose}
            />
        );
    }
}

CommunityFeedbackModal.propTypes = {
    onClose: PropTypes.func
};

CommunityFeedbackModal.defaultProps = {
    onClose: () => {}
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeCommunityFeedbackModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommunityFeedbackModal);
