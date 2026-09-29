import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

/**
 * Where the person is (WAI-ARIA breadcrumb): the path from the section to the current page, as a `navigation`
 * landmark named «Breadcrumb» holding an ordered list; every ancestor is a text button (MD3's link affordance)
 * and the last item is the current page, announced `aria-current="page"` and not pressable. Placed before the
 * main content, in the top app bar. `items` are `{label, onPress?}`; an item without `onPress` is plain text.
 *
 * @param {{items: Array<{label: string, onPress?: () => void, testID?: string}>, accessibilityLabel?: string,
 *     style?: any, testID?: string}} props `accessibilityLabel` defaults to `global.breadcrumb`
 */
const Breadcrumbs = ({ items, accessibilityLabel, style, testID = 'breadcrumbs' }) => {
    const { colors, spacing } = useTheme();
    const last = items.length - 1;
    return (
        <View role="navigation" aria-label={accessibilityLabel ?? localized('global.breadcrumb')} testID={testID}>
            <View role="list" style={[styles.list, style]}>
                {items.map((item, index) => {
                    const current = index === last;
                    return (
                        <View key={`${index}:${item.label}`} role="listitem" style={styles.item}>
                            {index > 0 ? (
                                <Text
                                    variant="titleMedium"
                                    aria-hidden
                                    style={[styles.separator, { color: colors.onSurfaceVariant }]}
                                >
                                    ›
                                </Text>
                            ) : null}
                            {item.onPress && !current ? (
                                <Button
                                    mode="text"
                                    compact
                                    onPress={item.onPress}
                                    labelStyle={styles.link}
                                    style={{ marginHorizontal: -spacing.x1 }}
                                    testID={item.testID}
                                >
                                    {item.label}
                                </Button>
                            ) : (
                                <Text
                                    variant="titleMedium"
                                    numberOfLines={1}
                                    aria-current={current ? 'page' : undefined}
                                    style={current ? { color: colors.onSurface } : { color: colors.onSurfaceVariant }}
                                    testID={item.testID}
                                >
                                    {item.label}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        marginHorizontal: 6,
    },
    link: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default Breadcrumbs;
