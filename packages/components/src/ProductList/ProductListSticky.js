import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import sectionListGetItemLayout from './utils'

import { View } from 'react-native'
 
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
    ...props }) => {

    const getItemLayout = sectionListGetItemLayout({
        getItemHeight: () => 90,
        getSeparatorHeight: () => 0,
        getSectionHeaderHeight: () => 0,
        getSectionFooterHeight: () => 0,
        listHeaderHeight: 0,
    });


    return (
        <StickySectionList
            {...props}
            sections={sections}
            // renderSectionHeader={({ section: { title } }) => <List.Subheader>{title}</List.Subheader>}
            keyExtractor={keyExtractor}
            onContentOffsetYScroll={onContentOffsetYScroll}
            contentOffsetY={contentOffsetY}
            getItemLayout={(data, index) => getItemLayout(data, index)}
            renderItem={({ item }) => (
                  <View style={{ height: 90 }}>
                <ProductListItem
                    id={item.id}
                    uuid={item.uuid}
                    photo={item.photo}
                    title={item.title}
                    description={item.description}
                    formattedPrice={item.formattedPrice}
                    cartQuantity={productItemQuantityMapping?.[item.id]}
                    quantity={item.quantity}
                    isOutofStock={item.isOutofStock}
                    fulfillmentMethodFilter={fulfillmentMethodFilter}
                    onPress={() => onPress(item)} />
                    </View>
            )}
        />
    )
}

ProductListSticky.whyDidYouRender = true;

function areEqual(prevProps, nextProps) {
    if (prevProps.productItemQuantityMapping !== nextProps.productItemQuantityMapping ||
        prevProps.listHeaderComponent !== nextProps.listHeaderComponent ||
        prevProps.contentOffsetY !== nextProps.contentOffsetY) {
        return false;
    }

    return true;
}

export default ProductListSticky;
