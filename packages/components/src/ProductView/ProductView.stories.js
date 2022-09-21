import React from 'react';

import ProductView from './ProductView';

import mockData from '../ProductList/mockData.json';
import AttributeListMockData from '../DynamicForm/mockData.json';
import { AttributeGroup } from '../DynamicForm/DynamicForm.stories';

const product = mockData[0].data[0];

export default {
    title: 'packages/ProductView',
};

const photos = ["https://ik.imagekit.io/sog7th7xvupr/o/vendors%2FAHwW%2Bi2vQAKFUcuRPJUq0Q%3A0.jpeg?alt=media&token=ce6576d6-5aec-4a3f-91e4-ef7032f6e5eb",
  "https://ik.imagekit.io/sog7th7xvupr/o/vendors%2FAHwW%2Bi2vQAKFUcuRPJUq0Q%3A0.jpeg?alt=media&token=ce6576d6-5aec-4a3f-91e4-ef7032f6e5eb"]

export const SinglePhoto = () => (
    <ProductView
        title={product.title}
        price={product.price}
        photos={product.photos}
        description={product.description}
    />
);

export const MultiplePhotos = () => (
    <ProductView title={product.title} price={product.price} photos={photos} description={product.description} />
);

export const NoPhoto = () => (
    <ProductView title={product.title} price={product.price} description={product.description} />
);

export const ProductAttributeGroup = () => (
    <>
        <ProductView
            title={product.title}
            price={product.price}
            photos={product.photos}
            description={product.description}
        />

        <AttributeGroup />
    </>
);

export const ProductAttributeGroupNoDesc = () => (
    <>
        <ProductView title={product.title} price={product.price} photos={product.photos} />

        <AttributeGroup />
    </>
);
