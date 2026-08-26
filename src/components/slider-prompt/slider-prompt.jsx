import classNames from 'classnames';
import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import {MduiTextField, MduiButton} from '../../lib/mdui';

import styles from './slider-prompt.css';


const messages = defineMessages({
    minValue: {
        defaultMessage: 'Minimum value',
        description: 'Label of slider modal',
        id: 'gui.sliderModal.min'
    },
    maxValue: {
        defaultMessage: 'Maximum value',
        description: 'Label of slider modal',
        id: 'gui.sliderModal.max'
    },
    title: {
        defaultMessage: 'Change slider range',
        description: 'Title of slider modal',
        id: 'gui.sliderModal.title'
    },
    invalidNumber: {
        defaultMessage: 'Please enter a valid number.',
        description: 'Error shown when a slider range field is empty or not a number',
        id: 'gui.sliderModal.invalidNumber'
    }
});

class SliderPromptComponent extends React.Component {
    constructor (props) {
        super(props);
        // Refs reach the mdui-text-field host elements (the wrapper forwards
        // them); the hosts implement focus() and delegate it to the inner
        // input, which we use to focus the first invalid field.
        this.minFieldRef = React.createRef();
        this.maxFieldRef = React.createRef();
    }
    componentDidUpdate (prevProps) {
        // The container bumps errorNonce on every failed submit attempt, so
        // each failed OK re-focuses the first invalid field.
        if (prevProps.errorNonce !== this.props.errorNonce) {
            if (this.props.minError && this.minFieldRef.current) {
                this.minFieldRef.current.focus();
            } else if (this.props.maxError && this.maxFieldRef.current) {
                this.maxFieldRef.current.focus();
            }
        }
    }
    render () {
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(messages.title)}
                id="sliderPrompt"
                onRequestClose={this.props.onCancel}
            >
                <Box className={styles.body}>
                    <Box className={styles.label}>
                        {this.props.intl.formatMessage(messages.minValue)}
                    </Box>
                    <Box>
                        <MduiTextField
                            variant="outlined"
                            className={classNames({
                                [styles.fieldError]: this.props.minError
                            })}
                            label={this.props.intl.formatMessage(messages.minValue)}
                            name={this.props.intl.formatMessage(messages.minValue)}
                            pattern="-?[0-9]*(\.[0-9]+)?"
                            value={this.props.minValue}
                            onInput={this.props.onChangeMin}
                            onKeyPress={this.props.onKeyPress}
                            ref={this.minFieldRef}
                        />
                        {this.props.minError ? (
                            <Box className={styles.errorMessage}>
                                {this.props.intl.formatMessage(messages.invalidNumber)}
                            </Box>
                        ) : null}
                    </Box>
                    <Box className={styles.label}>
                        {this.props.intl.formatMessage(messages.maxValue)}
                    </Box>
                    <Box>
                        <MduiTextField
                            variant="outlined"
                            className={classNames({
                                [styles.fieldError]: this.props.maxError
                            })}
                            label={this.props.intl.formatMessage(messages.maxValue)}
                            name={this.props.intl.formatMessage(messages.maxValue)}
                            pattern="-?[0-9]*(\.[0-9]+)?"
                            value={this.props.maxValue}
                            onInput={this.props.onChangeMax}
                            onKeyPress={this.props.onKeyPress}
                            ref={this.maxFieldRef}
                        />
                        {this.props.maxError ? (
                            <Box className={styles.errorMessage}>
                                {this.props.intl.formatMessage(messages.invalidNumber)}
                            </Box>
                        ) : null}
                    </Box>
                    <Box className={styles.buttonRow}>
                        <MduiButton
                            variant="text"
                            onClick={this.props.onCancel}
                        >
                            <FormattedMessage
                                defaultMessage="Cancel"
                                description="Button in prompt for cancelling the dialog"
                                id="gui.sliderPrompt.cancel"
                            />
                        </MduiButton>
                        <MduiButton
                            variant="filled"
                            onClick={this.props.onOk}
                        >
                            <FormattedMessage
                                defaultMessage="OK"
                                description="Button in prompt for confirming the dialog"
                                id="gui.sliderPrompt.ok"
                            />
                        </MduiButton>
                    </Box>
                </Box>
            </Modal>
        );
    }
}

SliderPromptComponent.propTypes = {
    errorNonce: PropTypes.number,
    intl: intlShape,
    maxError: PropTypes.bool,
    maxValue: PropTypes.string,
    minError: PropTypes.bool,
    minValue: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onChangeMax: PropTypes.func.isRequired,
    onChangeMin: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

SliderPromptComponent.defaultProps = {
    errorNonce: 0,
    maxError: false,
    minError: false
};

export default injectIntl(SliderPromptComponent);
