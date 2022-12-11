import React from 'react';

import { List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { interpunct } from '@jmsstudiosinc/commons';
import ListMetaBadged from '../List/ListMetaBadged';

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

const CartListProductItem = ({ 
    data, 
    onEdit,
    showAttributeQuantity
}) => {
    const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);

    return (
        <>
            <List.Item 
                title={data.title}
                //description={interpunct(attributeGroup.map((item) => item.title))}
                descriptionNumberOfLines={10}
                left={() => <ListMetaBadged quantity={data.quantity} />}
                right={() => <ListMetaBadged title={data.price} />}
                onPress={onEdit}
            />
           {attributeGroup.map((item) => (
                <List.Item
                    key={`attribute-group-${item.id}`}
                    title={item.title} 
                    left={showAttributeQuantity ? () => (
                        <ListMetaBadged 
                            title={item.selection} 
                            quantityStyle={{backgroundColor: MD3LightTheme.colors.onSurfaceVariant}} />
                    ) : null}
                    right={() => (
                        <ListMetaBadged 
                            title={item.price} 
                            titleStyle={{color: MD3LightTheme.colors.secondary}} />
                    )}
                    titleStyle={{color: MD3LightTheme.colors.secondary}}
                    style={{paddingLeft: MD3LightTheme.spacing.x9}}
                    onPress={onEdit} />
            ))}
        </>
    );
};

export default CartListProductItem;
