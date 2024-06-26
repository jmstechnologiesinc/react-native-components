import React from 'react';

import mockData from "./mockData.json";

import * as ProductList from './ProductList';

export default {
  title: 'packages/ProductList',
};

export const StickyHeader = ({...props}) => <ProductList.Sticky {...props} sections={mockData} onPress={() => {}} />

