import React from 'react';
import PropTypes from 'prop-types';

// Factory for React 16 wrappers around mdui custom elements.
//
// Web Components in React 16:
//  - Standard DOM events (click, focus, ...) can be passed as React props.
//  - Custom element events (e.g. 'opened', 'closed') are NOT handled by React;
//    they must be bound via ref + addEventListener (per mdui's React guide).
//
// makeMduiComponent(tagName, config) -> React component (with React.forwardRef):
//  - children / className / style / id are passed through unchanged.
//  - camelCase prop names are automatically converted to kebab-case HTML attributes.
//  - DOM properties requiring JavaScript synchronization (value, checked, open, disabled, etc.)
//    are kept in sync with the underlying DOM custom element on mount and update.
//  - Props named in config.events / STANDARD_EVENTS are bound natively via stable event proxies,
//    but only while a handler for that event is actually present in props.
//
// Note: focusin/focusout were dropped from STANDARD_EVENTS — they duplicated the
// focus/blur mapping and no consumer ever passed onFocusIn/onFocusOut.

const STANDARD_EVENTS = {
    onClick: 'click',
    onDoubleClick: 'dblclick',
    onFocus: 'focus',
    onBlur: 'blur',
    onKeyPress: 'keypress',
    onKeyDown: 'keydown',
    onKeyUp: 'keyup',
    onInput: 'input',
    onChange: 'change',
    onInvalid: 'invalid',
    onMouseEnter: 'mouseenter',
    onMouseLeave: 'mouseleave',
    onMouseDown: 'mousedown',
    onMouseUp: 'mouseup',
    onMouseOver: 'mouseover',
    onMouseOut: 'mouseout',
    onScroll: 'scroll',
    onWheel: 'wheel',
    onTouchStart: 'touchstart',
    onTouchEnd: 'touchend',
    onTouchMove: 'touchmove',
    onContextMenu: 'contextmenu',
    onDragStart: 'dragstart',
    onDragEnd: 'dragend',
    onDragOver: 'dragover',
    onDragEnter: 'dragenter',
    onDragLeave: 'dragleave',
    onDrop: 'drop',
    onPaste: 'paste',
    onCopy: 'copy',
    onCut: 'cut'
};

// Properties that need direct JavaScript property synchronization on the DOM node
const SYNC_DOM_PROPERTIES = ['value', 'checked', 'open', 'disabled', 'indeterminate', 'loading'];

// Safe DOM defaults written back when a synchronized prop transitions from
// having a value to being absent/undefined, so elements cannot stay stuck in
// an open/disabled/checked state after such a transition.
// (Only used on updates; mount-time behavior is unchanged.)
const SYNC_DOM_PROPERTY_DEFAULTS = {
    value: '',
    checked: false,
    open: false,
    disabled: false,
    indeterminate: false,
    loading: false
};

