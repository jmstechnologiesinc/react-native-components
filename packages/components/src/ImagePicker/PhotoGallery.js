
import React from 'react'
import ImagePicker from './ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DraggablePhotoGallery from '../PhotoGallery/DraggablePhotoGallery'
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { HelperText } from '@jmstechnologiesinc/react-native-paper';

const PhotoGallery = ({ photos, onChange  }) =>  (
    <ScreenWrapper.Section title={localized('photos')}>
        <DraggablePhotoGallery
            photos={photos}
            onChange={onChange}
        />
        <ImagePicker
            variant="button"
            title={localized('add')}
            withPaddingHorizontal={false}
            onChange={(photo) => {
                    const newPhotos = photos ? [...photos, photo] : [photo];
                    onChange(newPhotos);
            }}
        />

        <HelperText padding="none">
            {localized("itemPhotoRequirements")}
        </HelperText>
        <HelperText padding="none">
            {localized("photoGalleryRearrange")}
        </HelperText>
    </ScreenWrapper.Section>
)

export default PhotoGallery

