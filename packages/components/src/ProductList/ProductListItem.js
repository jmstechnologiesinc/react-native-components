import React from 'react';

import * as JMSList from '../List/List';

const ProductListItem = ({ uuid, title, photo, description, price, cartQuantity, onPress }) => (
    <JMSList.Item
        title={title}
        photo={photo}
        description={description}
        metaTitle={price}
        metaQuantity={cartQuantity}
        onPress={onPress}
    />
);

export default ProductListItem;
