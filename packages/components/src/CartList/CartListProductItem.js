import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List';
import SwipeToDelete from '../SwipeToDelete/SwipeToDelete';

const recursiveAttributeGroup = ({ parentId, attributeGroup }) => {
    const results = [];

    if (!parentId) return null;

    for (selection in attributeGroup) {
        if (attributeGroup[selection].parentId === parentId) {
            results.push({
                ...attributeGroup[selection],
                ...recursiveAttributeGroup({ parentId: selection, attributeGroup }),
            });
        }
    }

    return results;
};

const renderRecursiveAttributeGroup = (attributeGroup) => {
    const results = [];
    for (index in attributeGroup) {
        if (attributeGroup[index].parentId === null) {
            results.push(...recursiveAttributeGroup({ parentId: attributeGroup[index].id, attributeGroup }));
        }
    }

    return results;
};

const CartListProductItem = ({ data, isRemoveable = true}) => {
    const renderItem = <List.Accordion
        title={data.title}
        expanded={true}
        right={() => <JMSList.MetaBadged title={data.price} quantity={data.quantity} />}>
        {renderRecursiveAttributeGroup(data.attributeGroup).map((item) => (
            <JMSList.Item 
                title={item.title} 
                metaTitle={item.price}
                metaQuantity={item.selection || 1} 
                style={{marginRight: 8}} />
        ))}
    </List.Accordion>

    return isRemoveable ? (
        <SwipeToDelete isRemoveable={isRemoveable}>
          {renderItem}
        </SwipeToDelete>
    ) : renderItem;
};

export default CartListProductItem;
