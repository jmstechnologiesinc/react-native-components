import React from 'react';
import { SectionList } from 'react-native';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { itemSeparator } from '../utils';

import VendorItem from './VendorItem';

const VendorList = ({ 
    sections, 
    onPress, 
    ...props  
}) => <SectionList
    {...props}
    sections={sections}
    renderItem={({item}) => (
        <VendorItem 
            item={item} 
            onPress={onPress} />
    )} 
    keyExtractor={(item) => `${item.id}`}
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false} />

export default VendorList;
