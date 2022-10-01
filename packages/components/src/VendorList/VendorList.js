import React from 'react';
import { SectionList } from 'react-native';

import RenderVendorItem from './VendorItem';

const VendorList = ({ 
    sections, 
    onPress, 
    ...props  
}) => <SectionList
    {...props}
    sections={sections}
    renderItem={({item}) => (
        <RenderVendorItem item={item} onPress={onPress}/>
    )} 
    keyExtractor={(item) => `${item.id}`}
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false} />

export default VendorList;
