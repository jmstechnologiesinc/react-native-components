import React from 'react';

import { View } from 'react-native';

import { Text, Button, MD3LightTheme, Chip, Divider } from '@jmsstudiosinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';

import {  ItemExtended } from '../List/List';
import CartListProductItem from './CartListProductItem';
import ScreenWrapper from '../ScreenWrapper';

const CartListItem = ({  
    checkoutTitle,
    addTitle,
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
        return <ScreenWrapper.Section withPaddingHorizontal style={{paddingTop: MD3LightTheme.margin * 2}}>
            <Button 
                mode="contained"
                onPress={() => onCheckout(item.vendorIds)}>
                {checkoutTitle}
            </Button>
        </ScreenWrapper.Section>
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
        
            {productItems?.map((product, index) => (
                <>
                    <CartListProductItem 
                        data={product}  
                        onDelete={() => onDelete(id, product.cartId, cartIndustryId)}   
                        onEdit={() => onEdit(product, item)} />
                    {((index === 0 && productItems.length > 1) || index < productItems.length - 1) && <Divider />}
                </>
            ))}
            
            <ScreenWrapper.Section withPaddingHorizontal style={{flexDirection: "row"}}>
                <Chip mode="outlined" onPress={() => onAdd(item)}>{addTitle}</Chip>
            </ScreenWrapper.Section>
            
            {renderTips && renderTips(item)}           
        </>
    );
};

export default CartListItem;
