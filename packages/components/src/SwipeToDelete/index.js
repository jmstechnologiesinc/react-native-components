import React from 'react';

import { Animated } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@jmsstudiosinc/react-native-paper';

import styles from './styles';

const SwipeToDelete = ({ children, onDelete }) => {
    const renderRightActions = () => {
        return (
            <Button onPress={onDelete}>
                <Animated.View style={[styles.deleteBox]}>
                    <MaterialCommunityIcons name="trash-can-outline" color={'white'} size={30} />
                </Animated.View>
            </Button>
        );
    };

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

export default SwipeToDelete;
