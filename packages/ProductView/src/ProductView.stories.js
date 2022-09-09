import React from 'react';

import ProductView from './ProductView';

import mockData from "../../ProductList/src/mockData.json"
import AttributeListMockData from '../../DynamicForm/src/mockData.json';
import { AttributeGroup } from '../../DynamicForm/src/DynamicForm.stories';

const product = mockData[0].data[0];
  
export default {
  title: 'packages/ProductView',
};

const photos = ["./wrecked-ship.jpg", "./wrecked-ship.jpg"];

export const SinglePhoto = () => <ProductView 
  title={product.title} 
  price={product.price}
  photos={product.photos}
  description={product.description} />

export const MultiplePhotos = () => <ProductView 
  title={product.title} 
  price={product.price}
  photos={photos}
  description={product.description} />

  export const NoPhoto = () => <ProductView 
  title={product.title} 
  price={product.price}
  description={product.description} />

export const ProductAttributeGroup = () => (
  <>
    <ProductView 
      title={product.title} 
      price={product.price}
      photos={product.photos}
      description={product.description} />

    <AttributeGroup/>
  </>
)

export const ProductAttributeGroupNoDesc = () => (
  <>
    <ProductView 
      title={product.title} 
      price={product.price}
      photos={product.photos} />

    <AttributeGroup/>
  </>
)