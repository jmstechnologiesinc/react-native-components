import React from 'react';

import {FlatList, View} from 'react-native';

import CartListItem from './CartListItem';

const CartList = ({
    checkoutTitle,
    addTitle,
    sections,
    onAdd,
    onDelete,
    onEdit,
    onCheckout,
    renderTips,
    listHeaderComponent,
    listFooterComponent,
    listBottomComponent,
    listFooterComponentStyle,
    ...props
}) => {
    return (
        <>
            <FlatList
                {...props}
                data={sections}
                renderItem={({ item }) => (
                    <CartListItem 
                        checkoutTitle={checkoutTitle}
                        addTitle={addTitle}
                        item={item} 
                        renderTips={renderTips} 
                        onAdd={onAdd}
                        onDelete={onDelete} 
                        onEdit={onEdit} 
                        onCheckout={onCheckout} />
                )}
                ListHeaderComponent={listHeaderComponent}
                ListFooterComponent={<View style={listFooterComponentStyle}>{listFooterComponent}</View>}
            />
            {listBottomComponent}
        </>
    );
};

export default CartList;
