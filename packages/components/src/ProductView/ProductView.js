import React from 'react';

import {  View } from 'react-native';

import { Banner, Card, MD3LightTheme, Text } from '@jmsstudiosinc/react-native-paper';

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
                    style={{ marginBottom: MD3LightTheme.spacing.x2 }}
                >
                    {message.join(', ')}. Please try again!
                </Banner>
            )}

            <PhotoGallery photos={photos} />
            
            <View style={{paddingBottom: MD3LightTheme.spacing.x2}} 
                onLayout={onLayoutTitleOffsetY ? (event) => onLayoutTitleOffsetY(event.nativeEvent.layout.y) : null}>
                <Card.Title
                    title={title}
                    titleVariant="headlineMedium"
                    titleNumberOfLines={5}
                    right={() => (
                        <JMSList.MetaBadged 
                            titleVariant={'headlineMedium'} style={{marginRight: MD3LightTheme.spacing.x4}} 
                            title={price} />
                    )}
                />
                <Card.Content>
                    <Text variant="bodyMedium">
                        {description}
                    </Text>
                </Card.Content>
            </View>
        </>
    );
};

export default ProductView;
