import React from 'react';

import { Divider, List } from '@jmsstudiosinc/react-native-paper';

import StickyList from '../StickyList';

import ProductListItem from './ProductListItem';

const ProductListSticky = ({ sections, onPress, ...props }) => (
    <StickyList
        {...props}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => <List.Subheader>{title}</List.Subheader>}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
            <ProductListItem
                id={item.id}
                uuid={item.uuid}
                photo={item.photos?.[0]}
                title={item.title}
                description={item.description}
                price={item.price}
                cartQuantity={item.cartQuantity}
                quantity={item.quantity}
                isOutofStock={item.isOutofStock}
                onPress={onPress}
            />
        )}
    />
);

export default ProductListSticky;
