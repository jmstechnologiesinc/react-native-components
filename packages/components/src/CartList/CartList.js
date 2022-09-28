
import React from 'react';
import {FlatList } from 'react-native';

import CartListItem from './CartListItem';

const CartList = ({ sections, onDelete, onEdit, ...props }) => <FlatList
    {...props}
    data={sections}
    renderItem={({item }) => <CartListItem
        item={item}
        onDelete={onDelete}
        onEdit={onEdit} />
    }
    style={styles.container} />

export default CartList;