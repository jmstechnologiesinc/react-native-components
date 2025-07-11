import React from 'react';

import CartList from './CartList';

import mockData from './mockData.json';
import { localized } from '../Localization/Localization';

export default {
    title: 'packages/CartList',
};

export const SingleIndustry = () => (
    <CartList sections={mockData} addTitle={localized('addItem')} checkoutTitle={localized('CHECKOUT')} />
);
