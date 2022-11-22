import { PermissionsAndroid } from 'react-native';

export const checkAndAskForPermission = () =>
    new Promise(async (resolve, reject) => {
        let permissionStatus;
        try {
            if (Platform.OS === 'android') {
                permissionStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                // permissionStatus = await PermissionsAndroid.request(android.permission.WRITE_EXTERNAL_STORAGE);
            } else {
                //  Missing permission settings for ios
                permissionStatus = 'granted';
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
