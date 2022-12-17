import React from 'react';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { interpunct } from '@jmsstudiosinc/commons';
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

const CartListProductItem = ({ 
    data, 
    onEdit,
    titleNumberOfLines = 0,
    descriptionNumberOfLines = 0,
    showAttributeQuantity,
    interpunctAttributeGroup = true,
    showProductDescription = true
}) => {
    const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);
    
    const productDescription = [];
    if(showProductDescription && data.description) {
        productDescription.push(data.description);
    }

    if(interpunctAttributeGroup && attributeGroup.length > 0) {
        if(!productDescription.length) {
            productDescription.push(null);
        }

        productDescription.push(interpunct(attributeGroup.map((item) => item.title)));
    }

    return (  
        <>
            <JMSList.Item 
                title={data.title}
                description={productDescription}
                titleNumberOfLines={titleNumberOfLines}
                descriptionNumberOfLines={descriptionNumberOfLines}
                left={() => <JMSList.MetaBadged quantity={data.quantity} />}
                right={() => <JMSList.MetaBadged title={data.price} />}
                onPress={onEdit}
            />
           {!interpunctAttributeGroup ? attributeGroup.map((item) => (
                <JMSList.Item
                    key={`attribute-group-${item.id}`}
                    title={item.title} 
                    titleNumberOfLines={0}
                    descriptionNumberOfLines={0}                    
                    left={showAttributeQuantity ? () => (
                        <JMSList.MetaBadged 
                            title={item.selection} 
                            quantityStyle={{backgroundColor: MD3LightTheme.colors.onSurfaceVariant}} />
                    ) : null}
                    right={() => (
                        <JMSList.MetaBadged 
                            title={item.price} 
                            titleStyle={{color: MD3LightTheme.colors.secondary}} />
                    )}
                    titleStyle={{color: MD3LightTheme.colors.secondary}}
                    style={{paddingLeft: MD3LightTheme.spacing.x9}}
                    onPress={onEdit} />
            )) : null}
        </>
    );
};

export default CartListProductItem;
