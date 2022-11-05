import React from 'react';

import { View } from 'react-native';

import { Text, Button, MD3LightTheme, Chip, Divider } from '@jmsstudiosinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';

import { ItemExtended } from '../List/List';
import CartListProductItem from './CartListProductItem';
import ScreenWrapper from '../ScreenWrapper';
import { itemSeparator } from '../utils';
import Swipeable from '../SwipeToDelete/SwipeToDelete';

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
        formattedFulfillmentAddress, 
        type, 
        description, 
        data: productItems, 
        cartIndustryId 
    } = item;

    if (type === CART_ITEM_TYPE.emptyItem) {
        return null;
    } else if (type === CART_ITEM_TYPE.checkout) {
        return (
            <ScreenWrapper.Section withPaddingHorizontal style={{ paddingTop: MD3LightTheme.spacing.x4 * 2 }}>
                <Button mode="contained" onPress={() => onCheckout(item.vendorIds)}>
                    {checkoutTitle}
                </Button>
            </ScreenWrapper.Section>
        );
    } else if (type === 'industryWarning') {
        return (
            <View style={{ marginTop: MD3LightTheme.spacing.x4 * 6, marginBottom: MD3LightTheme.spacing.x4 * 3 }}>
                <Text variant={'headlineMedium'}>{title}</Text>
                <Text variant={'bodyMedium'}>{description}</Text>
            </View>
        );
    } else if (type === CART_ITEM_TYPE.industryTitle) {
        return null;
    }
    
    return (
        <>
            <ItemExtended 
                overline={formattedFulfillmentAddress} 
                title={title} 
                avatar={photo}
                description={description}
            />

            {productItems?.map((product, index) => (
                <Swipeable 
                    key={`swipeable-${product.cartId}`}
                    onSwipeableRightOpen={() => onDelete(id, product.cartId, cartIndustryId)} >
                    <CartListProductItem 
                        data={product}    
                        onEdit={() => onEdit(product, item)} />
                    {itemSeparator(index, productItems.length) && <Divider />}
                </Swipeable>
            ))}

            <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row' }}>
                <Chip mode="outlined" onPress={() => onAdd(item)}>
                    {addTitle}
                </Chip>
            </ScreenWrapper.Section>

            {renderTips && renderTips(item)}
        </>
    );
};
export default CartListItem;
