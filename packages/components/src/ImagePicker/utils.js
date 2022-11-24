import { PERMISSIONS, request } from 'react-native-permissions';

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

            if (permissionStatus === 'granted') {
                resolve(permissionStatus);
            } else {
                reject(permissionStatus);
            }
        } catch (e) {
            reject(permissionStatus);
        }
    });

export const IMAGE_PICKER_ACTIONS = {
    launchCamera: 'launchCamera',
    launchImageLibrary: 'launchImageLibrary',
    removeImage: 'removeImage',
    cancel: 'cancel',
};

export const options = [
    { title: 'Take photo', value: IMAGE_PICKER_ACTIONS.launchCamera, icon: 'camera' },
    { title: 'Choose from library', value: IMAGE_PICKER_ACTIONS.launchImageLibrary, icon: 'folder-image' },
    { title: 'Remove Profile Photo', value: IMAGE_PICKER_ACTIONS.removeImage, icon: 'image-remove' },
    { title: 'cancel', value: IMAGE_PICKER_ACTIONS.cancel, icon: 'cancel' },
];
