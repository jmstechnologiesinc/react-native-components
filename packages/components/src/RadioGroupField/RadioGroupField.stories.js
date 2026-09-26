import React, { useState } from 'react';

import RadioGroupField from './RadioGroupField';

export default {
    title: 'packages/RadioGroupField',
};

const OPTIONS = [
    { value: 'standard', label: 'Standard' },
    { value: 'comfort', label: 'Comfort' },
    { value: 'xl', label: 'XL', disabled: true },
];

export const Choice = () => {
    const [value, setValue] = useState('standard');
    return <RadioGroupField label="Trip class" options={OPTIONS} value={value} onChange={setValue} />;
};

export const WithError = () => (
    <RadioGroupField label="Trip class" options={OPTIONS} onChange={() => {}} error="Choose a trip class" />
);
