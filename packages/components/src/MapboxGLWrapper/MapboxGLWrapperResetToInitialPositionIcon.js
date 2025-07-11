import React from 'react';
import { View } from 'react-native';

import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { IconButton } from '@jmstechnologiesinc/react-native-paper';

const MapboxGLWrapperResetToInitialPositionIcon = ({ altitude, onPress }) => {
    return (
        <View
            style={{
                position: 'absolute',
                bottom: altitude,
                right: 0,
            }}
        >
            <IconButton icon="crosshairs-gps" size={moderateScale(24)} mode="contained" onPress={onPress} />
        </View>
    );
};

export default MapboxGLWrapperResetToInitialPositionIcon;
