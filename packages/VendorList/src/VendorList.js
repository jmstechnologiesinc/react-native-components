import React from 'react';
import {SectionList} from 'react-native';
import fullFilteredVendors from './mockData.json';
import renderVendorItem from './VendorItem';

const VendorList = () => {
  return (
    <SectionList
      sections={[{data: fullFilteredVendors}]}
      renderItem={renderVendorItem}
      keyExtractor={item => `${item.id}`}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default VendorList;
