import { Linking, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { RESULTS } from 'react-native-permissions';
import { checkAndAskForPermissionCamara } from './utils';

// What every pick asked for before a caller could pass options of its own (`takePhoto(options)`): a photo at full
// quality, with its base64. A caller's options are laid over these.
const DEFAULT_OPTIONS = Object.freeze({ mediaType: 'photo', quality: 1, includeBase64: true });

// react-native-image-picker's `errorCode` for a pick its platform refused for want of a permission; its other codes
// (`camera_unavailable`, `others`) are failures a setting cannot fix.
const PERMISSION_ERROR = 'permission';

// The answers of a camera permission request that Settings can change; anything else (`unavailable`, a request that
// threw) is a failure, not a refusal.
const PERMISSION_REFUSED = Object.freeze([RESULTS.DENIED, RESULTS.BLOCKED]);

/**
 * Takes one photo with the camera or picks one from the library.
 *
 * `takePhoto(options)` and `chooseFromLibrary(options)` always resolve, and never reject, so a caller never waits on
 * a pick that ended: with the picked asset, or with `null` when nothing was picked — cancelled (silently), refused a
 * permission (the permission alert, with a way to Settings) or failed (the generic failure alert). `options` are
 * react-native-image-picker's, laid over `DEFAULT_OPTIONS`.
 */
class ImagePickerAPI {
    constructor({
        titlePermissionCamera,
        titlePermissionPhotos,
        descriptionPermissionCamera,
        descriptionPermissionPhotos,
        cancelPermission,
        settingPermission,
        titleFailure,
        descriptionFailure,
        closeFailure,
    }) {
        this.titlePermissionCamera = titlePermissionCamera;
        this.titlePermissionPhotos = titlePermissionPhotos;
        this.descriptionPermissionCamera = descriptionPermissionCamera;
        this.descriptionPermissionPhotos = descriptionPermissionPhotos;
        this.cancelPermission = cancelPermission;
        this.settingPermission = settingPermission;
        this.titleFailure = titleFailure;
        this.descriptionFailure = descriptionFailure;
        this.closeFailure = closeFailure;
    }

    catchPermissionStatusCamara() {
        Alert.alert(
            this.titlePermissionCamera,
            this.descriptionPermissionCamera,
            [
                { text: this.cancelPermission, style: 'cancel' },
                { text: this.settingPermission, onPress: () => Linking.openSettings() },
            ],
            { cancelable: false }
        );
    }

    catchPermissionStatusPhotos() {
        Alert.alert(
            this.titlePermissionPhotos,
            this.descriptionPermissionPhotos,
            [
                { text: this.cancelPermission, style: 'cancel' },
                { text: this.settingPermission, onPress: () => Linking.openSettings() },
            ],
            { cancelable: false }
        );
    }

    // The button is named here: without one Android's alert falls back to an English «OK».
    alertFailure() {
        Alert.alert(this.titleFailure, this.descriptionFailure, [{ text: this.closeFailure }]);
    }

    /** The asset `launcher` picked, or null once the user has been told why there is none. */
    launch(launcher, options, alertPermission) {
        return launcher({ ...DEFAULT_OPTIONS, ...options })
            .then((response) => {
                if (response.didCancel) return null;
                if (response.errorCode === PERMISSION_ERROR) {
                    alertPermission();
                    return null;
                }
                if (response.errorCode) {
                    this.alertFailure();
                    return null;
                }
                return response.assets?.[0] ?? null;
            })
            .catch(() => {
                this.alertFailure();
                return null;
            });
    }

    takePhoto(options) {
        return checkAndAskForPermissionCamara().then(
            () => this.launch(launchCamera, options, () => this.catchPermissionStatusCamara()),
            (status) => {
                if (PERMISSION_REFUSED.includes(status)) this.catchPermissionStatusCamara();
                else this.alertFailure();
                return null;
            }
        );
    }

    // No permission is asked: react-native-image-picker 8 opens Android's Photo Picker and iOS's PHPicker, which run
    // outside the app and hand back only what the user picks. Asking for the library permission blocked the pick where
    // it cannot be granted: Android 13+ (the app declares no READ_EXTERNAL_STORAGE) and iOS limited access. The picker
    // still reports `permission` where its platform checks one (iOS with `includeExtra`).
    chooseFromLibrary(options) {
        return this.launch(launchImageLibrary, options, () => this.catchPermissionStatusPhotos());
    }
}

export default ImagePickerAPI;
