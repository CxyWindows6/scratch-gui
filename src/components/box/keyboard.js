/**
 * Build an onKeyDown handler that lets a non-native interactive element
 * (for example a div styled as a button) respond to keyboard activation.
 * Enter and Space both trigger the given click handler, matching the
 * behavior of a native <button>.
 *
 * @param {Function} handler - The click handler to invoke; may be falsy.
 * @returns {Function} An onKeyDown handler for the element.
 */
const activateByKeyboard = handler => e => {
    if (!handler) return;
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
    }
};

export {activateByKeyboard};
