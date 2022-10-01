import React from 'react';

import mockData from './mockData.json';
import Catalog from './Catalog';

export default {
    title: 'packages/Catalog',
};

export const Catalogs = ({ onPress }) => (
    <Catalog title="Catalog" data={mockData} onPress={() => {}} selectedIndex={1} />
);
