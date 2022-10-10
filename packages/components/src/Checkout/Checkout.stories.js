import React from 'react';

import Accounting from './Accounting';

import mockData from "./mockData.json"

export default {
  title: 'packages/Checkout',
};

export const Fees = () => <Accounting fees={mockData} />