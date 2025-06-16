import React from 'react';

import { View } from 'react-native';

import { Divider, List} from '@jmstechnologiesinc/react-native-paper';
import {  plurulize } from '@jmstechnologiesinc/commons';

import CartListProductItem from '../CartList/CartListProductItem';
import { itemSeparator, localized } from '..';

const OrderProductList = ({
    products=[],
    quantity
}) => (
    <List.Section title={`${quantity} ${plurulize(localized('order.item'), quantity)}`}>
        {products.map((item, index) => (
            <View key={`product-item-${item.id}`}>
                <CartListProductItem data={item} interpunctAttributeGroup={false} />
                {itemSeparator(index, products.length) ? <Divider horizontalInset /> : null}
            </View>
        ))}
    </List.Section>
)

export default OrderProductList;
