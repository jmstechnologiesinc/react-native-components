import React from 'react';

import CartList from './CartList';

import mockData from './mockData.json';

export default {
    title: 'packages/CartList',
};

export const SingleIndustry = () => <CartList sections={mockData} />
