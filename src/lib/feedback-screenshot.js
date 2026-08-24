// Read an image file chosen by the user, downscale it to a reasonable size
// (so we don't overload the free Supabase tier) and return a PNG Blob.

const MAX_WIDTH = 1600;

const readImage = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Invalid image file'));
        image.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
});

const canvasToBlob = (canvas, type) => new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Could not export image'));
    }, type, 0.9);
});

/**
 * Read user-picked file, downscale to max width 1600 (preserving aspect),
 * and return a PNG blob ready to upload.
 *
 * @param {File} file - file from input[type=file]
 * @returns {Promise<{blob: Blob, previewUrl: string}>} image blob and preview data URL
 */
export const prepareScreenshot = async file => {
    const image = await readImage(file);
    const targetWidth = Math.min(MAX_WIDTH, image.naturalWidth);
    const scale = targetWidth / image.naturalWidth;
    const targetHeight = Math.round(image.naturalHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const blob = await canvasToBlob(canvas, 'image/png');
    const previewUrl = canvas.toDataURL('image/png');
    return {blob, previewUrl};
};

export const generateFilename = () => {
    const date = new Date();
    const pad = n => String(n).padStart(2, '0');
    const stamp =
        `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
        `-${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
    return `feedback-${stamp}-${Math.floor(Math.random() * 1e6)}.png`;
};
