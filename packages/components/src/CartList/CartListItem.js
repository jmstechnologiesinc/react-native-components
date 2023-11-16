import React from 'react';

import { View } from 'react-native';

import { Text, Button, MD3LightTheme, Divider, Avatar, MD3Colors } from '@jmstechnologiesinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmstechnologiesinc/cart';

import CartListProductItem from './CartListProductItem';
import ScreenWrapper from '../ScreenWrapper';
import { imagekitUrl, itemSeparator } from '../utils';
import SwipeToDelete from '../SwipeToDelete/SwipeToDelete';
import { Item as JMSItem } from '../List/List';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';

const CartListItem = ({
    checkoutTitle,
    addTitle,
    showProductDescription,
    item,
    onAdd,
    onDelete,
    onEdit,
    onCheckout,
    renderTips,
   
}) => {
    const { vendor, type, description, isValid, data: productList, cartIndustryId } = item;

    if (type === CART_ITEM_TYPE.emptyItem) {
        return null;
    } else if (type === CART_ITEM_TYPE.checkout) {
        return (
            <ScreenWrapper.Section
                withPaddingHorizontal
                style={{ paddingTop: MD3LightTheme.spacing.x4, paddingBottom: MD3LightTheme.spacing.x4 }}
            >
                <Button mode="contained" onPress={() => onCheckout(item.vendorIds)}>
                    {checkoutTitle}
                </Button>
            </ScreenWrapper.Section>
        );
    } else if (type === 'industryWarning') {
        return (
            <View style={{ marginTop: MD3LightTheme.spacing.x4, marginBottom: MD3LightTheme.spacing.x4 }}>
                <Text variant={'headlineMedium'}>{vendor.title}</Text>
                <Text variant={'bodyMedium'}>{description}</Text>
            </View>
        );
    } else if (type === CART_ITEM_TYPE.industryTitle) {
        return null;
    }

    return (
        <>
            <JMSItem
                title={vendor.title}
                description={description}
                descriptionStyle={isValid === false ? { color: MD3Colors.error50 } : null}
                titleNumberOfLines={0}
                descriptionNumberOfLines={0}
                left={(props) => (
                    <Avatar.Image style={props.style} source={{ uri: imagekitUrl(vendor.photo) }} />
                )}
            />

            {productList?.map((product, index) => (
                <SwipeToDelete
                    key={`swipeable-${product.cartId}`}
                    onSwipeableRightOpen={() => onDelete(vendor.id, product.cartId, cartIndustryId)}
                >
                    <CartListProductItem
                        data={product}
                        onEdit={() => onEdit(product, item.vendor, cartIndustryId)}
                        descriptionNumberOfLines={1}
                        showProductDescription={showProductDescription}
                    />
                    {itemSeparator(index, productList.length) ? <Divider /> : null}
                </SwipeToDelete>
            ))}

            <ButtonWrapper
                title={addTitle}
                onPress={() => onAdd(item.vendor, cartIndustryId)} />

            {renderTips ? renderTips(item) : null}
        </>
    );
};

export default CartListItem;
