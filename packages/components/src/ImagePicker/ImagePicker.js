import { Linking, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const oneTakePhoto = () => {
    launchCamera(
        {
            mediaType: 'photo',
            quality: 0.5,
        },
        (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                alert(response.error);
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response);
            }
        }
    );
};

const chooseFromGallery = (setProfilePictureFile, actionSheet) => {
    launchImageLibrary(
        {
            mediaType: 'photo',
            quality: 0.5,
        },
        (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                alert(response.error);
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                setProfilePictureFile(response?.assets[0]);
                actionSheet.current.hide();
            }
        }
    );
};

const onPressFromGallery = async (
    setProfilePictureFile,
    actionSheet,
    titlePermission,
    descriptionPermission,
    carcelPermission,
    settingPermission
) => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            chooseFromGallery();
        } else {
            Alert.alert(
                titlePermission,
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
        }
    } else {
        chooseFromGallery(setProfilePictureFile, actionSheet);
    }
};

const onPressFromCamara = async (titlePermission, descriptionPermission, carcelPermission, settingPermission) => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            oneTakePhoto();
        } else {
            Alert.alert(
                titlePermission,
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
        }
    } else {
        oneTakePhoto();
    }
};

export { onPressFromGallery, onPressFromCamara };
