import React, { useState } from 'react';

import { View } from 'react-native';

import { Banner, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import { localized } from '../Localization/Localization';

const ProductView = ({
    title,
    photos,
    description,
    formattedPrice,
    isOutofStock,
    fulfillmentMethodErrorMessage,
    onLayoutTitleOffsetY,
}) => {
    const message = [];
    const descriptionList = [formattedPrice];

    if (isOutofStock) {
        message.push(localized('itemOutOfStock'));
    }

    if (fulfillmentMethodErrorMessage) {
        message.push(fulfillmentMethodErrorMessage);
    }

    if (description) {
        descriptionList.push(description);
    }

 

    return (
        <>
            {message.length > 0 && (
                <Banner visible={true} actions={[]} elevation={1} style={{ marginBottom: MD3LightTheme.spacing.x2 }}>
                    {message.join(', ')} {localized('global.tryAgainLater')}
                </Banner>
            )}

            <PhotoGallery photos={photos} />

            <View
                style={{ paddingBottom: MD3LightTheme.spacing.x2 }}
                onLayout={onLayoutTitleOffsetY ? (event) => onLayoutTitleOffsetY(event.nativeEvent.layout.y) : null}
            >
                <JMSList.Item
                    title={title}
                    description={descriptionList}
                    titleNumberOfLines={0}
                    descriptionNumberOfLines={0}
                    titleVariant="headlineSmall"
                    descriptionVariant="headlineSmall"
                    descriptionStyle={{ color: MD3LightTheme.colors.onSurface }}
                />
            </View>
        </>
    );
};

export default ProductView;
