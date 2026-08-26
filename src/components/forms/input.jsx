import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import {MduiTextField} from '../../lib/mdui';
import styles from './input.css';

// Surge Editor: the project-wide text input is now an mdui (MD3) outlined
// text field. The props contract is unchanged; callers pass `onChange` with
// React semantics (fires on every keystroke), which is mapped to mdui's
// `input` event (mdui's `change` event only fires on blur).
//
// `small` applies a compact modifier class to the host element; the compact
// height/typography itself lives in input.css as ::part() rules (mdui v2 has
// no built-in dense class or attribute).
const Input = props => {
    const {
        small,
        className,
        onChange,
        label,
        ...componentProps
    } = props;
    return (
        <MduiTextField
            variant="outlined"
            {...componentProps}
            onInput={onChange}
            // mdui's label attribute must be a string; callers sometimes pass
            // a React element (rendered by the surrounding <Label> component),
            // which must not be serialized to an attribute.
            label={typeof label === 'string' ? label : null}
            className={classNames(className, {
                [styles.small]: small
            })}
        />
    );
};

Input.propTypes = {
    className: PropTypes.string,
    label: PropTypes.node,
    onChange: PropTypes.func,
    small: PropTypes.bool
};

Input.defaultProps = {
    small: false
};

export default Input;
