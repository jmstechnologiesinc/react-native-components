import React, { useState } from 'react';

import { View, FlatList} from 'react-native';
import { MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';
import PhotoGalleryMainImage from './PhotoGalleryMainImage';
import PhotoGalleryItem from './PhotoGalleryItem'


export const renderSeparator = () => (
    <View
        style={{
            width: MD3LightTheme.spacing.x2,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos, showNav = true }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const renderItem = ({ item, index }) => (
        <TouchableRipple onPress={() => setSelectedIndex(index)}>
            <PhotoGalleryItem photo={item} />
        </TouchableRipple>
    );

    return (
        <>
        {
            photos?.length > 0 &&  <PhotoGalleryMainImage mainPhoto={photos[selectedIndex]} />
        }

            {showNav  && photos?.length > 0 && (
                <ScreenWrapperSection>
                    <FlatList
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => `photo-gallery-${index}`}
                    />
                </ScreenWrapperSection>)
                }

        </>
    );
};



export default PhotoGallery;
