import React from 'react';

import { FIELD_TYPES } from '@jmstechnologiesinc/commons';
import * as JMSList from '../List/List';

const DynamicFormSwitch = ({ 
    type,
    title, 
    description,
    metaTitle,
    isDisabled,
    isChecked,
    onPress,
    titleNumberOfLines,
    descriptionNumberOfLines,
}) => {
    switch (type) {
        case FIELD_TYPES.radio:
        case FIELD_TYPES.checkbox:
            return (
                <JMSList.CheckRadio
                    title={title}
                    description={description}
                    isDisabled={isDisabled}
                    metaTitle={metaTitle}
                    isChecked={isChecked}
                    titleNumberOfLines={titleNumberOfLines}
                    descriptionNumberOfLines={descriptionNumberOfLines}
                    onPress={onPress}
                    variant={type}
                />
            );
        default:
            return `Unsupported field type - ${type}`;
    }
};

export default DynamicFormSwitch;
