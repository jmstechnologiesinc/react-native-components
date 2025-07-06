import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { MIDDLE_SNAP_POINT } from '../GorhomBottomSheetWrapper/AnimatedBottomSheet';
import { IconButton } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const SPACE = moderateScale(8);

const AnimatedCrosshairsGpsIcon = ({ animatedIndex, animatedPosition, onPress }) => {
    const [height, setHeight] = useState(0);

    const { height: screenHeight } = useSafeAreaFrame();

    const handleOnLayout = useCallback((event) => {
        const { height: layoutHeight } = event.nativeEvent.layout;
        setHeight(layoutHeight);
    }, []);

    const containerAnimatedStyle = useAnimatedStyle(() => {
        const belowMiddlePosition = screenHeight - animatedPosition.value < MIDDLE_SNAP_POINT;
        return {
            opacity: interpolate(animatedIndex.value, [1, 1.125], [1, 0], Extrapolation.CLAMP),
            transform: [
                {
                    translateY: belowMiddlePosition
                        ? animatedPosition.value - height - SPACE
                        : screenHeight - MIDDLE_SNAP_POINT - height - SPACE,
                },
            ],
        };
    }, [animatedIndex, animatedPosition, height, screenHeight]);

    const containerStyle = useMemo(() => [styles.container, {}, containerAnimatedStyle], [containerAnimatedStyle]);

    return (
        <Animated.View onLayout={handleOnLayout} style={containerStyle}>
            <IconButton icon="crosshairs-gps" mode="contained" onPress={onPress} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
});

export default AnimatedCrosshairsGpsIcon;
