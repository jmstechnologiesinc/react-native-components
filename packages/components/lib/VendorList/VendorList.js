import React from 'react';
import { SectionList } from 'react-native';
import { SectionHeader } from '../../lib/List';
import renderVendorItem from './VendorItem';

const VendorList = ({ sections, title = 'Nerby Vendors',  ...props }) => (
    <SectionList
        {...props}
        sections={sections}
        renderItem={renderVendorItem}
        renderSectionHeader={() => <SectionHeader title={title} />}
        keyExtractor={(item) => `${item.id}`}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
    />
);

export default VendorList;
