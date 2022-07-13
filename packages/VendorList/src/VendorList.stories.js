import React from 'react';
import {SectionList} from 'react-native';

import Data from './mockData.json';

import renderVendorItem from './VendorItem';

export default {
  title: 'packages/VendorList',
};

export const VendorLists = () => (
  <SectionList
    sections={[Data]}
    renderItem={renderVendorItem}
    keyExtractor={item => `${item.id}`}
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
  />
);
