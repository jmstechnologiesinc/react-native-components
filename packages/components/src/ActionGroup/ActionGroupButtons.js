import React from 'react';

import { View } from 'react-native';

import { Button, FAB, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { itemSeparator } from '../utils';

const isPrimaryButton = (buttonLength, index) => index === buttonLength - 1;

const ActionGroupButtons = ({ 
    buttons, 
    isLoading, 
    isStretched = false,
    style, 
    onPress, 
    variant = 'button' 
}) => {
    if (!buttons.length) {
        return null;
    }

    return (
        <View style={[{flexDirection: 'row', justifyContent: "flex-end", flex: 1}]}>
            {buttons.map((button, index) => {
                return (
                    <View 
                        style={[{
                            ...(isStretched ? {flex: 1} : null),
                            marginRight: itemSeparator(index, buttons.length) ? MD3LightTheme.spacing.x2 : 0
                        },
                        button.contentStyle]}>
                    {variant === 'fab' ? (
                            <FAB
                             loading={isLoading}
                             disabled={button.isDisabled}
                              variant={(button.variant ? button.variant : (isPrimaryButton(buttons.length, index) ? 'primary' : 'secondary'))}
                              label={button.title}
                              onPress={() => onPress?.(button)} 
                              icon={button.icon}
                              style={style} />
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
                )
            })}
        </View>
    );
};

export default ActionGroupButtons;
