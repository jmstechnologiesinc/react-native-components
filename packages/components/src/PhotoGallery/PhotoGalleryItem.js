import {  StyleSheet } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { moderateScale } from 'react-native-size-matters'

const PhotoGalleryItem = ({photo}) => (
  <FastImage source={{ uri: photo }} style={styles.photo} resizeMode={FastImage.resizeMode.stretch} />
)


const styles = StyleSheet.create({
    photo: {
        height: moderateScale(64),
        width: moderateScale(114),
    },
});


export default PhotoGalleryItem