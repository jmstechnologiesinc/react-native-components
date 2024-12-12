import React from 'react';

import { Dimensions, View } from 'react-native';

import { Button, FAB, MD3LightTheme, } from '@jmstechnologiesinc/react-native-paper';
import { itemSeparator } from '../utils';

const isPrimaryButton = (buttonLength, index) => index === buttonLength - 1;

const isGreaterThan = (arr) => {
    return arr.some(item => {
        const numericValue = parseFloat(item.title.replace('Update ·', '').replace('$', '').trim().replace(',', ''));
        return numericValue >= 1000;
    });
}

const ActionGroupButtons = ({ buttons, isLoading, isStretched = false, style, onPress, variant = 'button' }) => {

    const { width } = Dimensions.get('window');

    if (!buttons.length) {
        return null;
    }

    const isGreaterText = width <= 600 && isGreaterThan(buttons) ? 1.2 : 1

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'flex-end', flex: isGreaterText }]}>
            {buttons.map((button, index) => {
                return (
                    <View
                        style={[
                            {
                                ...(isStretched ? { flex: 1 } : null),
                                marginRight: itemSeparator(index, buttons.length) ? MD3LightTheme.spacing.x2 : 0,
                            },
                            button.contentStyle,
                        ]}
                    >
                        {variant === 'fab' ? (
                            <FAB
                                loading={isLoading}
                                disabled={button.isDisabled}
                                variant={
                                    button.variant
                                        ? button.variant
                                        : isPrimaryButton(buttons.length, index)
                                            ? 'primary'
                                            : 'secondary'
                                }
                                label={button.title}
                                onPress={() => onPress?.(button)}
                                icon={button.icon}
                                style={style}
                            />
                        ) : (
                            <Button
                                compact={button.compact}
                                loading={isLoading}
                                textColor={button.textColor}
                                disabled={isLoading || button.isDisabled}
                                mode={
                                    button.mode
                                        ? button.mode
                                        : isPrimaryButton(buttons.length, index)
                                            ? 'contained'
                                            : 'outlined'
                                }
                                icon={button.icon}
                                onPress={() => onPress?.(button)}

                            >
                                {button.title}
                            </Button>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default ActionGroupButtons;
