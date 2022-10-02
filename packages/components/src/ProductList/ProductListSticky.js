import React from 'react';

import { Divider, List } from '@jmsstudiosinc/react-native-paper';

import StickySectionList from '../StickySectionList/StickySectionList';

import ProductListItem from './ProductListItem';

const ProductListSticky = ({ sections, onViewProductItem, ...props }) => (
    <StickySectionList
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
                onPress={() => onViewProductItem(item)}

            />
        )}
    />
);

export default ProductListSticky;
