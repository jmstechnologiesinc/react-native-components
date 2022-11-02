import React, { useState } from 'react';

import { View, FlatList, StyleSheet, Image } from 'react-native';

import { MD3LightTheme, TouchableRipple } from '@jmsstudiosinc/react-native-paper';
import { ScreenWrapper } from '../index';

const renderSeparator = () => (
    <View
        style={{
            width: MD3LightTheme.spacing.x4 / 2,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos }) => {
    const [uri, setUri] = useState(photos?.[0]);

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
            {uri && <Image style={styles.mainImage} source={{ uri: uri }} />}

            {photos.length > 1 && (
                <ScreenWrapper.Section>
                    <FlatList
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `photo-gallery-${item}`}
                    />
                </ScreenWrapper.Section>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    mainImage: {
        height: 195,
    },
    photo: {
        height: 65,
        width: 65,
    },
});

export default PhotoGallery;
