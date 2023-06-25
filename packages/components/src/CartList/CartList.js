import React from 'react';

import {FlatList, View} from 'react-native';

import CartListItem from './CartListItem';

const keyExtractor = productItem => productItem.key || productItem.id;

const CartList = ({
    checkoutTitle,
    addTitle,
    sections,
    showProductDescription,
    onAdd,
    onDelete,
    onEdit,
    onCheckout,
    renderTips,
    listHeaderComponent,
    listFooterComponent,
    listBottomComponent,
    listFooterComponentStyle,
    fastImageUrlWrapper,
    ...props
}) => {
    return (
        <>
            <FlatList
                {...props}
                data={sections}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => (
                    <CartListItem 
                        checkoutTitle={checkoutTitle}
                        addTitle={addTitle}
                        showProductDescription={showProductDescription}
                        item={item} 
                        renderTips={renderTips} 
                        onAdd={onAdd}
                        onDelete={onDelete} 
                        onEdit={onEdit} 
                        onCheckout={onCheckout} 
                        fastImageUrlWrapper={fastImageUrlWrapper}
                        />
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={listHeaderComponent}
                ListFooterComponent={<View style={listFooterComponentStyle}>{listFooterComponent}</View>}
            />
            {listBottomComponent}
        </>
    );
};

export default CartList;
