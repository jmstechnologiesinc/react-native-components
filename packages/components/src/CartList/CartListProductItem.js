import React from 'react';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { interpunct } from '@jmstechnologiesinc/commons';
import * as JMSList from '../List/List';
import { MD3Colors } from '@jmstechnologiesinc/react-native-paper';
const { dinero, toDecimal } = require('dinero.js');
import I18n from 'i18n-js';

const recursiveAttributeGroup = ({ parentId, attributeGroup }) => {
    const results = [];

    if (!parentId) return null;

    for (attributeOption in attributeGroup) {
        if (attributeGroup[attributeOption].parentId === parentId) {
            results.push({
                ...attributeGroup[attributeOption],
                ...recursiveAttributeGroup({ parentId: attributeOption, attributeGroup }),
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
    const descriptionList = [];

    if(data.isValid === false) {
        descriptionList.push(data.formattedQuantity);
    }

    if(showProductDescription && data.description) {
        descriptionList.push(data.description);
    }

    const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);

    if(interpunctAttributeGroup && attributeGroup.length > 0) {
        if(!descriptionList.length) {
            descriptionList.push(null);
        }

        descriptionList.push(interpunct(attributeGroup.map((item) => item.title)));
    }

    return (  
        <>
            <JMSList.Item 
                title={data.title}
                description={descriptionList}
                titleNumberOfLines={titleNumberOfLines}
                descriptionNumberOfLines={descriptionNumberOfLines}
                descriptionStyle={data.isValid === false ? {color: MD3Colors.error50} : null }
                left={() => <JMSList.MetaBadged quantity={data.cartQuantity} />}
                right={() => <JMSList.MetaBadged title={ I18n.l('currency', toDecimal(dinero(data.price)))} />}
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
                            title={item.quantity} 
                            quantityStyle={{backgroundColor: MD3LightTheme.colors.onSurfaceVariant}} />
                    ) : null}
                    right={() => (
                        <JMSList.MetaBadged 
                            title={ I18n.l('currency', toDecimal(dinero(item.price)))} 
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
