import React from 'react';

import { Button, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { StyleSheet, Platform } from 'react-native';

const TabsItem = ({ index, title, subTitle, isSelected, onPress, fontAwesomeIcon, variant = 'text' }) => {
    if (variant === 'text') {
        return (
            <Button
                mode={variant}
                compact
                textColor={isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant}
                style={{
                    borderRadius: 1,
                    ...(isSelected && {
                        borderColor: MD3LightTheme.colors.primary,
                        borderBottomWidth: 2,
                    }),
                }}
                onPress={onPress}
            >
                {title}
            </Button>
        );
    } else if (variant === 'toggle') {
        return (
            <Button
                {...(!isSelected && { textColor: MD3LightTheme.colors.onSurfaceVariant })}
                subTitle={subTitle}
                compact
                mode={isSelected ? 'contained' : 'outlined'}
                style={[
                    styles.button,
                    index === 0 ? styles.first : index === 2 - 1 ? styles.last : styles.middle,
                    { borderRadius: '0' },
                    isSelected ? styles.border : {},
                ]}
                onPress={onPress}
            >
                {title}
            </Button>
        );
    } else if (variant === 'iconTop') {
        return (
            <Button
                {...(!isSelected && { textColor: MD3LightTheme.colors.onSurfaceVariant })}
                onPress={onPress}
                style={styles.iconButtonTop}
                contentStyle={{ flexDirection: 'column' }}
                icon={fontAwesomeIcon}
            >
                {title}
            </Button>
        );
    }
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
    },
    iconButtonTop: {
        flex: Platform.OS === 'web' ? 1 : null,
    },

    first: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },

    middle: {
        borderRadius: 0,
        borderLeftWidth: 0,
    },
    last: {
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    border: {
        borderColor: MD3LightTheme.colors.primary,
        borderWidth: StyleSheet.hairlineWidth,
    },
});

export default TabsItem;
