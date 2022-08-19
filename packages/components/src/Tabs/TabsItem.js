import React from 'react';

import { Button, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const TabsItem = ({ 
    title, 
    isSelected,
    onPress
}) => <Button 
    mode={"outlined"}
    textColor={isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurface}
    style={{
        borderRadius: '0', 
        borderLeftWidth: "0", 
        borderRightWidth: "0", 
        borderTopWidth: "0",
        ...(!isSelected && {borderBottomColor: "transparent"}),
        ...(isSelected && {
            borderColor: MD3LightTheme.colors.primary, 
            borderBottomWidth: 2
        })
    }}
    onPress={onPress}>
    {title}
</Button>

export default TabsItem;