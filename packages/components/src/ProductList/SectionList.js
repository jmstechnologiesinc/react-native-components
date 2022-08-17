import React from 'react';
import { SectionList as NativeSectionList, Animated } from 'react-native';

const AnimatedSectionList = Animated.createAnimatedComponent(NativeSectionList);

import { ProductListHeader, ProductListItem } from './ProductList';

const SectionList = ({
    sections,
    onPress,
    sectionListRef,
    blockUpdateIndexRef,
    setCurrentIdex,
    currentIndex,
    ...props
}) => {
    return (
        <AnimatedSectionList
            {...props}
            sections={sections}
            renderSectionHeader={({ section: { title } }) => <ProductListHeader title={title} />}
            renderItem={({ item }) => (
                <ProductListItem
                    id={item.id}
                    uuid={item.uuid}
                    photo={item.photos?.[0]}
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    quantity={item.quantity}
                    isOutofStock={item.isOutofStock}
                    onPress={onPress}
                />
            )}
        />
    );
};

export default SectionList;
