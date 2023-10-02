import React, { useEffect } from 'react';

import { View, FlatList, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { MD3LightTheme, TouchableRipple, List  } from '@jmstechnologiesinc/react-native-paper';
import { getMainPhoto } from '@jmstechnologiesinc/commons';

import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';


import FastImage from 'react-native-fast-image';

 
const renderSeparator = () => (
    <View
        style={{
            width: MD3LightTheme.spacing.x2,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos, onPress, onLongPress, selectedPhoto }) => {
 

    useEffect(() => {
        onPress?.(getMainPhoto(photos))
    }, [!photos])


    const renderItem = ({ item, index }) => (
        <TouchableRipple onPress={() => onPress?.(item)} onLongPress={() => onLongPress?.(index)}>
            <FastImage source={{ uri: item }} style={styles.photo} resizeMode={FastImage.resizeMode.stretch} />
        </TouchableRipple>
    );

    return (
        <>
             {selectedPhoto && <FastImage source={{ uri: Array.isArray(photos) ? selectedPhoto : photos }} style={styles.mainImage} resizeMode={FastImage.resizeMode.stretch} />}
                    {photos?.length > 1 &&  Array.isArray(photos) && (
                        <ScreenWrapperSection>
                            <FlatList
                                data={photos}
                                horizontal
                                ItemSeparatorComponent={renderSeparator}
                                renderItem={renderItem}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, index) => `photo-gallery-${index}`}
                            />
                        </ScreenWrapperSection>
                    )}
        </>
    );
};

const styles = StyleSheet.create({
    mainImage: {
        height: moderateScale(195),
    },
    photo: {
        height: moderateScale(65),
        width: moderateScale(65),
    },
});

export default PhotoGallery;
