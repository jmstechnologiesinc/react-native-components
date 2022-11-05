import React from 'react';
import { SectionList } from 'react-native';

import VendorItem from './VendorItem';

const keyExtractor = item => `vendor-list-${item.id}`;

const VendorList = ({ 
    sections, 
    onPress, 
    ...props  
}) => <SectionList
    {...props}
    sections={sections}
    keyExtractor={keyExtractor}
    renderItem={({item}) => (
        <VendorItem 
            item={item} 
            onPress={onPress} />
    )} 
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false} />

export default VendorList;
