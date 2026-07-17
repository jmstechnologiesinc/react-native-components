import React, { useEffect, useRef } from 'react';

import { Animated, Easing, StyleSheet, View } from 'react-native';

import { MD3LightTheme, Surface, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * The three "is typing" dots.
 *
 * ⚠️ Animates ONLY translateY (transform), and mounts/unmounts on isTyping instead of
 * animating its height. The library animates `height` with Reanimated, and animating layout
 * inside the list tree is exactly what breaks Yoga's ownership on RN 0.85. Core Animated with
 * useNativeDriver does not even touch the JS thread.
 *
 * The bubble mirrors a received message's container shape and color (see Bubble.js).
 */
const Dot = ({ delay }) => {
    const theme = useTheme();
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(translateY, {
                    toValue: -4,
                    duration: 250,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [delay, translateY]);

    return (
        <Animated.View
            style={[styles.dot, { backgroundColor: theme.colors.onSurfaceVariant, transform: [{ translateY }] }]}
        />
    );
};

const TypingIndicator = ({ isTyping }) => {
    const theme = useTheme();

    if (!isTyping) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Surface elevation={1} style={[styles.bubble, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Dot delay={0} />
                <Dot delay={100} />
                <Dot delay={200} />
            </Surface>
        </View>
    );
};

const { spacing, roundness } = MD3LightTheme;
const DOT_SIZE = 6;

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginVertical: spacing.x1,
    },
    bubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.x1,
        paddingHorizontal: spacing.x3,
        paddingVertical: spacing.x2,
        borderRadius: roundness * 4,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
    },
});

export default TypingIndicator;