const toKebabCase = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const makeMduiComponent = (tagName, config = {}) => {
    // Component-specific custom events win over the standard mapping.
    const events = {...STANDARD_EVENTS, ...config.events};
    const {propTypes = {}, defaultProps = {}, displayName} = config;

    class MduiComponentImpl extends React.Component {
        constructor (props) {
            super(props);
            this.elementRef = React.createRef();
            this.latestProps = props;
            this.boundListeners = new Map(); // native event name -> stable proxy
            this.eventReactProps = new Map(); // native event name -> controlling React prop
            this.attachedEvents = new Set(); // native event names currently attached

            // Create stable proxy handlers for every known event
            Object.keys(events).forEach(reactProp => {
                const nativeName = events[reactProp];
                if (!this.boundListeners.has(nativeName)) {
                    this.eventReactProps.set(nativeName, reactProp);
                    this.boundListeners.set(nativeName, e => {
                        const handler = this.latestProps[reactProp];
                        if (typeof handler === 'function') {
                            handler(e);
                        }
                    });
                }
            });
        }

        componentDidMount () {
            this.bindEvents();
            this.syncProperties();
        }

        componentDidUpdate (prevProps) {
            this.latestProps = this.props;
            this.updateEvents();
            this.syncProperties(prevProps);
        }

        componentWillUnmount () {
            this.unbindEvents();
        }

        setRef = el => {
            this.elementRef.current = el;
            const {forwardedRef} = this.props;
            if (!forwardedRef) return;
            if (typeof forwardedRef === 'function') {
                forwardedRef(el);
            } else {
                forwardedRef.current = el;
            }
        };

        syncProperties (prevProps) {
            const el = this.elementRef.current;
            if (!el) return;

            SYNC_DOM_PROPERTIES.forEach(prop => {
                if (prop in this.props && typeof this.props[prop] !== 'undefined') {
                    if (el[prop] !== this.props[prop]) {
                        el[prop] = this.props[prop];
                    }
                } else if (
                    prevProps &&
                    prop in prevProps &&
                    typeof prevProps[prop] !== 'undefined'
                ) {
                    // The prop transitioned from having a value to being absent
                    // or undefined: write back the safe DOM default so the
                    // element does not stay stuck open/disabled/etc.
                    const defaultValue = SYNC_DOM_PROPERTY_DEFAULTS[prop];
                    if (el[prop] !== defaultValue) {
                        el[prop] = defaultValue;
                    }
                }
            });
        }

        bindEvents () {
            const el = this.elementRef.current;
            if (!el) return;
            // Attach a listener only while its handler prop is actually present.
            this.boundListeners.forEach((handler, nativeName) => {
                const reactProp = this.eventReactProps.get(nativeName);
                if (typeof this.props[reactProp] === 'function') {
                    el.addEventListener(nativeName, handler);
                    this.attachedEvents.add(nativeName);
                }
            });
        }

        updateEvents () {
            const el = this.elementRef.current;
            if (!el) return;
            // Incrementally attach listeners for newly provided handlers and
            // detach those whose handler prop was removed.
            this.boundListeners.forEach((handler, nativeName) => {
                const reactProp = this.eventReactProps.get(nativeName);
                const shouldAttach = typeof this.props[reactProp] === 'function';
                const isAttached = this.attachedEvents.has(nativeName);
                if (shouldAttach && !isAttached) {
                    el.addEventListener(nativeName, handler);
                    this.attachedEvents.add(nativeName);
                } else if (!shouldAttach && isAttached) {
                    el.removeEventListener(nativeName, handler);
                    this.attachedEvents.delete(nativeName);
                }
            });
        }

        unbindEvents () {
            const el = this.elementRef.current;
            if (!el) return;
            this.attachedEvents.forEach(nativeName => {
                el.removeEventListener(nativeName, this.boundListeners.get(nativeName));
            });
            this.attachedEvents.clear();
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                children,
                className,
                style,
                id,
                forwardedRef,
                /* eslint-enable no-unused-vars */
                ...rest
            } = this.props;

            const attrs = {};
            Object.keys(rest).forEach(key => {
                if (key in events) return; // bound via addEventListener, not an attribute
                const value = rest[key];
                if (value === null || typeof value === 'undefined') return;
                // Functions are callbacks or unknown event props; never serialize them to attributes.
                if (typeof value === 'function') return;

                const attrKey = toKebabCase(key);
                if (typeof value === 'boolean') {
                    if (value) attrs[attrKey] = ''; // presence-only attribute
                } else if (Array.isArray(value) || typeof value === 'object') {
                    // Complex objects/arrays shouldn't be stringified as attributes (handled via properties)
                    return;
                } else {
                    attrs[attrKey] = String(value);
                }
            });

            // React 16 treats unknown tags as generic elements: the special
            // `className` prop would be set as a `classname` attribute, never
            // reaching the host's `class`. Pass `class` explicitly instead.
            return React.createElement(
                tagName,
                {...attrs, class: className, style, id, ref: this.setRef},
                children
            );
        }
    }

    MduiComponentImpl.propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        id: PropTypes.string,
        forwardedRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({current: PropTypes.any})
        ]),
        ...propTypes
    };

    const defaultDisplayName = tagName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    const name = displayName || `Mdui${defaultDisplayName}`;

    const MduiForwardedComponent = React.forwardRef((props, ref) => (
        <MduiComponentImpl
            {...props}
            forwardedRef={ref}
        />
    ));

    MduiForwardedComponent.displayName = name;
    MduiForwardedComponent.propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        id: PropTypes.string,
        ...propTypes
    };
    MduiForwardedComponent.defaultProps = defaultProps;

    return MduiForwardedComponent;
};

export default makeMduiComponent;
