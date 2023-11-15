import React, { useState } from 'react';

import { StyleSheet, TouchableOpacity,  } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { IconButton } from '@jmstechnologiesinc/react-native-paper';
import DraggableFlatList, { ScaleDecorator, NestableScrollContainer } from 'react-native-draggable-flatlist';
import { MD3Colors } from '@jmstechnologiesinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';
import { imagekitUrl } from '../utils';
import PhotoGalleryMainImage from './PhotoGalleryMainImage';
import PhotoGalleryItem from './PhotoGalleryItem'
import JMSStyles from '../styles'

function getPhotoUrl(photo) {return photo.uri ? photo.uri : imagekitUrl(photo)}

const DraggablePhotoGallery = ({ photos,  onChange }) => {
    

    const [selectedIndex, setSelectedIndex] = useState(0);

    const renderItem =({ item, drag, isActive, getIndex }) => {
        const index =   getIndex()
        const isSelected = index === selectedIndex;
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setSelectedIndex(getIndex())}
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        { opacity: isActive ? 0.5 : 1 },
                        isActive ? JMSStyles.activeItem : null
                    ]}
                >
                 
                    <PhotoGalleryItem photo={getPhotoUrl(item)}/>

                    {isSelected && (
                        <IconButton
                            icon={MATERIAL_ICONS.remove}
                            iconColor={MD3Colors.error50}
                            mode="outlined"
                            onPress={() => onRemove(getIndex())}
                            style={styles.iconPosition}
                        />
                    )}
                </TouchableOpacity>
            </ScaleDecorator>
        );
    }

        const photoUrls = photos?.map((photo) => getPhotoUrl(photo))

        const onRemove = (index) => {
            const lastIndex = photos.length - 1;
            if(lastIndex === index){
                setSelectedIndex(0)
            }
            let newPhotos = photos.slice();
            newPhotos.splice(index, 1);
            onChange(newPhotos);
        };
    
        const onDragEnd = ({ data: newData }) => {
            onChange(newData);
        };
    
    return (
        <>
            {
                photoUrls?.length > 0 ?  
                <>
                <PhotoGalleryMainImage  mainPhoto={photoUrls[selectedIndex]} />
                <ScreenWrapperSection>
                <NestableScrollContainer>
                    <DraggableFlatList
                        horizontal
                        data={photos}
                        onDragEnd={onDragEnd}
                        keyExtractor={(item) =>  item.fileName ? item.fileName : item}
                        renderItem={renderItem}
                    />
                </NestableScrollContainer>
                </ScreenWrapperSection>
                </> : null
            }




        </>
    );
};

const styles = StyleSheet.create({
    rowItem: {
        height: moderateScale(56),
        width: moderateScale(120),
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconPosition: {
        position: 'absolute',
        right: 0,
        top: 0,
    }
 
});

export default DraggablePhotoGallery;
