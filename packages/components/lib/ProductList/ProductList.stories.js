import React from 'react';

import mockData from './mockData.json';

import {SectionList} from './ProductList';

export default {
  title: 'packages/ProductList',
};

export const SectionList = () => (
  <SectionList sections={mockData} onPress={() => {}} />
);
