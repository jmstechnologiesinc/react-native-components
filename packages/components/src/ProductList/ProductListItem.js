import React from 'react';

import * as JMSList from '../List/List';

const ProductListItem = ({ 
    title, 
    photo, 
    description, 
    price, 
    cartQuantity, 
    onPress 
}) => (
    <JMSList.Item
        title={title}
        photo={photo}
        description={description}
        metaTitle={price}
        metaQuantity={cartQuantity}
        onPress={onPress} />
);

ProductListItem.whyDidYouRender = true;

function areEqual(prevProps, nextProps) {
    if(prevProps.cartQuantity !== nextProps.cartQuantity) {
        return false;
    }

    return true;
}

export default React.memo(ProductListItem, areEqual);
