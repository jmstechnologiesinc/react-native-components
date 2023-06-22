import React from 'react';

import * as JMSList from '../List/List';

import { fastImageUrl } from '@jmstechnologiesinc/commons';

const ProductListItem = ({
    title,
    photo,
    description,
    formattedPrice,
    cartQuantity,
    isOutofStock,
    formattedQuantity,
    onPress,
}) => {
    const descriptionList = [];

    if (isOutofStock) {
        descriptionList.push('Out of Stock');
    }

    if (formattedQuantity) {
        descriptionList.push(formattedQuantity);
    }

    if (description) {
        descriptionList.push(description);
    }

    return (
        <JMSList.Item
            title={title}
            description={descriptionList}
            photo={fastImageUrl(photo)}
            metaTitle={formattedPrice}
            metaQuantity={cartQuantity}
            onPress={onPress}
            titleNumberOfLines={0}
            descriptionNumberOfLines={4}
        />
    );
};

ProductListItem.whyDidYouRender = true;

function areEqual(prevProps, nextProps) {
    if (
        prevProps.title !== nextProps.title ||
        prevProps.photo !== nextProps.photo ||
        prevProps.description !== nextProps.description ||
        prevProps.formattedPrice !== nextProps.formattedPrice ||
        prevProps.cartQuantity !== nextProps.cartQuantity ||
        prevProps.isOutofStock !== nextProps.isOutofStock ||
        prevProps.formattedQuantity !== nextProps.formattedQuantity ||
        prevProps.fulfillmentMethodFilter !== nextProps.fulfillmentMethodFilter
    ) {
        return false;
    }

    return true;
}

export default React.memo(ProductListItem, areEqual);
