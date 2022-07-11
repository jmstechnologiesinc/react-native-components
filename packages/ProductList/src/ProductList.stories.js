import React from 'react';

import mockData from "./mockData.json";

import * as Product from '.';

export default {
  title: 'packages/ProductList',
};

export const SectionList = () => <Product.SectionLists sections={mockData} onPress={() => {}} />




