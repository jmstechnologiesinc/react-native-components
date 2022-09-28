import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Text, List, Button } from '@jmsstudiosinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';
import { Subheader } from '../List';
import CartListProductItem from './CartListProductItem';

const vendorPhoto = 'https://d1ralsognjng37.cloudfront.net/21abd571-1fa3-4214-ae02-2e828864dea3.jpeg';

const CartListItem = ({  item, onDelete, onEdit, onCheckout, onTips  }) => {

    const { id, title, type, total, description, data, cartIndustryId } = item;

  
    if (type === CART_ITEM_TYPE.emptyItem) {
        return null;
    } else if (type === CART_ITEM_TYPE.checkout) {
        return (
            <Button mode="contained" onPress={() => onCheckout(item.vendorIds)} style={styles.button}>
                CHECKOUT
            </Button>
        );
    } else if (type === 'industryWarning') {
        return (
            <View style={{ marginTop: 40, marginBottom: 20 }}>
                <Text variant={'headlineMedium'}>{title}</Text>
                <Text variant={'bodyMedium'}>{description}</Text>
            </View>
        );
    } else if (type === CART_ITEM_TYPE.industryTitle) {
        return null;
        return <List.Section title={title} style={{ margin: 0 }}></List.Section>;
    }

    return (
        <List.Section>
            <Subheader title={title} avatar={vendorPhoto} />

            {data?.map((data) => (
                <CartListProductItem data={data}  onDelete={() => onDelete(id, data.cartId, cartIndustryId)}   onEdit={() => onEdit({data, item})} />
            ))}

            {onTips &&  onTips(item)}

           
        </List.Section>
    );
};

const styles = StyleSheet.create({
    button: {
        margin: 16,
    },
});

export default CartListItem;
