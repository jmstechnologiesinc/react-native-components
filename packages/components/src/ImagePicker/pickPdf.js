import { errorCodes, isErrorWithCode, keepLocalCopy, pick, types } from '@react-native-documents/picker';

import { PDF_MIME_TYPE, base64OfBlob } from './utils';

/**
 * One PDF chosen with the system's document picker (canon §9.8.1 step 1, owner 2026-11-18: the PDF is chosen inside
 * the app, without opening another page), as an asset shaped like a photo of react-native-image-picker — `uri`,
 * `base64`, `type`, `fileName`, `fileSize` — so it travels through the same `onChange(asset)` and the same upload.
 *
 * The picked `content://` (Android) or security-scoped (iOS) uri is copied into the app's caches first
 * (`keepLocalCopy`, the library's documented way to read a picked file), then read with `fetch` + `FileReader`.
 * Resolves `null` when the user cancels; rejects on any other failure (the caller tells the user).
 */
const pickPdf = async () => {
    let file;
    try {
        [file] = await pick({ type: [types.pdf] });
    } catch (error) {
        if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) return null;
        throw error;
    }
    const fileName = file.name ?? 'document.pdf';
    const [copy] = await keepLocalCopy({ files: [{ uri: file.uri, fileName }], destination: 'cachesDirectory' });
    if (copy.status !== 'success') throw new Error(copy.copyError);
    const blob = await (await fetch(copy.localUri)).blob();
    return {
        uri: copy.localUri,
        base64: await base64OfBlob(blob),
        type: PDF_MIME_TYPE,
        fileName,
        fileSize: file.size ?? blob.size,
    };
};

export default pickPdf;
