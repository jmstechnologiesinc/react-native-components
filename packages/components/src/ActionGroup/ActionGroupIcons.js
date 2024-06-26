import React from 'react';

import { View, StyleSheet } from 'react-native';

import { IconButton } from '@jmstechnologiesinc/react-native-paper';

const ActionGroupIcons = ({ icons, onPress }) => {
    if (!icons?.length) {
        return null;
    }

    return (
        <View style={[styles.row]}>
            {icons.map((icon, index) => (
                <IconButton
                    key={icon.key || index}
                    mode={icon.mode}
                    size={icon.size}
                    icon={icon.icon}
                    iconColor={icon.iconColor}
                    disabled={icon.isDisabled}
                    onPress={() => onPress?.(icon)}
                    style={{ ...(index === 0 && { marginLeft: 0 }) }}
                />
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

export default ActionGroupIcons;
