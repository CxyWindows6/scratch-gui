import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Box from '../box/box.jsx';
import {MduiDialog, MduiButton, MduiIconButton} from '../../lib/mdui';

import styles from './modal.css';

const messages = defineMessages({
    close: {
        defaultMessage: 'Close',
        description: 'Close button in modal',
        id: 'gui.modal.close'
    }
});

const ModalComponent = props => {
    // Set as soon as the mdui dialog starts closing (ESC key, overlay click,
    // back button). While it is true, the `open` prop below stays false so
    // that the wrapper's componentDidUpdate property sync cannot force the
    // dialog back open in the middle of its close animation when an unrelated
    // Redux update re-renders this component. The ref resets naturally when
    // the modal is unmounted and later recreated.
    const closingRef = React.useRef(false);
    // Marks this dialog instance as closing so the wrapper stops forcing
    // `open` back to true during the close animation.
    const handleCloseBegin = React.useCallback(() => {
        closingRef.current = true;
    }, []);
    return (
        <MduiDialog
            open={!closingRef.current}
            fullscreen={props.fullScreen}
            /* Only string labels can become an attribute; node labels are the
               caller's responsibility (they must provide their own label). */
            aria-label={
                typeof props.contentLabel === 'string' ?
                    props.contentLabel :
                    null
            }
            closeOnEsc
            closeOnOverlayClick
            onClose={handleCloseBegin}
            onClosed={props.onRequestClose}
            className={classNames(styles.modalContent, props.className, {
                [styles.fullScreen]: props.fullScreen
            })}
        >
            <Box
                dir={props.isRtl ? 'rtl' : 'ltr'}
                direction="column"
                grow={1}
            >
                <div className={classNames(styles.header, props.headerClassName)}>
                    {props.onHelp ? (
                        <div
                            className={classNames(
                                styles.headerItem,
                                styles.headerItemHelp
                            )}
                        >
                            <MduiButton
                                variant="text"
                                icon="help"
                                onClick={props.onHelp}
                            >
                                <FormattedMessage
                                    defaultMessage="Help"
                                    description="Help button in modal"
                                    id="gui.modal.help"
                                />
                            </MduiButton>
                        </div>
                    ) : null}
                    {props.headerImage ? (
                        <div
                            className={classNames(
                                styles.headerItem,
                                styles.headerItemTitle
                            )}
                        >
                            <img
                                className={styles.headerImage}
                                src={props.headerImage}
                                draggable={false}
                            />
                        </div>
                    ) : null}
                    <div
                        className={classNames(
                            styles.headerItem,
                            styles.headerItemClose
                        )}
                    >
                        {props.fullScreen ? (
                            <MduiButton
                                variant="text"
                                icon="arrow_back"
                                onClick={props.onRequestClose}
                            >
                                <FormattedMessage
                                    defaultMessage="Back"
                                    description="Back button in modal"
                                    id="gui.modal.back"
                                />
                            </MduiButton>
                        ) : (
                            <MduiIconButton
                                icon="close"
                                aria-label={props.intl.formatMessage(messages.close)}
                                onClick={props.onRequestClose}
                            />
                        )}
                    </div>
                </div>
                {props.children}
            </Box>
        </MduiDialog>
    );
};

ModalComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    fullScreen: PropTypes.bool,
    headerClassName: PropTypes.string,
    headerImage: PropTypes.string,
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    onHelp: PropTypes.func,
    onRequestClose: PropTypes.func
};

export default injectIntl(ModalComponent);
