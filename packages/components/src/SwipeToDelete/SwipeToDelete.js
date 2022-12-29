import React from 'react';

import { View } from 'react-native';

import RNSwipeable from 'react-native-gesture-handler/Swipeable';
import { MD3LightTheme, Text, TouchableRipple } from '@jmsstudiosinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

let row = [];
let prevOpenedRow;

const rightSwipeActions = (onClick) => {
    return (
        <TouchableRipple
            style={{
                backgroundColor: MD3LightTheme.colors.error,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}
            onPress={onClick}
        >
            <Text
                variant="labelLarge"
                style={{
                    color: MD3LightTheme.colors.onError,
                    paddingHorizontal: moderateScale(24),
                }}
            >
                Delete
            </Text>
        </TouchableRipple>
    );
};

const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
};

const Swipeable = ({ children, onSwipeableRightOpen, index, isRemoveable = true }) => (
    <RNSwipeable
        friction={2}
        leftThreshold={80}
        rightThreshold={41}
        renderRightActions={() => (isRemoveable ? rightSwipeActions(onSwipeableRightOpen) : null)}
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
    >
        <View style={{ backgroundColor: MD3LightTheme.colors.background, flex: 1 }}>{children}</View>
    </RNSwipeable>
);
export default Swipeable;
