import React from 'react';

import { List ,Divider} from '@jmstechnologiesinc/react-native-paper';

import StickySectionList from '../StickySectionList/StickySectionList';
import ProductListItem from './ProductListItem';
import { imagekitUrl } from '../utils';

const keyExtractor = (productItem) => productItem.id;

const ProductListSticky = ({
    sections,
    renderSectionFooter,
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
        renderSectionHeader={({ section: { title } }) => (
            <List.Subheader >{title}</List.Subheader>
        )}
        renderSectionFooter={renderSectionFooter}
        ItemSeparatorComponent={() => <Divider horizontalInset />}
        keyExtractor={keyExtractor}
        onContentOffsetYScroll={onContentOffsetYScroll}
        contentOffsetY={contentOffsetY}
        renderItem={({ item }) => (
            <ProductListItem
                id={item.id}
                uuid={item.uuid}
                photo={imagekitUrl(item.photo)}
                title={item.title}
                description={item.description}
                formattedPrice={item.price.formattedValue}
                cartQuantity={productItemQuantityMapping?.[item.id]}
                isOutofStock={item.availability.isOutofStock}
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
