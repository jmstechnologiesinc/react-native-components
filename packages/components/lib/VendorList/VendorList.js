import React from 'react';
import { SectionList } from 'react-native';
import  {Subheader}  from '../List';
import renderVendorItem from './VendorItem';

const VendorList = ({ sections, title = 'Nerby Vendors',  ...props }) => (
    <SectionList
        {...props}
        sections={sections}
        renderItem={renderVendorItem}
        renderSectionHeader={() => <Subheader title={title} />}
        keyExtractor={(item) => `${item.id}`}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
    />
);

export default VendorList;
