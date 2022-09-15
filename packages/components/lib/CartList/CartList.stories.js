import React from 'react';
import { FlatList as NativeFlatList } from 'react-native';

import * as CartList from './CartList';

import mockData from "./mockData.json";

export default {
  title: 'packages/CartList',
};

export const FlatList = () => (
  <NativeFlatList 
    data={mockData}
    renderItem={CartList.Item} />
);



