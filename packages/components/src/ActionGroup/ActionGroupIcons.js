import React from 'react';

import { View, StyleSheet } from 'react-native';

import { IconButton } from '@jmsstudiosinc/react-native-paper';

const ActionGroupIcons = ({ 
    icons,
    onPress
}) => {
    if(!icons) {
        return null;
    }

    return <View style={[styles.row]}>
        {icons.map((icon, index) => (
            <IconButton
                mode={icon.mode || "contained"}
                icon={icon.icon}
                disabled={icon.isDisabled}
                onPress={() => onPress?.(icon)}
                style={{...(index === 0 && {marginLeft: 0})}} />
        ))}
    </View>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        flex: 1,
    }
  });

export default ActionGroupIcons;
