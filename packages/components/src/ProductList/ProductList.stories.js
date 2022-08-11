import React from 'react';

import mockData from './mockData.json';

import {SectionList} from './ProductList';

export default {
  title: 'packages/ProductList',
};

export const SectionLists = () => (
  <SectionList sections={mockData} onPress={() => {}} />
);
