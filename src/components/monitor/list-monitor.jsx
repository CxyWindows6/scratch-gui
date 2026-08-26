import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import styles from './monitor.css';
import ListMonitorScroller from './list-monitor-scroller.jsx';

const messages = defineMessages({
    addItem: {
        id: 'gui.monitor.listMonitor.addItem',
        description: 'Button in the list monitor footer to append an item',
        defaultMessage: 'Add item'
    },
    resize: {
        id: 'gui.monitor.listMonitor.resize',
        description: 'Handle in the list monitor footer to resize the monitor by dragging',
        defaultMessage: 'Resize list'
    }
});

// Activate div buttons with Enter / Space, like native <button> elements
const buttonKeyDownHandler = action => e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action(e);
    }
};

const ListMonitor = ({draggable, intl, label, width, height, value, onResizeMouseDown, onAdd, ...rowProps}) => (
    <div
        className={styles.listMonitor}
        style={{
            width: `${width}px`,
            height: `${height}px`
        }}
    >
        <div className={styles.listHeader}>
            {label}
        </div>
        <div className={styles.listBody}>
            <ListMonitorScroller
                draggable={draggable}
                height={height}
                values={value}
                width={width}
                {...rowProps}
            />
        </div>
        <div className={styles.listFooter}>
            <div
                aria-label={draggable ? intl.formatMessage(messages.addItem) : null}
                className={classNames(draggable ? styles.addButton : null, 'no-drag')}
                onClick={draggable ? onAdd : null}
                onKeyDown={draggable ? buttonKeyDownHandler(onAdd) : null}
                role={draggable ? 'button' : null}
                tabIndex={draggable ? 0 : null}
            >
                {'+' /* TODO waiting on asset */}
            </div>
            <div className={styles.footerLength}>
                <FormattedMessage
                    defaultMessage="length {length}"
                    description="Length label on list monitors. DO NOT translate {length} (with brackets)."
                    id="gui.monitor.listMonitor.listLength"
                    values={{
                        length: value.length
                    }}
                />
            </div>
            <div
                aria-label={draggable ? intl.formatMessage(messages.resize) : null}
                className={classNames(draggable ? styles.resizeHandle : null, 'no-drag')}
                onMouseDown={draggable ? onResizeMouseDown : null}
                onKeyDown={draggable ? buttonKeyDownHandler(e => {
                    // Start resizing from the center of the handle
                    const rect = e.currentTarget.getBoundingClientRect();
                    onResizeMouseDown({
                        clientX: rect.left + (rect.width / 2),
                        clientY: rect.top + (rect.height / 2)
                    });
                }) : null}
                role={draggable ? 'button' : null}
                tabIndex={draggable ? 0 : null}
            >
                {'=' /* TODO waiting on asset */}
            </div>
        </div>
    </div>
);

ListMonitor.propTypes = {
    activeIndex: PropTypes.number,
    categoryColor: PropTypes.shape({
        background: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    }).isRequired,
    draggable: PropTypes.bool.isRequired,
    height: PropTypes.number,
    intl: intlShape.isRequired,
    label: PropTypes.string.isRequired,
    onActivate: PropTypes.func,
    onAdd: PropTypes.func,
    onResizeMouseDown: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]))
    ]),
    width: PropTypes.number
};

ListMonitor.defaultProps = {
    width: 110,
    height: 200
};

export default injectIntl(ListMonitor);
