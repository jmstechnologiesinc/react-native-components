import React from 'react';
import { SectionList, View } from 'react-native';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import VendorListItem from './VendorListItem';

const keyExtractor = item => `vendor-list-${item.id}`;
const ItemSeparatorComponent = () => <View style={{marginBottom: MD3LightTheme.spacing.x4}} />

const VendorList = ({ 
    sections, 
    onPress, 
    ...props  
}) => <SectionList
    {...props}
    sections={sections}
    keyExtractor={keyExtractor}
    ItemSeparatorComponent={ItemSeparatorComponent}
    renderItem={({item}) => (
        <VendorListItem 
            item={item} 
            onPress={onPress} />
    )} 
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false} />

export default VendorList;
