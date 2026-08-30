import classNames from 'classnames';
import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import {MduiTooltip} from '../../lib/mdui';

import styles from './coming-soon.css';

import awwCatIcon from './aww-cat.png';
import coolCatIcon from './cool-cat.png';

const messages = defineMessages({
    message1: {
        defaultMessage: 'Don\'t worry, we\'re on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message1'
    },
    message2: {
        defaultMessage: 'Coming Soon...',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message2'
    },
    message3: {
        defaultMessage: 'We\'re working on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message3'
    }
});

// Randomly chooses one of the messages to display in the tooltip.
const getRandomMessage = () => {
    const images = [awwCatIcon, coolCatIcon];
    const messageNumber = Math.floor(Math.random() * Object.keys(messages).length) + 1;
    const imageNumber = Math.floor(Math.random() * Object.keys(images).length);
    return (
        <FormattedMessage
            {...messages[`message${messageNumber}`]}
            values={{
                emoji: (
                    <img
                        className={styles.comingSoonImage}
                        src={images[imageNumber]}
                        draggable={false}
                        alt="" /* decorative emoji */
                    />
                )
            }}
        />
    );
};

// D2: migrated from react-tooltip to mdui-tooltip. The first default-slot
// child is the trigger target; the `content` slot child is the tooltip body.
// mdui adds role="tooltip", hover+focus triggering and RTL-aware placement.
const ComingSoonTooltip = props => (
    <MduiTooltip
        className={classNames(styles.comingSoon, props.className)}
        placement={props.place}
        trigger="hover focus"
        openDelay={props.delayShow}
        closeDelay={props.delayHide}
    >
        <div className={styles.target}>
            {props.children}
        </div>
        <div
            slot="content"
            className={classNames(styles.content, props.tooltipClassName)}
        >
            {getRandomMessage()}
        </div>
    </MduiTooltip>
);

ComingSoonTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delayHide: PropTypes.number,
    delayShow: PropTypes.number,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipClassName: PropTypes.string
};

ComingSoonTooltip.defaultProps = {
    delayHide: 0,
    delayShow: 0
};

export {
    ComingSoonTooltip
};
