import { StyleSheet, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters';
import ImageBlurLoading from '@jmstechnologiesinc/react-native-image-blur-loading'

const PhotoGalleryMainImage = ({ uri,lqipUri }) => (
    <View style={styles.mainImage} >
        <ImageBlurLoading
            thumbnailSource={{ uri: lqipUri }}
            source={{ uri: uri }}
            fastImage={true}
            style={styles.mainImage}/>
    </View>
)

const styles = StyleSheet.create({
    mainImage: {
        height: moderateScale(195),
    },
});

export default PhotoGalleryMainImage