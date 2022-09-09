import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import { MetaBadged } from '../List';

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

const CartListProductItem = ({ data }) => {
    const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);

    return (
        <List.Accordion
            isDisabled
            title={data.title}
            right={() => <MetaBadged title={data.price} quantity={data.quantity} />}
            expanded={attributeGroup.length > 0}
        >
            {attributeGroup.map((item) => (
                <List.Item title={item.title} />
            ))}
        </List.Accordion>
    );
};

export default CartListProductItem;
