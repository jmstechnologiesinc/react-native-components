import React from 'react';

import { List } from '@/react-native-paper';

import StickySectionList from '../StickySectionList/StickySectionList';
import ProductListItem from './ProductListItem';

const keyExtractor = (productItem) => productItem.id;

const ProductListSticky = ({
    sections,
    productItemQuantityMapping,
    fulfillmentMethodFilter,
    onPress,
    onContentOffsetYScroll,
    contentOffsetY,
    ...props
}) => (
    <StickySectionList
        {...props}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => <List.Subheader>{title}</List.Subheader>}
        keyExtractor={keyExtractor}
        onContentOffsetYScroll={onContentOffsetYScroll}
        contentOffsetY={contentOffsetY}
        renderItem={({ item }) => (
            <ProductListItem
                id={item.id}
                uuid={item.uuid}
                photo={item.photo}
                title={item.title}
                description={item.description}
                formattedPrice={item.price.formattedValue}
                cartQuantity={productItemQuantityMapping?.[item.id]}
                quantity={item.quantity}
                isOutofStock={item.isOutofStock}
                fulfillmentMethodFilter={fulfillmentMethodFilter}
                onPress={() => onPress(item)}
            />
        )}
    />
);

ProductListSticky.whyDidYouRender = true;

function areEqual(prevProps, nextProps) {
    if (
        prevProps.productItemQuantityMapping !== nextProps.productItemQuantityMapping ||
        prevProps.listHeaderComponent !== nextProps.listHeaderComponent ||
        prevProps.contentOffsetY !== nextProps.contentOffsetY
    ) {
        return false;
    }

    return true;
}

export default ProductListSticky;
