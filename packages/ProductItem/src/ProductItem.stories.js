import React from 'react';
import { View,StyleSheet,ScrollView, Image, Text } from 'react-native';

import {getMainPhoto} from "@jmsstudiosinc/commons";
import ProductItem from './ProductItem';
import mockData from "./mockData.json";

export default {
  title: 'packages/ProductItem',
};

export const CustomDescription = () => (
  <ScrollView>
    {mockData.map(product => <ProductItem 
    id={product.id} 
    uuid={product.uuid} 
    photo={product.photos?.[0]} 
    title={product.title} 
    description={product.description} 
    price={product.price} 
    quantity={product.quantity} 
    isOutofStock={product.isOutofStock} />
  )}
  </ScrollView>
);



