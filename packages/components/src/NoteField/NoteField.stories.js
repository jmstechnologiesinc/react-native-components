import React, { useState } from 'react';

import NoteField from './NoteField';

export default {
    title: 'packages/NoteField',
};

export const Required = () => {
    const [value, setValue] = useState('');
    return (
        <NoteField
            label="Note to the partner"
            value={value}
            onChangeText={setValue}
            required
            helper="The partner reads this note."
        />
    );
};

export const WithError = () => (
    <NoteField label="Reason" value="" onChangeText={() => {}} required error="A note is required" />
);
