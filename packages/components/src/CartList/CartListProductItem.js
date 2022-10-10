import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List/List';
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

const CartListProductItem = ({ data, onDelete, onEdit, isRemoveable = true}) => {
    const renderItem = (
        <List.Accordion
            title={data.title}
            expanded={true}
            right={() => <JMSList.MetaBadged title={data.price} quantity={data.quantity} />}
            onPress={onEdit}
            style={{...((data.price && data.quantity) && {paddingVertical: 4})}}
            rightStyle={{marginVertical: 0, marginRight: 0}}>
            {renderRecursiveAttributeGroup(data.attributeGroup).map((item) => (
                <JMSList.Item 
                    title={item.title} 
                    metaTitle={item.price}
                    metaQuantity={item.selection} 
                    /* style={{...((item.price && item.selection > 1) && {paddingVertical: 2})}}  *//>
            ))}
        </List.Accordion>
    );

    return isRemoveable ? (
        <SwipeToDelete isRemoveable={isRemoveable} onDelete={onDelete} >
          {renderItem}
        </SwipeToDelete>
    ) : renderItem;
};

export default CartListProductItem;
