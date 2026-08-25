import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {MduiTextField} from '../../lib/mdui';
import styles from './filter.css';

const FilterComponent = props => {
    const {
        className,
        onChange,
        onClear,
        placeholderText,
        filterQuery,
        inputClassName
    } = props;
    return (
        <div
            className={classNames(className, styles.filter, {
                [styles.isActive]: filterQuery.length > 0
            })}
        >
            <MduiTextField
                variant="outlined"
                icon="search"
                className={classNames(styles.filterInput, inputClassName)}
                placeholder={placeholderText}
                type="text"
                value={filterQuery}
                onInput={onChange}
                clearable
                onClear={onClear}
            />
        </div>
    );
};

FilterComponent.propTypes = {
    className: PropTypes.string,
    filterQuery: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    placeholderText: PropTypes.string
};
FilterComponent.defaultProps = {
    placeholderText: 'Search'
};
export default FilterComponent;
