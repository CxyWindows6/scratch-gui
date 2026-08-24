import {IDENTIFIER_KEY} from './feedback-config.js';

let cachedIdentifier = null;

export const getOrCreateIdentifier = () => {
    if (cachedIdentifier) return cachedIdentifier;
    try {
        let id = localStorage.getItem(IDENTIFIER_KEY);
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(IDENTIFIER_KEY, id);
        }
        cachedIdentifier = id;
        return id;
    } catch (e) {
        if (!cachedIdentifier) {
            cachedIdentifier = crypto.randomUUID();
        }
        return cachedIdentifier;
    }
};

export const getIdentifier = () => cachedIdentifier;
