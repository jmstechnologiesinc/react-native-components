import React from 'react';
import * as ImagePicker from './ImagePicker';
import { options } from './utils';

export default {
    title: 'packages/ImagePicker',
};
const defaultPhoto =
    'https://firebasestorage.googleapis.com/v0/b/jms-eats-70330.appspot.com/o/users%2F3mWlE%2BhyRC6LvBx2JDrGBg%3A0.jpeg?alt=media&token=5f96b821-3a3c-4a1c-b22c-73c68707efbe';

const actionSheetRef = useRef(null);

const imagePickerOptions = (url) => {
    console.log(url);
};

export const AvatarPhoto = () => (
    <ImagePicker.Avatar
        photo={defaultPhoto}
        actionSheetRef={actionSheetRef}
        imagePickerOptions={imagePickerOptions}
        removeProfilePicture={() => {}}
        options={options}
        titlePermissionCamera={'Camera permission denied'}
        titlePermissionPhotos={'Please allow access to your photos'}
        descriptionPermissionCamera={
            'To have access to the camera you must enable the camera permission in your application settings'
        }
        descriptionPermissionPhotos={
            'To have access to the photos you must enable the photos permission in your application settings'
        }
        cancelPermission={'Cancel'}
        settingPermission={'Go to Settings'}
    />
);
