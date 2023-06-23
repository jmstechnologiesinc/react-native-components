import React, { useState } from 'react';

import { View, FlatList, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';
import { fastImageUrl } from '@jmstechnologiesinc/commons';

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

const PhotoGallery = ({ photos }) => {
    const [selectedPhoto, setSelectedPhoto] = useState();

    const renderItem = ({ item }) => (
        <TouchableRipple onPress={() => setSelectedPhoto(item)}>
            <FastImage style={styles.photo} source={{ uri: item }} />
        </TouchableRipple>
    );


    return (
        <>
        
        {Array.isArray(photos) ? <ScreenWrapperSection>
                    <FlatList
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => `photo-gallery-${index}`}
                    />
                </ScreenWrapperSection> : <FastImage source={{ uri: photos }} style={styles.mainImage} />}
          
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
