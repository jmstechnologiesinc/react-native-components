import React from 'react';

import {  View } from 'react-native';

import { Banner, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

const ProductView = ({ 
    title, 
    photos, 
    description,
    formattedPrice, 
    isOutofStock, 
    pudErrorMessage,
    onLayoutTitleOffsetY
}) => {
    const message = [];
    const descriptionList = [formattedPrice]

    if (isOutofStock) {
        message.push('This item is out of stock');
    }

    if (pudErrorMessage) {
        message.push(pudErrorMessage);
    }

    if(description) {
        descriptionList.push(description)
    }

    return (
        <>
            {message.length > 0 && (
                <Banner
                    visible={true}
                    actions={[]}
                    elevation={1}
                    style={{ marginBottom: MD3LightTheme.spacing.x2 }}
                >
                    {message.join(', ')}. Please try again later.
                </Banner>
            )}

            <PhotoGallery photos={photos} />
            
            <View style={{paddingBottom: MD3LightTheme.spacing.x2}} 
                onLayout={onLayoutTitleOffsetY ? (event) => onLayoutTitleOffsetY(event.nativeEvent.layout.y) : null}>
                 <JMSList.Item
                    title={title}
                    description={descriptionList}
                    titleNumberOfLines={0}
                    descriptionNumberOfLines={0}
                    titleVariant="headlineSmall" 
                    descriptionVariant="headlineSmall" />
            </View>
        </>
    );
};

export default ProductView;
