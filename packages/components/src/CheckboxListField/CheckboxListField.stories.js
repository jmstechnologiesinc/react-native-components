import React, { useState } from 'react';

import CheckboxListField from './CheckboxListField';

export default {
    title: 'packages/CheckboxListField',
};

const OPTIONS = [
    { value: 'photo', label: 'The photo is not readable' },
    { value: 'expiry', label: 'The expiry date has passed' },
    { value: 'name', label: 'The name does not match' },
];

export const Choices = () => {
    const [values, setValues] = useState(['expiry']);
    return <CheckboxListField label="What is wrong" options={OPTIONS} values={values} onChange={setValues} />;
};

export const ReadOnly = () => (
    <CheckboxListField label="Cited items" options={OPTIONS} values={['photo', 'name']} onChange={() => {}} disabled />
);
