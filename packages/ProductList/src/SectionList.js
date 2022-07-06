import React from 'react';
import { SectionList as NativeSectionList, Animated } from 'react-native';

const AnimatedSectionList = Animated.createAnimatedComponent(NativeSectionList);

import * as Product from '.';

const SectionList = ({sections, onPress, ...props}) => (
    <AnimatedSectionList 
        {...props}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => (
            <Product.Header title={title} />
        )}
        renderItem={({ item }) => <Product.Item     
            id={item.id} 
            uuid={item.uuid} 
            photo={item.photos?.[0]} 
            title={item.title} 
            description={item.description} 
            price={item.price} 
            quantity={item.quantity} 
            isOutofStock={item.isOutofStock}
            onPress={onPress} /> 
        }
    />
);

export default SectionList
  