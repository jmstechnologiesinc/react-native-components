import React from 'react';

import mockData from "./mockData.json";

import * as Product from '.';

export default {
  title: 'packages/Product',
};

export const Header = () => <Product.Header title={mockData[0].title} />
export const SectionList = () => <Product.SectionLists sections={mockData} onPress={() => {}} />




