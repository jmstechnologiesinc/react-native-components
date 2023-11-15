import React, {  useEffect, useState } from 'react';

import { StyleSheet, TouchableOpacity,  } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import DraggableFlatList, { ScaleDecorator, NestableScrollContainer } from 'react-native-draggable-flatlist';

import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';

import FastImage from 'react-native-fast-image';

import { IconButton } from '@jmstechnologiesinc/react-native-paper';
import { imagekitUrl } from '@jmstechnologiesinc/react-native-components/lib/utils';

const photos = ({ photos,  onChange }) => {

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
                 
                    <FastImage source={{ uri: photo }} style={styles.photo} resizeMode={FastImage.resizeMode.stretch} />

                    {isSelected && (
                        <IconButton
                            icon="delete"
                            mode="contained"
                            size={moderateScale(24)}
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
                photos?.length > 0 && (<FastImage source={{ uri: photo[selectedIndex] }} style={styles.mainImage}  />)
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
    mainImage: {
        height: moderateScale(195),
    },
    photo: {
        height: moderateScale(90),
        width: moderateScale(90),
    },
    rowItem: {
        height: moderateScale(100),
        width:moderateScale(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    activeItem: {
        backgroundColor: '#f0f0f0',
        elevation: 5,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 2 },
    },
});

export default photos;
