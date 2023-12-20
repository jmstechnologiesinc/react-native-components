import React from 'react';

import { Banner, MD3LightTheme,List } from '@jmstechnologiesinc/react-native-paper';

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
            {message.length > 0 ? (
                <Banner visible={true} actions={[]} elevation={1} style={{ marginBottom: MD3LightTheme.spacing.x2 }}>
                    {message.join(', ')} {localized('global.tryAgainLater')}
                </Banner>
            ) : null}

            <PhotoGallery photos={photos} />
            
            <JMSList.Item
                title={title}
                description={descriptionList}
                titleNumberOfLines={0}
                descriptionNumberOfLines={0}
                titleVariant="headlineSmall"
                descriptionVariant="bodyLarge"
            />
        </>
    );
};

export default ProductView;
