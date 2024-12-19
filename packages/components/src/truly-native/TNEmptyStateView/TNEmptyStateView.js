import React from 'react';

import { View, StyleSheet, Image } from 'react-native';

import { Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { Text } from '@jmstechnologiesinc/react-native-paper';

const TNEmptyStateView = ({
    buttonMode = 'contained',
    titleVariant = 'headlineMedium',
    bodyVariant = 'bodyMedium',
    image,
    emptyStateConfig,
    style,
    textStyle,
    isLoading,
}) => (
    <View style={[styles.container, style]}>
        {image && <Image style={styles.image} source={image} />}

        <Text variant={titleVariant} style={[{ textAlign: 'center' }, textStyle]}>
            {emptyStateConfig.title}
        </Text>

        <Text variant={bodyVariant} style={[{ textAlign: 'center', marginTop: MD3LightTheme.spacing.x4 }, textStyle]}>
            {emptyStateConfig.description}
        </Text>

        {emptyStateConfig.buttonName && (
            <Button
                mode={buttonMode}
                style={{ marginTop: MD3LightTheme.spacing.x12 }}
                uppercase
                icon={emptyStateConfig.buttonIcon}
                loading={isLoading}
                onPress={emptyStateConfig.onPress}
            >
                {emptyStateConfig.buttonName}
            </Button>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: MD3LightTheme.spacing.x12,
    },
});

export default TNEmptyStateView;
