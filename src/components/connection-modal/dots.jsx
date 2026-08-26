import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import styles from './connection-modal.css';

const Dots = props => (
    <Box
        className={classNames(
            props.className,
            styles.dotsRow
        )}
    >
        <FormattedMessage
            defaultMessage="Step {current} of {total}"
            description="Accessible label indicating the current step of the connection process"
            id="gui.connection.stepCounter"
            values={{
                current: typeof props.counter === 'number' ? props.counter + 1 : props.total,
                total: props.total
            }}
        >
            {stepLabel => (
                <div
                    aria-label={stepLabel}
                    className={classNames(
                        styles.dotsHolder,
                        {
                            [styles.dotsHolderError]: props.error,
                            [styles.dotsHolderSuccess]: props.success
                        }
                    )}
                    role="group"
                >
                    {Array(props.total).fill(0)
                        .map((_, i) => {
                            let type = 'inactive';
                            if (props.counter === i) type = 'active';
                            if (props.success) type = 'success';
                            if (props.error) type = 'error';
                            return (<Dot
                                key={`dot-${i}`}
                                type={type}
                            />);
                        })}
                </div>
            )}
        </FormattedMessage>
    </Box>
);

Dots.propTypes = {
    className: PropTypes.string,
    counter: PropTypes.number,
    error: PropTypes.bool,
    success: PropTypes.bool,
    total: PropTypes.number
};

const Dot = props => (
    <div
        className={classNames(
            styles.dot,
            {
                [styles.inactiveStepDot]: props.type === 'inactive',
                [styles.activeStepDot]: props.type === 'active',
                [styles.successDot]: props.type === 'success',
                [styles.errorDot]: props.type === 'error'
            }
        )}
    />
);

Dot.propTypes = {
    type: PropTypes.string
};

export default Dots;
