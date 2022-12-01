import React from 'react';

import {View} from "react-native"

import { isNumeric } from '@jmsstudiosinc/commons';

import { IconButton,  Text } from '@jmsstudiosinc/react-native-paper';

const QuantityButton = ({
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

    return (
        <View style={{flex: 1,flexDirection: "row", justifyContent: "space-evenly", alignItems: 'center'}}>
            <IconButton mode="contained" icon="minus" onPress={onDecrease} />
            <Text variant="bodyLarge">{count}</Text>
            <IconButton mode="contained" icon="plus" onPress={onIncrease} />
        </View>
    )
}


export default QuantityButton;
