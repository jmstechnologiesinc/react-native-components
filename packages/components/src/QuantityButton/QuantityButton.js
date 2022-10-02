import React from 'react';

import { isNumeric } from '@jmsstudiosinc/commons';

import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';

const QuantityButton = ({
    title,
    value, 
    minQuantity, 
    maxQuantity, 
    onPress
}) => {
    let count = isNumeric(value) ? value : 0;

    const onDecrease = () => {
        if (count === 0 || (isNumeric(minQuantity) && count <= minQuantity)) {
            return;
        }

        const results = count - 1;
        onPress(results);
    };

    const onIncrease = () => {
        if (maxQuantity === 0 || (isNumeric(maxQuantity) && count >= maxQuantity)) {
            return;
        }

        const results = count + 1;
        onPress(results);
    };

    const handleOnPress = qt => {
        if(qt === "+") {
            onIncrease()
        } else if(qt === "-") {
            onDecrease()
        }
    }

    return <SegmentedButtonGroup
        title={title}
        density="small"
        data={[
            {label: " ", "value": "-", "icon": "minus-circle"}, 
            {"label": count, "value": undefined},  
            {label: " ", "value": "+", "icon": "plus-circle"}
        ]} 
        value={null}
        onPress={handleOnPress} />
}


export default QuantityButton;
