import React from 'react';
import { IMAGE_PICKER_ACTIONS } from '../ImagePicker/ImagePicker';
import AvatarPicker from './AvatarPicker';

export default {
    title: 'packages/AvatarPicker',
};
const defaultPhoto =
    'https://firebasestorage.googleapis.com/v0/b/jms-eats-70330.appspot.com/o/users%2F3mWlE%2BhyRC6LvBx2JDrGBg%3A0.jpeg?alt=media&token=5f96b821-3a3c-4a1c-b22c-73c68707efbe';

const options = [
    { title: 'Take photo', value: IMAGE_PICKER_ACTIONS.launchCamera, icon: 'camera' },
    { title: 'Choose from library', value: IMAGE_PICKER_ACTIONS.launchImageLibrary, icon: 'folder-image' },
    { title: 'Remove Profile Photo', value: IMAGE_PICKER_ACTIONS.removeImage, icon: 'image-remove' },
    { title: 'cancel', value: IMAGE_PICKER_ACTIONS.cancel, icon: 'cancel' },
];

export const AvatarPhoto = () => (
    <AvatarPicker
        firstName="Marcos"
        lastName="Maria"
        photo={defaultPhoto}
        setProfilePictureFile={() => {}} //onSelection
        removeProfilePicture={() => {}} //onRemove
        options={options}
        titlePermission={'Camera permission denied'}
        descriptionPermission={
            'To have access to the camera you must enable the camera permission in your application settings'
        }
        carcelPermission={'Cancel'}
        settingPermission={'Go to Settings'}
    />
);
export const AvatarIcon = () => (
    <AvatarPicker
        photo={null}
        setProfilePictureFile={() => {}}
        removeProfilePicture={() => {}}
        options={options}
        titlePermission={'Camera permission denied'}
        descriptionPermission={
            'To have access to the camera you must enable the camera permission in your application settings'
        }
        carcelPermission={'Cancel'}
        settingPermission={'Go to Settings'}
    />
);
