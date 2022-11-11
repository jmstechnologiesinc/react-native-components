import React from 'react';

import { Divider, List } from '@jmsstudiosinc/react-native-paper';
import { getMainPhoto } from '@jmsstudiosinc/commons';

import StickySectionList from '../StickySectionList/StickySectionList';
import ProductListItem from './ProductListItem';

const keyExtractor = (productItem) => productItem.id;

const ProductListSticky = ({ 
    sections, 
    productItemQuantityMapping,
    onPress, 
    onContentOffsetYScroll,
    contentOffsetY,
    ...props }) => (
    <StickySectionList
        {...props}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => <List.Subheader>{title}</List.Subheader>}
        ItemSeparatorComponent={Divider}
        keyExtractor={keyExtractor}
        onContentOffsetYScroll={onContentOffsetYScroll}
        contentOffsetY={contentOffsetY}
        renderItem={({ item }) => (
            <ProductListItem
                id={item.id}
                uuid={item.uuid}
                photo={getMainPhoto(item.photos)}
                title={item.title}
                description={item.description}
                price={item.price}
                cartQuantity={productItemQuantityMapping?.[item.id]}
                quantity={item.quantity}
                isOutofStock={item.isOutofStock}
                onPress={() => onPress(item)} />
        )}
    />
);

ProductListSticky.whyDidYouRender = true;

function areEqual(prevProps, nextProps) {
    if(prevProps.productItemQuantityMapping !== nextProps.productItemQuantityMapping || 
        prevProps.listHeaderComponent !== nextProps.listHeaderComponent || 
        prevProps.contentOffsetY !== nextProps.contentOffsetY) {
        return false;
    }
    
    return true;
}

export default React.memo(ProductListSticky, areEqual);
