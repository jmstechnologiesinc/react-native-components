import React from 'react';
import { View,StyleSheet,ScrollView, Image, Text } from 'react-native';

import {getMainPhoto} from "@jmsstudiosinc/commons";
import Chip from '../../ReactNativePaper/components/Chip/Chip';
import AttributeGroup from './AttributeGroup';
import mockData from "./mockData.json";

export default {
  title: 'packages/AttributeGroup',
};

export const CustomDescription = () => (
  <ScrollView>
    {mockData.map(product => <AttributeGroup 
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



