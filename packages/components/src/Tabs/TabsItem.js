import React from 'react';

import { Button, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { FontAwesomeIndustryIcon } from './FontAwesomeIndustryIcon';

const TabsItem = ({ item, title, isSelected, onPress, icon, mode = 'text' }) => {
    return (
        <Button
            mode={mode}
            icon={icon}
            textColor={isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant}
            style={{
                borderRadius: 1,
                ...(isSelected && {
                    borderColor: item ? null : MD3LightTheme.colors.primary,
                    borderBottomWidth: item ? 0 : 2,
                }),
            }}
            contentStyle={
                item
                    ? { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
                    : { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
            }
            onPress={onPress}
            FontAwesomeIndustryIcon={() => FontAwesomeIndustryIcon(item, isSelected)}
        >
            {title}
        </Button>
    );
};

export default TabsItem;
