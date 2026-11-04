import { Alert, Linking } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

import ImagePickerAPI from '../ImagePickerAPI';

// Both are native modules. The permissions library publishes its own jest mock (every request granted unless a test
// says otherwise); the picker publishes none, so its two launchers are stand-ins that answer what a test gives them.
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));
jest.mock('react-native-image-picker', () => ({ launchCamera: jest.fn(), launchImageLibrary: jest.fn() }));

const LABELS = {
    titlePermissionCamera: 'Camera permission denied',
    titlePermissionPhotos: 'Allow access to photos',
    descriptionPermissionCamera: 'Enable the camera permission',
    descriptionPermissionPhotos: 'Enable the photos permission',
    cancelPermission: 'Cancel',
    settingPermission: 'Go to settings',
    titleFailure: 'Something went wrong',
    descriptionFailure: 'Please try again later.',
    closeFailure: 'Close',
};
const ASSET = { uri: 'file:///photo.jpg', base64: 'photo' };
const DEFAULTS = { mediaType: 'photo', quality: 1, includeBase64: true };

const picker = () => new ImagePickerAPI(LABELS);

let alert;
beforeEach(() => {
    jest.clearAllMocks();
    alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    launchCamera.mockResolvedValue({ assets: [ASSET] });
    launchImageLibrary.mockResolvedValue({ assets: [ASSET] });
});

afterEach(() => alert.mockRestore());

describe('ImagePickerAPI.chooseFromLibrary', () => {
    it('opens the library without asking for any permission, and resolves the photo picked', async () => {
        await expect(picker().chooseFromLibrary()).resolves.toBe(ASSET);
        expect(request).not.toHaveBeenCalled();
        expect(launchImageLibrary).toHaveBeenCalledWith(DEFAULTS);
        expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("lays the caller's capture options over the defaults", async () => {
        const options = { maxWidth: 5120, maxHeight: 5120, assetRepresentationMode: 'compatible' };
        await picker().chooseFromLibrary(options);
        expect(launchImageLibrary).toHaveBeenCalledWith({ ...DEFAULTS, ...options });
    });

    it('resolves nothing, and says nothing, when the pick is cancelled', async () => {
        launchImageLibrary.mockResolvedValue({ didCancel: true });
        await expect(picker().chooseFromLibrary()).resolves.toBeNull();
        expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("shows the photos permission alert only for the picker's permission error", async () => {
        launchImageLibrary.mockResolvedValue({ errorCode: 'permission' });
        await expect(picker().chooseFromLibrary()).resolves.toBeNull();
        expect(Alert.alert).toHaveBeenCalledWith(
            LABELS.titlePermissionPhotos,
            LABELS.descriptionPermissionPhotos,
            expect.any(Array),
            { cancelable: false }
        );
    });

    it('shows the generic failure when the library cannot open', async () => {
        launchImageLibrary.mockResolvedValue({ errorCode: 'others', errorMessage: 'Activity error' });
        await expect(picker().chooseFromLibrary()).resolves.toBeNull();
        expect(Alert.alert).toHaveBeenCalledWith(LABELS.titleFailure, LABELS.descriptionFailure, [
            { text: LABELS.closeFailure },
        ]);
    });

    it('resolves nothing, after the generic failure, when the launcher itself throws', async () => {
        launchImageLibrary.mockRejectedValue(new Error('no native module'));
        await expect(picker().chooseFromLibrary()).resolves.toBeNull();
        expect(Alert.alert).toHaveBeenCalledWith(LABELS.titleFailure, LABELS.descriptionFailure, expect.any(Array));
    });
});

describe('ImagePickerAPI.takePhoto', () => {
    it('asks for the camera permission, then takes the photo with the capture options', async () => {
        const options = { maxWidth: 5120, maxHeight: 5120, conversionQuality: 1 };
        await expect(picker().takePhoto(options)).resolves.toBe(ASSET);
        expect(request).toHaveBeenCalledWith(PERMISSIONS.IOS.CAMERA);
        expect(launchCamera).toHaveBeenCalledWith({ ...DEFAULTS, ...options });
    });

    it.each([RESULTS.DENIED, RESULTS.BLOCKED])(
        'shows the camera permission alert, with a way to Settings, when the permission is %s',
        async (status) => {
            request.mockResolvedValueOnce(status);
            const openSettings = jest.spyOn(Linking, 'openSettings').mockImplementation(() => Promise.resolve());
            await expect(picker().takePhoto()).resolves.toBeNull();
            expect(launchCamera).not.toHaveBeenCalled();
            const [title, description, buttons] = Alert.alert.mock.calls[0];
            expect([title, description]).toEqual([LABELS.titlePermissionCamera, LABELS.descriptionPermissionCamera]);
            expect(buttons.map(({ text }) => text)).toEqual([LABELS.cancelPermission, LABELS.settingPermission]);
            buttons[1].onPress();
            expect(openSettings).toHaveBeenCalled();
            openSettings.mockRestore();
        }
    );

    it('shows the generic failure, not the permission alert, when the device has no camera', async () => {
        request.mockResolvedValueOnce(RESULTS.UNAVAILABLE);
        await expect(picker().takePhoto()).resolves.toBeNull();
        expect(Alert.alert).toHaveBeenCalledWith(LABELS.titleFailure, LABELS.descriptionFailure, expect.any(Array));
    });

    it('shows the generic failure for the camera_unavailable error code', async () => {
        launchCamera.mockResolvedValue({ errorCode: 'camera_unavailable' });
        await expect(picker().takePhoto()).resolves.toBeNull();
        expect(Alert.alert).toHaveBeenCalledTimes(1);
        expect(Alert.alert).toHaveBeenCalledWith(LABELS.titleFailure, LABELS.descriptionFailure, expect.any(Array));
    });

    it('resolves nothing, and says nothing, when the photo is cancelled', async () => {
        launchCamera.mockResolvedValue({ didCancel: true });
        await expect(picker().takePhoto()).resolves.toBeNull();
        expect(Alert.alert).not.toHaveBeenCalled();
    });
});
