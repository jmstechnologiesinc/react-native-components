import React from 'react';
import AvatarPicker from './AvatarPicker';

export default {
    title: 'packages/AvatarPicker',
};
const defaultPhoto =
    'https://firebasestorage.googleapis.com/v0/b/jms-eats-70330.appspot.com/o/users%2F3mWlE%2BhyRC6LvBx2JDrGBg%3A0.jpeg?alt=media&token=5f96b821-3a3c-4a1c-b22c-73c68707efbe';

const options = [
    { title: 'Take photo', icon: 'camera' },
    { title: 'Choose from library', icon: 'folder-image' },
    { title: 'Remove Profile Photo', icon: 'image-remove' },
    { title: 'cancel', icon: 'cancel' },
];

export const AvatarPhoto = () => (
    <AvatarPicker
        firstName="Marcos"
        lastName="Maria"
        photo={defaultPhoto}
        setProfilePictureFile={() => {}}
        removeProfilePicture={() => {}}
        options={options}
    />
);
export const AvatarIcon = () => (
    <AvatarPicker
        firstName="Jose"
        lastName="Vasquez"
        photo={null}
        setProfilePictureFile={() => {}}
        removeProfilePicture={() => {}}
        options={options}
    />
);
