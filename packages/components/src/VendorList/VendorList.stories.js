import React from 'react';

import fullFilteredVendors from './mockData.json';

import VendorList from './VendorList';

export default {
    title: 'packages/VendorList',
};

export const VendorLists = () => <VendorList sections={[{ data: fullFilteredVendors }]} onPress={() => {}} />;
