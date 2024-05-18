import React from 'react'

import { StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'

const PhotoGalleryItem = ({ uri, isActive, }) => (
  <FastImage source={{ uri: uri, cache: FastImage.cacheControl.immutable }} style={[styles.photo, { opacity: isActive ? 1 : 0.5 }]} resizeMode={FastImage.resizeMode.stretch} />
)

const styles = StyleSheet.create({
  photo: {
    height: moderateScale(64),
    width: moderateScale(114),

  },
});

export { styles };
export default PhotoGalleryItem