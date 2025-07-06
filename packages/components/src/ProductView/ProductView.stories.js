import React from 'react';

import ProductView from './ProductView';

import mockData from '../ProductList/mockData.json';
import AttributeListMockData from '../DynamicForm/mockData.json';
import { AttributeGroup } from '../DynamicForm/DynamicForm.stories';
import { Basic as QuantityButton } from '../QuantityButton/QuantityButton.stories';
import { photos } from '../PhotoGallery/PhotoGallery.stories';

const product = mockData[0].data[0];

export default {
    title: 'packages/ProductView',
};

export const SinglePhoto = () => (
    <>
        <ProductView
            title={product.title}
            formattedPrice={product.formattedPrice}
            photos={product.photos}
            description={product.description}
        />
        <QuantityButton />
    </>
);

export const MultiplePhotos = () => (
    <>
        <ProductView
            title={product.title}
            formattedPrice={product.formattedPrice}
            photos={photos}
            description={product.description}
        />
        <QuantityButton />
    </>
);

export const NoPhoto = () => (
    <>
        <ProductView title={product.title} formattedPrice={product.formattedPrice} description={product.description} />
        <QuantityButton />
    </>
);

export const ProductAttributeGroup = () => (
    <>
        <ProductView
            title={product.title}
            formattedPrice={product.formattedPrice}
            photos={product.photos}
            description={product.description}
        />

        <AttributeGroup />
        <QuantityButton />
    </>
);

export const ProductAttributeGroupNoDesc = () => (
    <>
        <ProductView title={product.title} formattedPrice={product.formattedPrice} photos={product.photos} />

        <AttributeGroup />
        <QuantityButton />
    </>
);
