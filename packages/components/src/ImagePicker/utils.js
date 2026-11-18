import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';

// The type of a PDF picked: the server reads the bytes, the app shows a PDF as a file, not as an image.
export const PDF_MIME_TYPE = 'application/pdf';

/** Whether a picked asset is a PDF (`pickPdf`), not a photo. */
export const isPdfAsset = (asset) => asset?.type === PDF_MIME_TYPE;

/**
 * A Blob's bytes in base64 (a data URL without its prefix), as the upload callable takes a page: the same `base64` a
 * photo of react-native-image-picker carries. `FileReader` is the platform's own, in React Native and in the browser.
 */
export const base64OfBlob = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result);
            resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });

export const checkAndAskForPermissionCamara = () =>
    new Promise(async (resolve, reject) => {
        let permissionStatus;
        try {
            if (Platform.OS === 'android') {
                permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
            } else {
                permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
            }

            if (permissionStatus === 'granted') {
                resolve(permissionStatus);
            } else {
                reject(permissionStatus);
            }
        } catch (e) {
            reject(permissionStatus);
        }
    });

export const checkAndAskForPermissionMediaLibrary = () =>
    new Promise(async (resolve, reject) => {
        let permissionStatus;
        try {
            if (Platform.OS === 'android') {
                permissionStatus = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            } else {
                permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
            }

            if (Platform.OS === 'web') {
                resolve(permissionStatus);
            }
            if (permissionStatus === 'granted') {
                resolve(permissionStatus);
            } else {
                reject(permissionStatus);
            }
        } catch (e) {
            reject(permissionStatus);
        }
    });
