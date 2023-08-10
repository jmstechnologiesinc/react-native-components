import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { View } from 'react-native';

import StickySectionList from '../StickySectionList/StickySectionList';
import ProductListItem from './ProductListItem';
import { imagekitUrl } from '../utils';

const keyExtractor = (productItem) => productItem.id;

const ProductListSticky = ({
    sections,
    productItemQuantityMapping,
    fulfillmentMethodFilter,
    onPress,
    onContentOffsetYScroll,
    contentOffsetY,
    ButtonCartFAB,
    ...props
}) => (
    <>
        <StickySectionList
            {...props}
            sections={sections}
            renderSectionHeader={({ section: { title } }) => (
                <List.Subheader style={{ height: moderateScale(50) }}>{title}</List.Subheader>
            )}
            keyExtractor={keyExtractor}
            onContentOffsetYScroll={onContentOffsetYScroll}
            contentOffsetY={contentOffsetY}
            renderItem={({ item }) => (
                <>
                    <ProductListItem
                        id={item.id}
                        uuid={item.uuid}
                        photo={imagekitUrl(item.photo)}
                        title={item.title}
                        description={item.description}
                        formattedPrice={item.price.formattedValue}
                        cartQuantity={productItemQuantityMapping?.[item.id]}
                        quantity={item.quantity}
                        isOutofStock={item.isOutofStock}
                        fulfillmentMethodFilter={fulfillmentMethodFilter}
                        onPress={() => onPress(item)}
                    />
                </>
            )}
        />
        <View style={{ bottom: moderateScale(80) }}>
            <ButtonCartFAB />
        </View>
    </>
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
