import React from 'react';

import { Button, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const TabsItem = ({ title, isSelected, onPress }) => (
    <Button
        compact
        textColor={isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant}
        style={{
            borderRadius: moderateScale(1),
            ...(isSelected && {
                borderColor: MD3LightTheme.colors.primary,
                borderBottomWidth: moderateScale(2),
            }),
        }}
        onPress={onPress}
    >
        {title}
    </Button>
);

export default TabsItem;
