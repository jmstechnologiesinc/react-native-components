import React, { useEffect, useRef } from 'react';

import { Animated, Easing, StyleSheet, View } from 'react-native';

import { MD3LightTheme, Surface, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Los tres puntitos de "está escribiendo".
 *
 * ⚠️ Anima SOLO translateY (transform), y se monta/desmonta según isTyping en vez de animar
 * su altura. La librería anima `height` con Reanimated, y animar layout dentro del árbol de
 * la lista es justo lo que rompe el ownership de Yoga en RN 0.85. Usamos el Animated del core
 * con useNativeDriver: ni siquiera toca el hilo de JS.
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
    // Misma forma y mismo color de contenedor que una burbuja recibida (ver Bubble.js).
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
