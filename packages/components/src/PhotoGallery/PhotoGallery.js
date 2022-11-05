import React, { useState } from 'react';

import { View, FlatList, StyleSheet, Image } from 'react-native';

import { MD3LightTheme, TouchableRipple} from '@jmsstudiosinc/react-native-paper';
import {getMainPhoto} from '@jmsstudiosinc/commons';

import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';
import { moderateScale } from 'react-native-size-matters';

const renderSeparator = () => (
    <View
        style={{
            width: MD3LightTheme.spacing.x2,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos }) => { 
    const [uri, setUri] = useState(getMainPhoto(photos));

    if (!Array.isArray(photos)) {
        return null;
    }

    const renderItem = ({ item }) => (
        <TouchableRipple onPress={() => setUri(item)}>
            <Image style={styles.photo} source={{ uri: item }} />
        </TouchableRipple>
    );

    return (
        <>
            {uri ? <Image
                style={styles.mainImage}
                source={{uri: uri}}
            /> : null}
            
            {photos.length > 1 ? (
                <ScreenWrapperSection>
                    <FlatList
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `photo-gallery-${index}`}/>
                </ScreenWrapperSection>
            ) : null}
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
