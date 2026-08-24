// Simple REST client for the Surge Editor feedback feature.
// Uses Supabase's PostgREST API + Storage API. No SDK dependency.

import {SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET} from './feedback-config.js';

/**
 * Upload a screenshot blob to the public Supabase storage bucket
 * and return the public URL for that object.
 *
 * @param {Blob} blob - binary image data (PNG/JPEG)
 * @param {string} filename - object name inside bucket
 * @returns {Promise<string>} public URL of the uploaded file
 */
export const uploadScreenshot = async (blob, filename) => {
    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${filename}`,
        {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': blob.type || 'image/png'
            },
            body: blob
        }
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to upload screenshot (${response.status}): ${text}`);
    }
    // Public URL for the uploaded object (public bucket)
    return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${filename}`;
};

/**
 * Insert a new feedback row in the `feedback` table.
 *
 * @param {object} feedback - feedback record
 * @param {string} feedback.title - short title (required)
 * @param {string} feedback.kind - one of bug/feature/translation/other (required)
 * @param {string} feedback.username - submitter username (required)
 * @param {string} feedback.content - long description (required)
 * @param {string} feedback.userIdentifier - persistent random identifier (required)
 * @param {string} [feedback.screenshotUrl] - public URL of an uploaded screenshot
 * @param {string} [feedback.userAgent] - browser UA string for diagnostics
 * @returns {Promise<void>} resolves on success, throws on error
 */
export const submitFeedback = async feedback => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            title: feedback.title,
            kind: feedback.kind,
            username: feedback.username,
            content: feedback.content,
            screenshot_url: feedback.screenshotUrl || null,
            user_agent: feedback.userAgent || null,
            user_identifier: feedback.userIdentifier || null
        })
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to submit feedback (${response.status}): ${text}`);
    }
};

/**
 * Fetch all feedback entries from the `feedback` table, newest first.
 *
 * @param {object} [opts] - options object
 * @param {number} [opts.limit=50] - max rows to return
 * @param {number} [opts.offset=0] - row offset for pagination
 * @returns {Promise<Array<object>>} list of feedback records
 */
export const fetchFeedbackList = async (opts = {}) => {
    const {limit = 50, offset: rowOffset = 0} = opts;

    const tryFetch = async orderCol => {
        const cols = 'id,title,kind,username,content,screenshot_url,user_agent,user_identifier';
        const select = orderCol ? `${cols},${orderCol}` : cols;
        const params = new URLSearchParams({
            select,
            order: orderCol ? `${orderCol}.desc` : 'id.desc',
            limit: String(limit),
            offset: String(rowOffset)
        });
        const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback?${params}`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to fetch feedback (${response.status}): ${text}`);
        }
        return response.json();
    };

    try {
        return await tryFetch('created_at');
    } catch (e) {
        // created_at may not exist; fall back to id-based ordering
        return tryFetch(null);
    }
};

/**
 * Insert a new comment on a feedback entry.
 *
 * @param {object} comment - comment data
 * @param {number} comment.feedbackId - feedback entry id (required)
 * @param {string} comment.username - commenter name (required)
 * @param {string} comment.content - comment text (required)
 * @param {string} comment.userIdentifier - persistent identifier (required)
 * @returns {Promise<void>} resolves when comment is submitted
 */
export const submitComment = async comment => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback_comments`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            feedback_id: comment.feedbackId,
            username: comment.username,
            content: comment.content,
            user_identifier: comment.userIdentifier || null
        })
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to submit comment (${response.status}): ${text}`);
    }
};

/**
 * Fetch all comments for a feedback entry, oldest first.
 *
 * @param {number} feedbackId - feedback entry id
 * @returns {Promise<Array<object>>} list of comment records
 */
export const fetchComments = async feedbackId => {
    const params = new URLSearchParams({
        select: 'id,username,content,user_identifier,created_at',
        feedback_id: `eq.${feedbackId}`,
        order: 'created_at.asc'
    });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback_comments?${params}`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch comments (${response.status}): ${text}`);
    }
    return response.json();
};
