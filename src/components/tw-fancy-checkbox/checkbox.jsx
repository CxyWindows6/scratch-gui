import React from 'react';
import PropTypes from 'prop-types';
import {MduiCheckbox} from '../../lib/mdui';

// Surge Editor: the project-wide fancy checkbox is now an mdui MD3 checkbox.
// The public props contract (checked, onChange, disabled, className) is
// unchanged so every caller (e.g. the settings modal) picks up the Material
// 3 look automatically.
const FancyCheckbox = props => {
    const {checked, onChange, disabled, className, ...rest} = props;
    return (
        <MduiCheckbox
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={className}
            {...rest}
        />
    );
};

FancyCheckbox.propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

export default FancyCheckbox;
