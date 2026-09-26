import React, { useState } from 'react';

import FilterChips from './FilterChips';

export default {
    title: 'packages/FilterChips',
};

const OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
];

export const SingleChoice = () => {
    const [value, setValue] = useState('all');
    return <FilterChips options={OPTIONS} value={value} onChange={setValue} accessibilityLabel="Status" />;
};
