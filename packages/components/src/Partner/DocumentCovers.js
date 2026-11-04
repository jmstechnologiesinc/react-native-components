import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * The photos of a document the partner has taken and not sent yet (DocumentRequirementCard `covers`), in order: one is
 * the card's cover; more are a Material 3 hero carousel, one large item with the next one peeking. Its measures are
 * Material's (material-components-android carousel): it snaps to an item, items stand 8 dp apart, and the item that
 * peeks is a small item of at most 56 dp (`m3_carousel_small_item_size_max`), here the theme's `spacing.x2` and
 * `spacing.x14`. The large item is what the measured width leaves.
 *
 * Paper has no carousel, so a horizontal ScrollView snaps item by item: on iOS and Android by `snapToInterval`, which
 * overrides `pagingEnabled` there, and on the web by `pagingEnabled`, the one snapping prop react-native-web
 * implements (CSS scroll snap). Each photo is an image a screen reader names by its `label`.
 *
 * @param {{covers: Array<{uri: string, label: string}>, testID: string}} props
 */
const DocumentCovers = ({ covers, testID }) => {
    const { spacing } = useTheme();
    const [width, setWidth] = useState(0);

    const coverOf = ({ uri, label }, index, style) => (
        <View
            key={String(index)}
            accessible
            accessibilityRole="image"
            accessibilityLabel={label}
            style={style}
            testID={`${testID}-cover-${index}`}
        >
            <Card.Cover source={{ uri }} />
        </View>
    );

    if (covers.length < 2) return covers.map((cover, index) => coverOf(cover, index));

    const gap = spacing.x2;
    // Until the carousel is measured its items are 0 wide; their height is the cover's, so nothing below moves.
    const itemWidth = Math.max(0, width - spacing.x14 - gap);
    return (
        <ScrollView
            horizontal
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
            pagingEnabled
            snapToInterval={itemWidth + gap}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap }}
            testID={`${testID}-covers`}
        >
            {covers.map((cover, index) => coverOf(cover, index, { width: itemWidth }))}
        </ScrollView>
    );
};

export default DocumentCovers;
