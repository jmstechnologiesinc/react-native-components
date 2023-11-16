
import React from 'react'
import ImagePicker from './ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DraggablePhotoGallery from '../PhotoGallery/DraggablePhotoGallery'
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'

const PhotoGallery = ({ photos,   onChange  }) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('Photos')}>
                <DraggablePhotoGallery
                    photos={photos}
                    onChange={onChange}
                />
            </ScreenWrapper.Section>

            <ImagePicker
                variant="button"
                title={localized('Add Photo')}
                withPaddingHorizontal={false}
                onChange={(photo) => {
                        const newPhotos = photos ? [...photos, photo] : [photo];
                        onChange(newPhotos);
                }}
            />
        </>
    )
}

export default PhotoGallery

