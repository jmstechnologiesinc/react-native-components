import { Linking, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { checkAndAskForPermissionCamara, checkAndAskForPermissionMediaLibrary } from './utils';

class ImagePickerAPI {
    constructor(titlePermission, descriptionPermission, carcelPermission, settingPermission) {
        this.titlePermission = titlePermission;
        this.descriptionPermission = descriptionPermission;
        this.carcelPermission = carcelPermission;
        this.settingPermission = settingPermission;

        this.catchPermissionStatus = function () {
            Alert.alert(
                this.titlePermission,
                descriptionPermission,
                [
                    {
                        text: carcelPermission,
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: settingPermission,
                        onPress: () => Linking.openSettings(),
                    },
                ],
                { cancelable: false }
            );
        };
    }

    async oneTakePhoto(imagePickerOptions) {
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
            .catch(() => this.catchPermissionStatus());
    }

    async chooseFromLibrary(imagePickerOptions) {
        await checkAndAskForPermissionMediaLibrary()
            .then(() => launchImageLibrary({ mediaType: 'photo', quality: 0.5 }))
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
            .catch(() => this.catchPermissionStatus());
    }
}

export default ImagePickerAPI;
