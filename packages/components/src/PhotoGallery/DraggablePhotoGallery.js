import React, { useState } from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from '@jmstechnologiesinc/react-native-paper';
import DraggableFlatList, { ScaleDecorator, NestableScrollContainer } from 'react-native-draggable-flatlist';
import { MD3Colors, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { imageKitListImage, imageKitListImagelqip, imageKitPhotoGalleryMainImage, imageKitPhotoGalleryMainImageLqip } from '../utils';
import PhotoGalleryMainImage from './PhotoGalleryMainImage';
import PhotoGalleryItem from './PhotoGalleryItem';
import { renderImageSeparator } from './PhotoGallery';
import JMSStyles from '../styles';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

const DraggablePhotoGallery = ({ photos, onChange, isDisabled }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const renderItem = ({ item, drag, isActive, getIndex }) => {
        const index = getIndex();
        const isSelected = index === selectedIndex;
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setSelectedIndex(index)}
                    onLongPress={drag}
                    disabled={isActive}
                    style={[isActive ? JMSStyles.activeItem : null, { marginVertical: MD3LightTheme.spacing.x2 }]}
                >
                    <PhotoGalleryItem
                        isActive={isSelected || isActive}
                        lqipUri={item?.uri ? item.uri : imageKitListImagelqip(item)}
                        uri={item?.uri ? item.uri : imageKitListImage(item)} />
                    <IconButton
                        icon={MATERIAL_ICONS.remove}
                        mode="contained"
                        disabled={isDisabled}
                        iconColor={MD3Colors.error50}
                        onPress={() => onRemove(index)}
                        style={styles.iconPosition}
                    />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };


    const onRemove = (index) => {
        setSelectedIndex(0);

        let newPhotos = photos.slice();
        newPhotos.splice(index, 1);
        onChange(newPhotos);
    };

    const onDragEnd = ({ data: newData }) => {
        setSelectedIndex(0);
        onChange(newData);
    };

    return photos?.length > 0 ? (
        <>
            <PhotoGalleryMainImage
                lqipUri={photos[selectedIndex]?.uri ? photos[selectedIndex].uri : imageKitPhotoGalleryMainImageLqip(photos[selectedIndex])}
                uri={photos[selectedIndex]?.uri ? photos[selectedIndex].uri : imageKitPhotoGalleryMainImage(photos[selectedIndex])} />
            <NestableScrollContainer>
                <DraggableFlatList
                    horizontal
                    data={photos}
                    onDragEnd={onDragEnd}
                    keyExtractor={(item) => (item.fileName ? item.fileName : item)}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderImageSeparator}
                    showsHorizontalScrollIndicator={false}
                />
            </NestableScrollContainer>
        </>
    ) : null;
};

const styles = StyleSheet.create({
    iconPosition: {
        position: 'absolute',
        right: -MD3LightTheme.spacing.x1,
        bottom: 0,
        margin: 0,
    },
});

export default DraggablePhotoGallery;
