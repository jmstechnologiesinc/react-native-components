import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Button, FAB, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const isPrimaryButton = (buttonLength, index) => index === buttonLength - 1;

const ActionGroupButtons = ({ buttons, isLoading, style, onPress, compact, variant = 'button' }) => {
    if (!buttons.length) {
        return null;
    }

    return (
        <View style={[styles.row, { justifyContent: compact && 'flex-end' }, style]}>
            {buttons.map((button, index) => (
                <View key={button.key || index}>
                    {variant === 'fab' ? (
                        <FAB
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
                        />
                    ) : (
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
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
