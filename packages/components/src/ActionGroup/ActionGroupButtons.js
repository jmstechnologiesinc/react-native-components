import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Button, FAB, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const isPrimaryButton = (buttonLength, index) => index === buttonLength - 1;

const ActionGroupButtons = ({ 
    buttons, 
    isLoading, 
    isDisabled,
    style, 
    onPress, 
    compact, 
    variant = 'button' 
}) => {
    if (!buttons.length) {
        return null;
    }

    return (
        <View style={[styles.row, { justifyContent: compact && 'flex-end' }, style]}>
            {buttons.map((button, index) => (
                <View
                    style={[{alignItems: 'stretch',  marginLeft: index > 0 && MD3LightTheme.margin, flex: !compact && 1 }, button.contentStyle]}
                    key={button.key || index} >
                    {variant === 'fab' ? (
                        <FAB
                         loading={isLoading}
                         disabled={button.isDisabled}
                          variant={(button.variant ? button.variant : (isPrimaryButton(buttons.length, index) ? 'primary' : 'secondary'))}
                          label={button.title}
                          onPress={() => onPress?.(button)} 
                          icon={button.icon} />
                    ) : (
                        <Button
                            compact={button.compact}
                            loading={isLoading}
                            textColor={button.textColor}
                            disabled={isLoading || button.isDisabled}
                            mode={(button.mode ? button.mode : (isPrimaryButton(buttons.length, index) ? 'contained' : 'outlined'))}
                            icon={button.icon}
                            onPress={() => onPress?.(button)}>
                            {button.title}
                        </Button>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1,
    },
});

export default ActionGroupButtons;
