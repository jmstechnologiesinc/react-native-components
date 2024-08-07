
// material design value

// List subheaders:  48dp

// One line:  56dp 
// Two line:  72dp
// Three line: 88dp

// Divider:  StyleSheet.hairlineWidth

// custom option
// height: 100


import React from 'react';

import * as JMSList from '../List/List';
import { localized } from '../Localization/Localization';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { imageKitListImage, imageKitListImagelqip, isPublicUrl } from '../utils';

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

    const setDynamicSize = description === undefined && photo === null ? moderateScale(56) : moderateScale(100);

    return (
        <JMSList.Item
            title={title}
            description={descriptionList}
            photo={isPublicUrl(photo) ? photo : imageKitListImage(photo)}
            photoLqip={isPublicUrl(photo) ? photo : imageKitListImagelqip(photo)}
            metaTitle={formattedPrice}
            metaQuantity={cartQuantity}
            onPress={onPress}
            titleNumberOfLines={0}
            left={left}
            style={{ height: setDynamicSize }}
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
