import React from 'react';

import { Button, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const TabsItem = ({ 
    title, 
    isSelected,
    onPress,
    mode='text'
}) => <Button 
    mode={mode}
    textColor={isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant}
    style={{
        borderRadius: 1,
        ...(isSelected && {
            borderColor: MD3LightTheme.colors.primary, 
            borderBottomWidth: 2
        })
    }}
    onPress={onPress}>
    {title}
</Button>

export default TabsItem;