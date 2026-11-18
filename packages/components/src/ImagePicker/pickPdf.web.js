import { PDF_MIME_TYPE, base64OfBlob } from './utils';

/**
 * One PDF chosen with the browser's own file chooser, `<input type="file" accept="application/pdf">`, on the same page
 * (canon §9.8.1 step 1, owner 2026-11-18), as the same asset the native `pickPdf` gives. The input is opened from the
 * tap that chose «Upload PDF», as a browser requires of a file chooser. Resolves `null` when the user closes the chooser
 * without a file (the input's `cancel` event); rejects when the file cannot be read.
 */
const pickPdf = () =>
    new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = PDF_MIME_TYPE;
        input.addEventListener(
            'change',
            () => {
                const [file] = input.files ?? [];
                if (!file) {
                    resolve(null);
                    return;
                }
                base64OfBlob(file).then(
                    (base64) =>
                        resolve({
                            uri: URL.createObjectURL(file),
                            base64,
                            type: PDF_MIME_TYPE,
                            fileName: file.name,
                            fileSize: file.size,
                        }),
                    reject
                );
            },
            { once: true }
        );
        input.addEventListener('cancel', () => resolve(null), { once: true });
        input.click();
    });

export default pickPdf;
