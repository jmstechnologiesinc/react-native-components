import { Linking, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { checkAndAskForPermission } from './utils';

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

    async oneTakePhoto(setProfilePictureFile) {
        await checkAndAskForPermission()
            .then(() => launchCamera({ mediaType: 'photo', quality: 0.5 }))
            .then((response) => setProfilePictureFile(response?.assets[0]))
            .catch(() => this.catchPermissionStatus());
    }
}

export default ImagePickerAPI;
