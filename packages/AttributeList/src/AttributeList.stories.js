import React from 'react';
import { ScrollView as NativeScrollView } from 'react-native';

import AttributeList from './AttributeList';
import mockData from "./mockData.json";

export default {
  title: 'packages/AttributeList',
};

export const ScrollView = () => (
  <NativeScrollView>
    {mockData.map(product => <AttributeList 
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
  </NativeScrollView>
);



