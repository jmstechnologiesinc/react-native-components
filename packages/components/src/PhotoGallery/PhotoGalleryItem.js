import React from 'react'

import { StyleSheet } from 'react-native'
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'
import ImageBlurLoading from '@jmstechnologiesinc/react-native-image-blur-loading'

const PhotoGalleryItem = ({ uri,lqipUri, isActive, }) => (
  <ImageBlurLoading
    thumbnailSource={{ uri: lqipUri }}
    source={{ uri: uri }}
    fastImage={true}
    style={[styles.photo, { opacity: isActive ? 1 : 0.5 }]}/>
)

const styles = StyleSheet.create({
  photo: {
    height: moderateScale(76),
    width: moderateScale(76),
  },
});

export { styles };
export default PhotoGalleryItem