import React, { useMemo, useRef } from 'react';

import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { FlatList, View } from 'react-native'

import CartListItem from './CartListItem';

export const keyExtractor = productItem => productItem.key || productItem.id;

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
    isVisibleRideAndShare,
    ...props
}) => {

    const snapPoints = useMemo(() => ["50%", "70%", "80%", "85", "90", "95", "100%"], []);
    const bottomSheetRef = useRef()

    return (
        <>

            {isVisibleRideAndShare ?
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints} footerComponent={listBottomComponent}
                    index={2}
                >
                    <BottomSheetFlatList
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
                                isVisibleRideAndShare={isVisibleRideAndShare}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ListHeaderComponent={listHeaderComponent}
                        ListFooterComponent={listFooterComponent}
                    />
                </BottomSheet>
                :
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
                                onCheckout={onCheckout} />
                        )}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ListHeaderComponent={listHeaderComponent}
                        ListFooterComponent={<View style={listFooterComponentStyle}>{listFooterComponent}</View>}
                    />
                    {listBottomComponent}
                </>

            }


        </>
    );
};

export default CartList;
