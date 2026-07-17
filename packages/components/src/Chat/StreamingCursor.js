import React, { useEffect, useRef } from 'react';

import { Animated, StyleSheet } from 'react-native';

/**
 * The blinking cursor that follows the text while it streams in (message.streaming).
 * Animates only opacity, with core Animated and useNativeDriver — never layout. See the
 * INVARIANTS in MessageList.js.
 */
const StreamingCursor = ({ color }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.1, duration: 500, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return <Animated.View style={[styles.cursor, { backgroundColor: color, opacity }]} />;
};

const styles = StyleSheet.create({
    cursor: {
        width: 2,
        height: 16,
        borderRadius: 1,
        marginLeft: 2,
        alignSelf: 'flex-end',
    },
});

export default StreamingCursor;
