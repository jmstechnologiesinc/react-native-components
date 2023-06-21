import React from 'react';

import { View } from 'react-native';

import { isNumeric } from '@/commons';

import { IconButton, MD3LightTheme, Text } from '@/react-native-paper';
import { MATERIAL_ICONS } from '@/commons';

const QuantityButton = ({ value, minQuantity, maxQuantity, isDisabled, onPress }) => {
    let count = isNumeric(value) ? value : 0;
    const isDecreaseButtonDisabled = isDisabled || count === 0 || (isNumeric(minQuantity) && count <= minQuantity);
    const isIncreaseButtonDisabled =
        isDisabled || maxQuantity === 0 || (isNumeric(maxQuantity) && count >= maxQuantity);

    const onDecrease = () => {
        if (isDecreaseButtonDisabled) {
            return;
        }

        const results = count - 1;
        onPress(results);
    };

    const onIncrease = () => {
        if (isIncreaseButtonDisabled) {
            return;
        }

        const results = count + 1;
        onPress(results);
    };

    return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <IconButton
                disabled={isDecreaseButtonDisabled}
                mode="outlined"
                icon={MATERIAL_ICONS.decrease}
                onPress={onDecrease}
            />
            <Text
                style={{ ...(isDisabled ? { color: MD3LightTheme.colors.surfaceDisabled } : null) }}
                variant="headlineSmall"
            >
                {count}
            </Text>
            <IconButton
                disabled={isIncreaseButtonDisabled}
                mode="outlined"
                icon={MATERIAL_ICONS.increment}
                onPress={onIncrease}
            />
        </View>
    );
};

export default QuantityButton;
