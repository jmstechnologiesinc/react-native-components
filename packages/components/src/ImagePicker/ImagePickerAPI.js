import { Linking, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { checkAndAskForPermissionCamara, checkAndAskForPermissionMediaLibrary } from './utils';

class ImagePickerAPI {
    constructor(
        titlePermissionCamera,
        titlePermissionPhotos,
        descriptionPermissionCamera,
        descriptionPermissionPhotos,
        cancelPermission,
        settingPermission
    ) {
        this.titlePermissionCamera = titlePermissionCamera;
        this.titlePermissionPhotos = titlePermissionPhotos;
        this.descriptionPermissionCamera = descriptionPermissionCamera;
        this.descriptionPermissionPhotos = descriptionPermissionPhotos;
        this.cancelPermission = cancelPermission;
        this.settingPermission = settingPermission;
    }

    catchPermissionStatusCamara() {
        Alert.alert(
            this.titlePermissionCamera,
            this.descriptionPermissionCamera,
            [
                {
                    text: this.cancelPermission,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.settingPermission,
                    onPress: () => Linking.openSettings(),
                },
            ],
            { cancelable: false }
        );
    }

    catchPermissionStatusPhotos() {
        Alert.alert(
            this.titlePermissionPhotos,
            this.descriptionPermissionPhotos,
            [
                {
                    text: this.cancelPermission,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.settingPermission,
                    onPress: () => Linking.openSettings(),
                },
            ],
            { cancelable: false }
        );
    }

    async takePhoto(imagePickerOptions) {
        await checkAndAskForPermissionCamara()
            .then(() => launchCamera({ mediaType: 'photo', quality: 0.5 }))
            .then((response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    Alert(response.error);
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    imagePickerOptions(response?.assets[0]);
                }
            })
            .catch(() => this.catchPermissionStatusCamara());
    }

    async chooseFromLibrary(imagePickerOptions) {
        await checkAndAskForPermissionMediaLibrary();
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 })
            .then((response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    Alert(response.error);
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    imagePickerOptions(response?.assets[0]);
                }
            })
            .catch(() => this.catchPermissionStatusPhotos());
    }
}

export default ImagePickerAPI;
