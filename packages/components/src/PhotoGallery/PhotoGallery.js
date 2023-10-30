import React, { useEffect, useState } from 'react';

import { View, FlatList, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';


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

const PhotoGallery = ({ photos, showNav = true, onLongPress }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);


    const renderItem = ({ item, index }) => (
        <TouchableRipple onPress={() => setSelectedIndex(index)} onLongPress={() => {
            onLongPress?.()
        }}>
            <FastImage source={{ uri: item }} style={styles.photo} resizeMode={FastImage.resizeMode.stretch} />
        </TouchableRipple>
    );


    return (
        <>
        {
            photos?.length >= 1 && (<FastImage source={{ uri: photos?.[selectedIndex] }} style={styles.mainImage} resizeMode={FastImage.resizeMode.stretch} />)
        }

            {showNav  && Array.isArray(photos) && ( <ScreenWrapperSection>
                    <FlatList
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => `photo-gallery-${index}`}
                    />
                </ScreenWrapperSection>)}

          

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
