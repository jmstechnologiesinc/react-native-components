import React from 'react';
import { View,StyleSheet,ScrollView, Image, Text } from 'react-native';

import {getMainPhoto} from "@jmsstudiosinc/commons";
import Chip from '../../ReactNativePaper/components/Chip/Chip';
import CartItem from './CartItem';
import mockData from "./mockData.json";
import theme from '../../ReactNativePaper/styles/themes/v3/LightTheme';

export default {
  title: 'packages/Cart',
};

export const CustomDescription = () => (
  <ScrollView style={{ backgroundColor: theme?.colors?.background }}>
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



