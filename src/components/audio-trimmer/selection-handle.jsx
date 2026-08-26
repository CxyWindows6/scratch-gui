import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import styles from './audio-trimmer.css';

// Inlined from icon--handle.svg. Colors come from currentColor so that CSS
// theme tokens can control the tint per context (.selector vs. .trimmer)
// instead of relying on a hue-rotate filter on an <img>.
const HandleIcon = () => (
    <svg
        height="34"
        viewBox="1 1 33 33"
        width="34"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <path
                d="M17 5c6.627 0 12 5.373 12 12v12H17c-6.627 0-12-5.373-12-12S10.373 5 17 5Z"
                id="audioTrimmerHandleArc"
            />
        </defs>
        <path
            d="M17 4.5C10.102 4.5 4.5 10.102 4.5 17S10.102 29.5 17 29.5 29.5 23.898 29.5 17V4.5Z"
            fill="currentColor"
            fillRule="evenodd"
        />
        <use
            fill="none"
            href="#audioTrimmerHandleArc"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="8"
            transform="matrix(1 0 0 -1 0 34)"
        />
    </svg>
);

const SelectionHandle = props => (
    <Box
        className={classNames(styles.trimLine, props.handleStyle)}
        onMouseDown={props.onMouseDown}
        onTouchStart={props.onMouseDown}
    >
        <Box className={classNames(styles.trimHandle, styles.topTrimHandle)}>
            <HandleIcon />
        </Box>
        <Box className={classNames(styles.trimHandle, styles.bottomTrimHandle)}>
            <HandleIcon />
        </Box>
    </Box>
);

SelectionHandle.propTypes = {
    handleStyle: PropTypes.string,
    onMouseDown: PropTypes.func
};

export default SelectionHandle;
