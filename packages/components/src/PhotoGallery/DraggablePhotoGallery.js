import React, { useState } from 'react';

import { Dimensions, PixelRatio, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from '@jmstechnologiesinc/react-native-paper';
import DraggableFlatList, { ScaleDecorator, NestableScrollContainer } from 'react-native-draggable-flatlist';
import { MD3Colors, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { imagekitUrl } from '../utils';
import PhotoGalleryMainImage from './PhotoGalleryMainImage';
import PhotoGalleryItem from './PhotoGalleryItem';
import { renderImageSeparator } from './PhotoGallery';
import JMSStyles from '../styles';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { moderateScale } from 'react-native-size-matters';

function getPhotoUrl(photo) {
    return photo.uri ? photo.uri : imagekitUrl(photo);
}

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
                        uri={item?.uri ? item.uri : imagekitUrl(`tr:h-${moderateScale(76)},w-${moderateScale(76)},q-100,pr-true,fo-auto,lo-true,dpr-${PixelRatio.get()}/${item}`)} />
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
            <PhotoGalleryMainImage uri={photos[selectedIndex]?.uri ? photos[selectedIndex].uri : imagekitUrl(`tr:h-${moderateScale(195)},w-${Dimensions.get('window').width},q-100,pr-true,cm-pad_resize,fo-auto,lo-true,dpr-${PixelRatio.get()}/${photos[selectedIndex]}`)} />
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
