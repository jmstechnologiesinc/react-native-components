import React from 'react';

import { View } from 'react-native';

import { Text, Button, MD3LightTheme, Chip } from '@jmsstudiosinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';

import {  ItemExtended } from '../List/List';
import CartListProductItem from './CartListProductItem';

const CartListItem = ({  
    item, 
    onAdd,
    onDelete, 
    onEdit, 
    onCheckout, 
    renderTips  
}) => {
    const { 
        id, 
        title, 
        photo, 
        fulfillmentFormattedAddress, 
        type, 
        description, 
        data: productItems, 
        cartIndustryId 
    } = item;
    
    if (type === CART_ITEM_TYPE.emptyItem) {
        return null;
    } else if (type === CART_ITEM_TYPE.checkout) {
        return <Button 
            mode="contained"
            onPress={() => onCheckout(item.vendorIds)}
            style={{
                marginHorizontal: MD3LightTheme.margin, 
                marginVertical: MD3LightTheme.margin * 3
            }}>
            CHECKOUT
        </Button>
    } else if (type === 'industryWarning') {
        return (
            <View style={{ marginTop: MD3LightTheme.margin * 6, marginBottom: MD3LightTheme.margin * 3 }}>
                <Text variant={'headlineMedium'}>{title}</Text>
                <Text variant={'bodyMedium'}>{description}</Text>
            </View>
        );
    } else if (type === CART_ITEM_TYPE.industryTitle) {
        return null
    }

    return (
        <>
            <ItemExtended 
                overline={fulfillmentFormattedAddress} 
                title={title} 
                avatar={photo}
                description={description} />
        
            {productItems?.map((product) => (
                <CartListProductItem 
                    data={product}  
                    onDelete={() => onDelete(id, product.cartId, cartIndustryId)}   
                    onEdit={() => onEdit(product, item)} />
            ))}
            
            <View style={{flexDirection: "row", marginHorizontal: MD3LightTheme.margin}}>
                <Chip mode="outlined" onPress={() => onAdd(item)}>Add Items</Chip>
            </View>

            {renderTips && renderTips(item)}           
        </>
    );
};

export default CartListItem;
