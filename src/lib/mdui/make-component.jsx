import React from 'react';
import PropTypes from 'prop-types';

// Factory for React 16 wrappers around mdui custom elements.
//
// Web Components in React 16:
//  - Standard DOM events (click, focus, ...) can be passed as React props.
//  - Custom element events (e.g. 'opened', 'closed') are NOT handled by React;
//    they must be bound via ref + addEventListener (per mdui's React guide).
//
// makeMduiComponent(tagName, config) -> React class component:
//  - children / className / style / id are passed through unchanged.
//  - Every other prop becomes an attribute on the custom element
//    (boolean true -> bare attribute, false -> omitted, others -> String()).
//  - Props named in config.events are bound as native event listeners
//    (React prop 'onOpened' <-> native event 'opened'); handlers are
//    re-bound whenever they change, and removed on unmount.
// React 16 synthetic event names -> native DOM event names.
//
// React 16 does NOT delegate events on custom elements: an onClick (or any
// on*) prop on an unknown tag would be set as an *attribute* instead of
// binding a listener (React warns "Expected listener to be a function").
// Therefore every event prop must be bound natively via addEventListener.
// mdui dispatches its custom events with {bubbles: true, composed: true}, so
// they reach the host element and are caught here as well.
const STANDARD_EVENTS = {
    onClick: 'click',
    onDoubleClick: 'dblclick',
    onFocus: 'focus',
    onBlur: 'blur',
    onFocusIn: 'focusin',
    onFocusOut: 'focusout',
    onKeyPress: 'keypress',
    onKeyDown: 'keydown',
    onKeyUp: 'keyup',
    onInput: 'input',
    onChange: 'change',
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

const makeMduiComponent = (tagName, config = {}) => {
    // Component-specific custom events win over the standard mapping.
    const events = {...STANDARD_EVENTS, ...config.events};
    const {propTypes = {}, defaultProps = {}, displayName} = config;

    class MduiComponent extends React.Component {
        constructor (props) {
            super(props);
            this.elementRef = React.createRef();
            this.boundEvents = [];
        }

        componentDidMount () {
            this.bindEvents();
        }

        componentDidUpdate (prevProps) {
            // Rebind whenever handler identity changes.
            if (Object.keys(events).some(key => this.props[key] !== prevProps[key])) {
                this.unbindEvents();
                this.bindEvents();
            }
        }

        componentWillUnmount () {
            this.unbindEvents();
        }

        bindEvents () {
            const el = this.elementRef.current;
            if (!el) return;
            Object.keys(events).forEach(reactProp => {
                const handler = this.props[reactProp];
                if (typeof handler === 'function') {
                    const nativeName = events[reactProp];
                    el.addEventListener(nativeName, handler);
                    this.boundEvents.push([nativeName, handler]);
                }
            });
        }

        unbindEvents () {
            const el = this.elementRef.current;
            if (!el) return;
            this.boundEvents.forEach(([name, handler]) => {
                el.removeEventListener(name, handler);
            });
            this.boundEvents = [];
        }

        render () {
            const {children, className, style, id, ...rest} = this.props;
            const attrs = {};
            Object.keys(rest).forEach(key => {
                if (key in events) return; // bound via addEventListener, not an attribute
                const value = rest[key];
                if (value === null || typeof value === 'undefined') return;
                // Functions are callbacks (e.g. BufferedInput's onSubmit) or
                // unknown event props; never serialize them to attributes.
                if (typeof value === 'function') return;
                if (typeof value === 'boolean') {
                    if (value) attrs[key] = ''; // presence-only attribute
                } else {
                    attrs[key] = String(value);
                }
            });
            // React 16 treats unknown tags as generic elements: the special
            // `className` prop would be set as a `classname` attribute, never
            // reaching the host's `class` (so CSS class selectors / CSS
            // Modules never matched). Pass `class` explicitly instead.
            return React.createElement(
                tagName,
                {...attrs, class: className, style, id, ref: this.elementRef},
                children
            );
        }
    }

    MduiComponent.displayName = displayName || `Mdui${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`;
    MduiComponent.propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        id: PropTypes.string,
        ...propTypes
    };
    MduiComponent.defaultProps = defaultProps;
    return MduiComponent;
};

export default makeMduiComponent;
