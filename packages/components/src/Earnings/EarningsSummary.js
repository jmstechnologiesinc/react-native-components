import React from 'react';

import { StyleSheet, View } from 'react-native';

import { MD3LightTheme, Text } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

/**
 * The headline figure of the range. `total` arrives already formatted and localized by the
 * backend — the app never formats money it did not compute.
 */
const EarningsSummary = ({ total, caption }) => {
    if (!total?.formattedValue) {
        return null;
    }

    return (
        <View>
            <Text variant="labelLarge" style={styles.caption}>
                {caption || localized('earnings')}
            </Text>

            <Text variant="displaySmall">{total.formattedValue}</Text>
        </View>
    );
};

// No padding of its own: the host screen owns spacing through ScreenWrapper.Container and
// ScreenWrapper.Section, and a component that also pads itself double-pads inside one.
const styles = StyleSheet.create({
    caption: {
        color: MD3LightTheme.colors.onSurfaceVariant,
    },
});

export default EarningsSummary;
