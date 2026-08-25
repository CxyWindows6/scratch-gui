import PropTypes from 'prop-types';
import React from 'react';

import {MduiButton} from '../../lib/mdui';

// Surge Editor: the project-wide button base is now an mdui (MD3) outlined
// button. The public props contract is unchanged so all callers automatically
// get the Material 3 look. `iconSrc` remains an SVG image (not an mdui icon
// name), rendered before the children.
const ButtonComponent = ({
    className,
    disabled,
    iconClassName,
    iconSrc,
    iconWidth,
    iconHeight,
    onClick,
    children,
    ...props
}) => {
    if (disabled) {
        onClick = function () {};
    }

    const icon = iconSrc && (
        <img
            className={iconClassName}
            draggable={false}
            src={iconSrc}
            height={iconHeight}
            width={iconWidth}
        />
    );

    return (
        <MduiButton
            variant="outlined"
            className={className}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {icon}
            {children}
        </MduiButton>
    );
};

ButtonComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    iconHeight: PropTypes.number,
    iconWidth: PropTypes.number,
    onClick: PropTypes.func
};

export default ButtonComponent;
