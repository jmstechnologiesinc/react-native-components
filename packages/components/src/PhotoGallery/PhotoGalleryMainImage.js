import { StyleSheet } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';

const PhotoGalleryMainImage = ({uri}) => (
    <FastImage source={{ uri: uri }} style={styles.mainImage} resizeMode={FastImage.resizeMode.stretch} />
)

const styles = StyleSheet.create({
    mainImage: {
        height: moderateScale(195),
    },
});

export default PhotoGalleryMainImage