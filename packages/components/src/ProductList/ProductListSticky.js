import React from 'react';

import { Divider } from '@jmsstudiosinc/react-native-paper';

import { SectionHeader } from '../List';
import StickyList from '../StickyList';

import * as ProductList from './ProductList';

const ProductListSticky = ({ sections, onPress, ...props }) => (
    <StickyList
        {...props}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
            <ProductList.Item
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
