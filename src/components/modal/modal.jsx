import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

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
    // Start closed so mdui performs its entrance animation once the dialog
    // is mounted and then opened via state (rather than mounting already-open,
    // which mdui treats as a first render with a zero-duration animation).
    const [open, setOpen] = React.useState(false);
    const closingRef = React.useRef(false);

    React.useEffect(() => {
        const raf = requestAnimationFrame(() => setOpen(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // Once closing starts, keep `open` from being forced back open by an
    // unrelated re-render, and let mdui play the close animation. `onClosed`
    // (fired after the animation) is what finally notifies the caller.
    const beginClose = React.useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setOpen(false);
    }, []);
    return (
        <MduiDialog
            dir={props.isRtl ? 'rtl' : 'ltr'}
            open={open}
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
            onClose={beginClose}
            onClosed={props.onRequestClose}
            className={classNames(styles.modalContent, props.className, {
                [styles.fullScreen]: props.fullScreen
            })}
        >
            <div
                slot="header"
                className={classNames(styles.header, props.headerClassName)}
            >
                {props.onHelp ? (
                    <div className={styles.headerItemHelp}>
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
                    <div className={styles.headerItemTitle}>
                        <img
                            className={styles.headerImage}
                            src={props.headerImage}
                            draggable={false}
                        />
                    </div>
                ) : null}
                <div className={styles.headerItemClose}>
                    {props.fullScreen ? (
                        <MduiButton
                            variant="text"
                            icon="arrow_back"
                            onClick={beginClose}
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
                            onClick={beginClose}
                        />
                    )}
                </div>
            </div>
            {props.children}
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
