import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';


import { View } from 'react-native'
 
import StickySectionList from '../StickySectionList/StickySectionList';
import ProductListItem from './ProductListItem';
import { moderateScale } from 'react-native-size-matters';

const keyExtractor = (productItem) => productItem.id;

const ProductListSticky = ({
    sections,
    productItemQuantityMapping,
    fulfillmentMethodFilter,
    onPress,
    onContentOffsetYScroll,
    contentOffsetY,
    ...props }) => {



    return (
        <StickySectionList
            {...props}
            sections={sections}
            renderSectionHeader={({ section: { title } }) => 
            <View style={{ height: moderateScale(50)}}>
            <List.Subheader>{title}</List.Subheader>
            </View>
            }
            keyExtractor={keyExtractor}
            onContentOffsetYScroll={onContentOffsetYScroll}
            contentOffsetY={contentOffsetY}
            getItemLayout={(data, index) => getItemLayout(data, index)}
            renderItem={({ item }) => {

                const value = item.photo === null && item.hasOwnProperty('description') === false ? 60
                : item.photo === null && item?.description?.length <= 40 ? 60
                : item.photo === null && item?.description?.length >= 100 ? 140
                : item.photo !== null && item?.description?.length >= 60 ? 140
                : item.photo !== null && item.hasOwnProperty('description') === false ? 90
                : item.photo !== null && item.hasOwnProperty('description') === true ? 100
                : 100

                
                return (
                <View style={{ height: value}}>
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
            )}}
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
