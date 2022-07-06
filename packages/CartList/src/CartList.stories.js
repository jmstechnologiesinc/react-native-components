import React from 'react';
import { ScrollView } from 'react-native';

import CartItem from './CartList';

import mockData from "./mockData.json";

export default {
  title: 'packages/CartList',
};

export const Basic = () => (
  <ScrollView>
    {mockData.map((item) => <CartItem
      id={item.id} 
      type={item.type}
      title={item.title} 
      total={item.total} 
      description={item.description} 
      data={item.data}/>
    )}
  </ScrollView>
);



