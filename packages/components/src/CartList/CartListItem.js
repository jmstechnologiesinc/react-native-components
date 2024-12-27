import React, { useState } from 'react';

import { View, Platform } from 'react-native';

import { Text, Button, List, MD3LightTheme, Divider, Avatar, MD3Colors } from '@jmstechnologiesinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmstechnologiesinc/cart';

import CartListProductItem from './CartListProductItem';
import ScreenWrapper from '../ScreenWrapper';
import { imageKitAvatar, itemSeparator } from '../utils';
import SwipeToDelete from '../SwipeToDelete/SwipeToDelete';
import { Item as JMSItem } from '../List/List';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';
import { getMainPhoto } from '@jmstechnologiesinc/commons';
import { ridesData } from './mockDataUber'

import * as JMSList from '../List/List';


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
    isVisibleRideAndShare

}) => {
    const { vendor, type, description, isValid, data: productList, cartIndustryId } = item;

    const [isSwiped, SetIsSwiped] = useState(true)

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

            {
                !isVisibleRideAndShare ?
                    <JMSItem
                        title={vendor.title}
                        description={description}
                        descriptionStyle={isValid === false ? { color: MD3Colors.error50 } : null}
                        titleNumberOfLines={0}
                        descriptionNumberOfLines={0}
                        left={(props) => (
                            <Avatar.Image style={props.style} source={{ uri: imageKitAvatar(getMainPhoto(vendor.photos)) }} />
                        )}
                    />
                    : null
            }

            {
                isVisibleRideAndShare ?
                    ridesData.map((ride) => (
                        <>
                            <List.Section title={ride.title}>
                                {ride.data.map((ride) => (
                                    <>
                                        <JMSList.Item
                                            title={ride.type}
                                            description={ride.description}
                                            metaTitle={`$${ride.price}`}
                                            photo={ride.photo}
                                            titleNumberOfLines={0}
                                        />
                                        <Divider />
                                    </>
                                ))}
                            </List.Section>


                        </>

                    ))
                    :
                    Platform.OS === 'web' ? productList?.map((product, index) => (
                        <SwipeToDelete
                            key={`swipeable-${index}`}
                            onSwipeableRightOpen={() => onDelete(vendor.id, product.cartId, cartIndustryId)}
                            handleSwipeChange={SetIsSwiped}
                        >
                            <CartListProductItem
                                key={`cart-list-product-item-${index}`}
                                data={product}
                                onEdit={() => isSwiped ? onEdit(product, item.vendor, cartIndustryId) : null}
                                descriptionNumberOfLines={1}
                                showProductDescription={showProductDescription}
                                interpunctAttributeGroup={false}
                            />
                            {itemSeparator(index, productList.length) ? <Divider horizontalInset key={`cart-list-item-divider-${index}`} /> : null}
                        </SwipeToDelete>
                    )) : productList?.map((product, index) => (
                        <SwipeToDelete
                            key={`swipeable-${index}`}
                            onSwipeableRightOpen={() => onDelete(vendor.id, product.cartId, cartIndustryId)}
                        >
                            <CartListProductItem
                                key={`cart-list-product-item-${index}`}
                                data={product}
                                onEdit={() => onEdit(product, item.vendor, cartIndustryId)}
                                descriptionNumberOfLines={1}
                                showProductDescription={showProductDescription}
                                interpunctAttributeGroup={false}
                            />
                            {itemSeparator(index, productList.length) ? <Divider horizontalInset key={`cart-list-item-divider-${index}`} /> : null}
                        </SwipeToDelete>
                    ))
            }

            {
                !isVisibleRideAndShare ? <List.Section>
                    <ButtonWrapper
                        title={addTitle}
                        onPress={() => onAdd(item.vendor, cartIndustryId)} />
                </List.Section>
                    : null
            }


            {renderTips ? renderTips(item) : null}
        </>
    );
};

export default CartListItem;
