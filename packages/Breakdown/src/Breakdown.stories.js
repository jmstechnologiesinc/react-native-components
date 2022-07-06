import React from 'react';

import Breakdown from './Breakdown';

import mockData from "./mockData.json"

export default {
  title: 'packages/Breakdown',
};

export const Basic = () => <Breakdown fees={mockData} />