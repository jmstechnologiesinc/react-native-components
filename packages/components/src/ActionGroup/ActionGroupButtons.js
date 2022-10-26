import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Button, FAB, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const isPrimaryButton = (buttonLength, index) => (index === (buttonLength - 1));

const ActionGroupButtons = ({ 
    buttons,
    isLoading,
    style,
    onPress,
    compact,
    variant="button"
}) => {
    if(!buttons.length) {
        return null;
    }

    return (
        <View style={[styles.row, {justifyContent: compact && "flex-end"},  style]}>
            {buttons.map((button, index) => (
                <View style={{marginLeft: index > 0 && MD3LightTheme.margin, flex: !compact && 1}}>
                    {(variant === "fab") ? (
                        <FAB
                          variant={(button.variant || (isPrimaryButton(buttons.length, index) ? 'primary' : 'secondary'))}
                          label={button.title}
                          onPress={() => onPress?.(button)} />
                    ) : (
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            mode={(button.mode || (isPrimaryButton(buttons.length, index) ? 'contained' : 'outlined'))}
                            onPress={() => onPress?.(button)}>
                            {button.title}
                        </Button>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        flex: 1,
    }
  });

export default ActionGroupButtons;
