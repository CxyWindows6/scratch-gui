import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {MduiButton} from '../../lib/mdui';
import styles from './fonts-modal.css';

const AddButton = props => (
    <MduiButton
        variant="filled"
        onClick={props.onClick}
        disabled={props.disabled}
        className={styles.button}
    >
        <FormattedMessage
            defaultMessage="Add"
            description="Part of font management modal. This is the button that will actually add the font."
            id="tw.fonts.add"
        />
    </MduiButton>
);

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default AddButton;
