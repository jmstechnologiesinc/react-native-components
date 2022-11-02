import React from 'react';

import { Animated, StyleSheet } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@jmsstudiosinc/react-native-paper';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const SwipeToDelete = ({ children, onDelete }) => {
    const renderRightActions = () => (
        <Button onPress={onDelete}>
            <Animated.View style={[styles.deleteBox]}>
                <MaterialCommunityIcons
                    name="trash-can-outline"
                    color={MD3LightTheme.colors.background}
                    size={MD3LightTheme.spacing.x6}
                />
            </Animated.View>
        </Button>
    );

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
            friction={2}
            leftThreshold={30}
            rightThreshold={40}
        >
            {children}
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    deleteBox: {
        flex: 1,
        backgroundColor: MD3LightTheme.colors.error,
        justifyContent: 'center',
        width: moderateScale(90),
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default SwipeToDelete;
