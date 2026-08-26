import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import styles from './delete-button.css';
import deleteIcon from './icon--delete.svg';

const messages = defineMessages({
    deleteButtonDescription: {
        id: 'gui.deleteButton.delete',
        description: 'Accessible label for the asset delete button',
        defaultMessage: 'Delete'
    }
});

class DeleteButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleKeyDown'
        ]);
    }
    handleKeyDown (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.props.onClick(event);
        }
    }
    render () {
        return (
            <div
                aria-label={this.props.intl.formatMessage(messages.deleteButtonDescription)}
                className={classNames(
                    styles.deleteButton,
                    this.props.className
                )}
                role="button"
                tabIndex={this.props.tabIndex}
                onClick={this.props.onClick}
                onKeyDown={this.handleKeyDown}
            >
                <div className={styles.deleteButtonVisible}>
                    <img
                        className={styles.deleteIcon}
                        src={deleteIcon}
                        draggable={false}
                    />
                </div>
            </div>
        );
    }
}

DeleteButton.propTypes = {
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onClick: PropTypes.func.isRequired,
    tabIndex: PropTypes.number
};

DeleteButton.defaultProps = {
    tabIndex: 0
};

export default injectIntl(DeleteButton);
