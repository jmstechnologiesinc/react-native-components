import React from 'react';

import { Button, MD3LightTheme, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const TabsItem = ({  
    title, 
    isSelected, 
    onPress, 
    style
}) => (
    <TouchableRipple        
        onPress={onPress}
        style={[{
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScale(16),
            ...(isSelected && {
                borderColor: MD3LightTheme.colors.primary,
                borderBottomWidth: moderateScale(2),
            }),
        }, style]}>
        <Text style={{textTransform: 'uppercase', color: isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant}} variant="labelLarge">{title}</Text>
    </TouchableRipple>
)

export default TabsItem;
