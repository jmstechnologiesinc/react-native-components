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
      title={product.title} 
      data={product.data}
      id={product.id}
      uuid={product.uuid}
      taxonomyType={product.taxonomyType}
      selection={product.selection}
      minSelection={product.minSelection}
      maxSelection={product.maxSelection}
      isValid={product.isValid}
      formattedSelection={product.formattedSelection} />
    )}
  </ScrollView>
);



