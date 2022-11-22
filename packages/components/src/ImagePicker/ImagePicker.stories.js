import React from 'react';
import ImagePicker from './ImagePicker';
import { options } from './utils';

export default {
    title: 'packages/ImagePicker',
};
const defaultPhoto =
    'https://firebasestorage.googleapis.com/v0/b/jms-eats-70330.appspot.com/o/users%2F3mWlE%2BhyRC6LvBx2JDrGBg%3A0.jpeg?alt=media&token=5f96b821-3a3c-4a1c-b22c-73c68707efbe';

const setProfilePictureFile = (url) => {
    console.log(url);
};

export const AvatarPhoto = () => (
    <ImagePicker
        firstName="Marcos"
        lastName="Maria"
        photo={defaultPhoto}
        setProfilePictureFile={setProfilePictureFile}
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
export const AvatarIcon = () => (
    <ImagePicker
        firstName="Jose"
        lastName="Vasquez"
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
