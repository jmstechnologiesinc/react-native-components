import React from 'react';

import { View } from 'react-native';

import { Banner, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

const ProductView = ({ 
    title, 
    photos, 
    description, 
    price, 
    isOutofStock, 
    pudErrorMessage,
    onLayoutTitleOffsetY
}) => {
    const message = [];

    if (isOutofStock) {
        message.push('This item is out of stock');
    }

    if (pudErrorMessage) {
        message.push(pudErrorMessage);
    }

    return (
        <>
            {message.length > 0 && (
                <Banner
                    visible={true}
                    actions={[]}
                    icon="alert-circle"
                    style={{ marginBottom: MD3LightTheme.spacing.x2 }}
                >
                    {message.join(', ')}. Please try again!
                </Banner>
            )}

            <PhotoGallery photos={photos} />
            
            <View onLayout={onLayoutTitleOffsetY ? (event) => onLayoutTitleOffsetY(event.nativeEvent.layout.y) : null}>
                <JMSList.Item
                    title={title}
                    description={description}
                    metaTitle={price}
                    titleVariant={'headlineSmall'}
                    metaTitleVariant={'headlineSmall'}
                    titleNumberOfLines={4} />
            </View>
        </>
    );
};

export default ProductView;
