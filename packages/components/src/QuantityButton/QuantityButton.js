import React from 'react';

import {View} from "react-native"

import { isNumeric } from '@jmsstudiosinc/commons';

import { IconButton,  MD3Colors,  MD3LightTheme,  Text } from '@jmsstudiosinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmsstudiosinc/commons';

const QuantityButton = ({
    value, 
    minQuantity, 
    maxQuantity, 
    isDisabled,
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
            <IconButton disabled={isDisabled} mode="outlined" icon={MATERIAL_ICONS.decrease} onPress={onDecrease} />
            <Text style={{...(isDisabled ? {color: MD3LightTheme.colors.surfaceDisabled} : null)}} variant="headlineSmall">{count}</Text>
            <IconButton disabled={isDisabled} mode="outlined" icon={MATERIAL_ICONS.increment} onPress={onIncrease} />
        </View>
    )
}


export default QuantityButton;
