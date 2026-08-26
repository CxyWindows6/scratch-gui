import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import TWRenderRecoloredImage from '../../lib/tw-recolor/render.jsx';
import styles from './icon-button.css';

const IconButton = ({
    img,
    disabled,
    className,
    title,
    ariaLabel,
    onClick
}) => {
    const handleKeyDown = e => {
        // Keyboard accessibility for the div-based button: activate on Enter
        // or Space, like a native <button>.
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };
    return (
        <div
            aria-label={ariaLabel}
            className={classNames(
                styles.container,
                className,
                disabled ? styles.disabled : null
            )}
            role="button"
            tabIndex={disabled ? null : 0}
            onClick={disabled ? null : onClick}
            onKeyDown={disabled ? null : handleKeyDown}
        >
            <TWRenderRecoloredImage
                className={styles.icon}
                draggable={false}
                src={img}
            />
            <div className={styles.title}>
                {title}
            </div>
        </div>
    );
};

IconButton.propTypes = {
    ariaLabel: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    img: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    onClick: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired
};

export default IconButton;
