import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import greenFlagIcon from './icon--green-flag.svg';
import styles from './green-flag.css';

const messages = defineMessages({
    goDescription: {
        id: 'gui.greenFlag.go',
        description: 'Accessible label for the green flag button, which starts all scripts',
        defaultMessage: 'Green flag: start all scripts'
    }
});

// Activate with Enter / Space, like a native button
const activateKeyDown = action => e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action(e);
    }
};

const GreenFlagComponent = function (props) {
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
                styles.greenFlag,
                {
                    [styles.isActive]: active
                }
            )}
            draggable={false}
            src={greenFlagIcon}
            title={title}
            onClick={onClick}
            // tw: also fire click when opening context menu (right click on all systems and alt+click on chromebooks)
            onContextMenu={onClick}
            role="button"
            tabIndex={0}
            aria-label={intl.formatMessage(messages.goDescription)}
            onKeyDown={activateKeyDown(onClick)}
            {...componentProps}
        />
    );
};
GreenFlagComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};
GreenFlagComponent.defaultProps = {
    active: false,
    title: 'Go'
};
export default injectIntl(GreenFlagComponent);
