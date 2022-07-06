import React from 'react';
import { ScrollView } from 'react-native';

import AttributeGroupList from './AttributeGroupList';
import mockData from "./mockData.json";

export default {
  title: 'packages/AttributeGroupList',
};

export const Basic = () => (
  <ScrollView>
    {mockData.map(product => <AttributeGroupList 
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



