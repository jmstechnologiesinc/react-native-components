import { Button } from '@jmsstudiosinc/react-native-paper';
import React from 'react';
import { onPressFromGallery } from './ImagePicker';

export default {
    title: 'packages/ImagePicker',
};

export const ChooseImage = () => (
    <Button onPress={onPressFromGallery} setProfilePictureFile={() => {}}>
        Choose From Gallery
    </Button>
);
