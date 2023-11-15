import React, { useState } from 'react';

import { StyleSheet, TouchableOpacity,  } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { IconButton } from '@jmstechnologiesinc/react-native-paper';
import DraggableFlatList, { ScaleDecorator, NestableScrollContainer } from 'react-native-draggable-flatlist';
import { MD3Colors } from '@jmstechnologiesinc/react-native-paper';


import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';
import { imagekitUrl } from '@jmstechnologiesinc/react-native-components/lib/utils';
import PhotoGalleryMainImage from './PhotoGalleryMainImage';
import PhotoGalleryItem from './PhotoGalleryItem'
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

const DraggablePhotoGallery = ({ photos,  onChange }) => {
    

    const [selectedIndex, setSelectedIndex] = useState(0);

    const renderItem =({ item, drag, isActive, getIndex }) => {
        const isSelected = getIndex() === selectedIndex;
        const photo = item.uri ? item.uri :  imagekitUrl(item)
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
                        isActive ? styles.activeItem : null
                    ]}
                >
                 
                    <PhotoGalleryItem photo={photo}/>

                    {isSelected && (
                        <IconButton
                            icon={MATERIAL_ICONS.remove}
                            iconColor={MD3Colors.error50}
                            mode="contained"
                            onPress={() => onRemove(getIndex())}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                            }}
                        />
                    )}
                </TouchableOpacity>
            </ScaleDecorator>
        );
    }

        const photo = photos?.map((photo) => {
            if (photo.uri) {
                return photo.uri;
            } else {
                return imagekitUrl(photo);
            }
        })

        const onRemove = (index) => {
            const lastIndex = photos.length - 1;
            
            if(lastIndex === index){
                setSelectedIndex(0)
            }
           
            let newPhotos = photos.slice();
            newPhotos.splice(index, 1);
            return onChange(newPhotos);
        };
    
        const onDragEnd = ({ data: newData }) => {
            onChange(newData);
        };
    
    return (
        <>
            {
                photos?.length > 0 &&  <PhotoGalleryMainImage  mainPhoto={photo[selectedIndex]} />
            }

            { photos?.length > 0 && (<ScreenWrapperSection>
                <NestableScrollContainer>
                    <DraggableFlatList
                        horizontal
                        data={photos}
                        onDragEnd={onDragEnd}
                        keyExtractor={(item) =>  item.fileName ? item.fileName : item}
                        renderItem={renderItem}
                    />
                </NestableScrollContainer>
            </ScreenWrapperSection>)}



        </>
    );
};

const styles = StyleSheet.create({
    rowItem: {
        height: moderateScale(73),
        width: moderateScale(73),
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeItem: {
        backgroundColor: '#f0f0f0',
        elevation: 5,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 2 },
    },
});

export default DraggablePhotoGallery;
