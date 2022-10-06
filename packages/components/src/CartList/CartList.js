import React from 'react';

import {FlatList } from 'react-native';

import CartListItem from './CartListItem';

const CartList = ({
    sections,
    onDelete,
    onEdit,
    onCheckout,
    onTips,
    listHeaderComponent,
    listFooterComponent,
    listBottomComponent,
    ...props
}) => {
    return (
        <>
            <FlatList
                {...props}
                data={sections}
                renderItem={({ item }) => (
                    <CartListItem item={item} onDelete={onDelete} onEdit={onEdit} onTips={onTips} onCheckout={onCheckout} />
                )}
                ListHeaderComponent={listHeaderComponent}
                ListFooterComponent={listFooterComponent}
            />
            {listBottomComponent}
        </>
    );
};

export default CartList;
