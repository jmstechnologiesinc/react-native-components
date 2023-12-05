
import React from 'react'
import ImagePicker from './ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DraggablePhotoGallery from '../PhotoGallery/DraggablePhotoGallery'
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { HelperText } from '@jmstechnologiesinc/react-native-paper';

const PhotoGallery = ({ photos, onChange,  isDisabled  }) =>  (
    <ScreenWrapper.Section title={localized('photos')}>
        <DraggablePhotoGallery
            photos={photos}
            onChange={onChange}
            isDisabled={isDisabled}
        />
        <ImagePicker
            variant="button"
            title={localized('add')}
            isDisabled={isDisabled}
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

