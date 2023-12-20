import React from 'react';

import {  MD3LightTheme, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const TabsItem = ({ title, isSelected, onPress, style }) => (
    <TouchableRipple
        onPress={onPress}
        style={[
            {
                paddingHorizontal: MD3LightTheme.spacing.x4,
                paddingVertical: MD3LightTheme.spacing.x4,
                ...(isSelected && {
                    borderColor: MD3LightTheme.colors.primary,
                    borderBottomWidth: moderateScale(2),
                }),
            },
            style,
        ]}
    >
        <Text
            style={{
                color: isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant,
            }}
            variant="labelLarge"
        >
            {title}
        </Text>
    </TouchableRipple>
);

export default TabsItem;
