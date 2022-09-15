import React from 'react';
import { FlatList } from 'react-native';

import CartListItem from './CartListItem';
import styles from './styles';

const CartList = ({
    sections,
    onDelete,
    onEdit,
    onCheckout,
    renderSectionFooter,
    onInfo,
    onCheckoutDetails,
    onTips,
    ...props
}) => {
    return (
        <FlatList
            {...props}
            data={sections}
            renderItem={({ item }) => (
                <CartListItem item={item} onDelete={onDelete} onEdit={onEdit} onTips={onTips} onCheckout={onCheckout} />
            )}
            style={styles.container}
            ListHeaderComponent={onInfo}
            ListFooterComponent={onCheckoutDetails}
        />
    );
};

export default CartList;
