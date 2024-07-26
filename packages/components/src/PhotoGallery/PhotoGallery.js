import React, { useState } from 'react';

import { View, FlatList} from 'react-native';
import { MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import PhotoGalleryMainImage from './PhotoGalleryMainImage';
import PhotoGalleryItem from './PhotoGalleryItem';
import { imageKitListImage, imageKitListImagelqip, imageKitPhotoGalleryMainImage, imageKitPhotoGalleryMainImageLqip, isPublicUrl } from '../utils';

export const renderImageSeparator = () => (
    <View
        style={{
            marginRight: MD3LightTheme.spacing.x2,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos, showNav = true,imagekitCropMode, styles }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const renderItem = ({ item, index }) => (
        <TouchableRipple style={{marginVertical: MD3LightTheme.spacing.x2}} onPress={() => setSelectedIndex(index)}>
            <PhotoGalleryItem 
                isActive={selectedIndex === index} 
                lqipUri={isPublicUrl(item) ? item : imageKitListImagelqip(item)}
                uri={isPublicUrl(item) ? item : imageKitListImage(item)} />
        </TouchableRipple>
    );

    return photos?.length > 0 ? (
        <View style={styles}>
            <PhotoGalleryMainImage 
                lqipUri={isPublicUrl(photos[selectedIndex]) ? photos[selectedIndex] : imageKitPhotoGalleryMainImageLqip(photos[selectedIndex], imagekitCropMode)}
                uri={isPublicUrl(photos[selectedIndex]) ? photos[selectedIndex] : imageKitPhotoGalleryMainImage(photos[selectedIndex], imagekitCropMode)} />
            {(showNav && photos?.length > 1) && (
                <FlatList
                    data={photos}
                    horizontal
                    ItemSeparatorComponent={renderImageSeparator}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => `photo-gallery-${index}`}
                />
            )}
        </View>
    ) : null
};

export default PhotoGallery;
