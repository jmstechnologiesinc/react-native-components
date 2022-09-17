import React from 'react';
import { SectionList } from 'react-native';
import  {Subheader}  from '../List';
import RenderVendorItem from './VendorItem';

const VendorList = ({ sections, title = 'Nerby Vendors',  onPress, ...props  }) => (
    <SectionList
        {...props}
        sections={sections}
        renderItem={({item}) => (
            <RenderVendorItem item={item} onPress={onPress}/>
        )} 
        renderSectionHeader={() => <Subheader title={title} onPress={onPress}/>}
        keyExtractor={(item) => `${item.id}`}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
    />
);

export default VendorList;
