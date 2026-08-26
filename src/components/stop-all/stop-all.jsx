import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import stopAllIcon from './icon--stop-all.svg';
import styles from './stop-all.css';

const messages = defineMessages({
    stopDescription: {
        id: 'gui.stopAll.stop',
        description: 'Accessible label for the stop button, which stops all scripts and sounds',
        defaultMessage: 'Stop flag: stop all scripts'
    }
});

// Activate with Enter / Space, like a native button
const activateKeyDown = action => e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action(e);
    }
};

const StopAllComponent = function (props) {
    const {
        active,
        className,
        intl,
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.stopAll,
                {
                    [styles.isActive]: active
                }
            )}
            draggable={false}
            src={stopAllIcon}
            title={title}
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-label={intl.formatMessage(messages.stopDescription)}
            onKeyDown={activateKeyDown(onClick)}
            {...componentProps}
        />
    );
};

StopAllComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

StopAllComponent.defaultProps = {
    active: false,
    title: 'Stop'
};

export default injectIntl(StopAllComponent);
