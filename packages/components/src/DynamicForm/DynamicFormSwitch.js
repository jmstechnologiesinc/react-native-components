import React from 'react';

import { FIELD_TYPES } from '@jmsstudiosinc/commons';
import * as JMSList from '../List/List';

const DynamicFormSwitch = ({ form, onChange }) => {
    switch (form.type) {
        case FIELD_TYPES.radio:
            return (
                <JMSList.CheckRadio
                    title={form.title}
                    description={form.description}
                    isDisabled={form.isDisabled}
                    metadata={form.price}
                    isChecked={form.value}
                    onPress={onChange}
                />
            );
        case FIELD_TYPES.checkbox:
            return (
                <JMSList.CheckRadio
                    title={form.title}
                    description={form.description}
                    isDisabled={form.isDisabled}
                    metadata={form.price}
                    isChecked={form.value}
                    onPress={onChange}
                    variant="checkbox"
                />
            );
        default:
            return `Unsupported field type - ${form.type}`;
    }
};

export default DynamicFormSwitch;
