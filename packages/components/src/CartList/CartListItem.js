import React from 'react';

import { View } from 'react-native';

import { Text, Button, MD3LightTheme, Divider, Avatar, MD3Colors } from '@jmsstudiosinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';

import CartListProductItem from './CartListProductItem';
import ScreenWrapper from '../ScreenWrapper';
import { itemSeparator } from '../utils';
import SwipeToDelete from '../SwipeToDelete/SwipeToDelete';
import {Item as JMSItem}  from '../List/List';
import { MATERIAL_ICONS } from '@jmsstudiosinc/commons';

const CartListItem = ({  
    checkoutTitle,
    addTitle,
    showProductDescription,
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
        type, 
        description, 
        isValid,
        data: productItems, 
        cartIndustryId 
    } = item;

    if (type === CART_ITEM_TYPE.emptyItem) {
        return null;
    } else if (type === CART_ITEM_TYPE.checkout) {
        return (
            <ScreenWrapper.Section
                withPaddingHorizontal
                style={{ paddingTop: MD3LightTheme.spacing.x8, paddingBottom: MD3LightTheme.spacing.x8 }}
            >
                <Button mode="contained" onPress={() => onCheckout(item.vendorIds)}>
                    {checkoutTitle}
                </Button>
            </ScreenWrapper.Section>
        );
    } else if (type === 'industryWarning') {
        return (
            <View style={{ marginTop: MD3LightTheme.spacing.x8, marginBottom: MD3LightTheme.spacing.x8 }}>
                <Text variant={'headlineMedium'}>{title}</Text>
                <Text variant={'bodyMedium'}>{description}</Text>
            </View>
        );
    } else if (type === CART_ITEM_TYPE.industryTitle) {
        return null;
    }

    return (
        <>
            <JMSItem
                title={title} 
                description={description}
                descriptionStyle={isValid ? null : {color: MD3Colors.error50}}
                titleNumberOfLines={0}
                descriptionNumberOfLines={0}
                left={(props) => (
                    <Avatar.Image style={props.style} source={{ uri: photo }} />
                )}
            />

            {productItems?.map((product, index) => (
                <SwipeToDelete 
                    key={`swipeable-${product.cartId}`}
                    onSwipeableRightOpen={() => onDelete(id, product.cartId, cartIndustryId)} >
                    <CartListProductItem 
                        data={product}    
                        onEdit={() => onEdit(product, item)}
                        descriptionNumberOfLines={1}
                        showProductDescription={showProductDescription} />
                    {itemSeparator(index, productItems.length) && <Divider />}
                </SwipeToDelete>
            ))}

            <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row' }}>
                <Button icon={MATERIAL_ICONS.increment} onPress={() => onAdd(item)}>
                    {addTitle}
                </Button>
            </ScreenWrapper.Section>

            {renderTips ? renderTips(item) : null}
        </>
    );
};

export default CartListItem;
