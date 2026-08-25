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
    }
});

const SliderPromptComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="sliderPrompt"
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                {props.intl.formatMessage(messages.minValue)}
            </Box>
            <Box>
                <MduiTextField
                    variant="outlined"
                    label={props.intl.formatMessage(messages.minValue)}
                    name={props.intl.formatMessage(messages.minValue)}
                    pattern="-?[0-9]*(\.[0-9]+)?"
                    value={props.minValue}
                    onInput={props.onChangeMin}
                    onKeyPress={props.onKeyPress}
                />
            </Box>
            <Box className={styles.label}>
                {props.intl.formatMessage(messages.maxValue)}
            </Box>
            <Box>
                <MduiTextField
                    variant="outlined"
                    label={props.intl.formatMessage(messages.maxValue)}
                    name={props.intl.formatMessage(messages.maxValue)}
                    pattern="-?[0-9]*(\.[0-9]+)?"
                    value={props.maxValue}
                    onInput={props.onChangeMax}
                    onKeyPress={props.onKeyPress}
                />
            </Box>
            <Box className={styles.buttonRow}>
                <MduiButton
                    variant="text"
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancelling the dialog"
                        id="gui.sliderPrompt.cancel"
                    />
                </MduiButton>
                <MduiButton
                    variant="text"
                    onClick={props.onOk}
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

SliderPromptComponent.propTypes = {
    intl: intlShape,
    maxValue: PropTypes.string,
    minValue: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onChangeMax: PropTypes.func.isRequired,
    onChangeMin: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

export default injectIntl(SliderPromptComponent);
