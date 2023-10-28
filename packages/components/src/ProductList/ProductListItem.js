import React from 'react';

import * as JMSList from '../List/List';
import { localized } from '../Localization/Localization';
import { moderateScale } from 'react-native-size-matters';

const ProductListItem = ({
    title,
    photo,
    description,
    formattedPrice,
    cartQuantity,
    isOutofStock,
    formattedQuantity,
    left,
    onPress,
}) => {
    const descriptionList = [];

    if (isOutofStock) {
        descriptionList.push(localized('outOfStock'));
    }

    if (formattedQuantity) {
        descriptionList.push(formattedQuantity);
    }

    if (description) {
        descriptionList.push(description);
    }

    const setDynamicSize = description === undefined && photo === null ? moderateScale(90) : moderateScale(100);

    return (
        <JMSList.Item
            title={title}
            description={descriptionList}
            photo={photo}
            metaTitle={formattedPrice}
            metaQuantity={cartQuantity}
            onPress={onPress}
            titleNumberOfLines={0}
            descriptionNumberOfLines={2}
            left={left}
            //style={{ height: setDynamicSize }}
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
