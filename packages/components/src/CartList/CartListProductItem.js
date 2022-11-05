import React from 'react';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List/List';

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
            results.push(...recursiveAttributeGroup({ 
                parentId: attributeGroup[index].id, 
                attributeGroup 
            }));
        }
    }

    return results;
};

const CartListProductItem = ({ data, onEdit}) => {
    const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);

    return (
        <>
            <JMSList.Item 
                title={data.title}
                metaTitle={data.price}
                metaQuantity={data.quantity}
                onPress={onEdit}
            />
            {attributeGroup.map((item) => (
                <JMSList.Item 
                    key={`attribute-group-${item.id}`}
                    title={item.title} 
                    metaTitle={item.price}
                    metaQuantity={item.selection}
                    onPress={onEdit}
                    titleStyle={{color: MD3LightTheme.colors.secondary}}
                    style={{marginLeft: MD3LightTheme.margin / 2}} />
            ))}
        </>
    );
};

export default CartListProductItem;
