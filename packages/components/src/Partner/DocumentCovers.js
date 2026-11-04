import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Modal, Portal, TouchableRipple, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { accessibilityProps, isWeb } from '../accessibility';
import DocumentViewer from '../DocumentViewer/DocumentViewer';
import SheetHeader from '../Layout/SheetHeader';
import { localized } from '../Localization/Localization';

/**
 * Two covers or more: a Material 3 hero carousel, one large item with the next one peeking, or all of them whole, side
 * by side, where the width fits them at Material's largest large item (twice as wide as the cover is tall, the
 * cover's height measured from the first one).
 *
 * The carousel's measures are Material's (material-components-android carousel): it snaps to an item, items stand
 * 8 dp apart, and the item that peeks is a small item of at most 56 dp (`m3_carousel_small_item_size_max`), here the
 * theme's `spacing.x2` and `spacing.x14`. The large item is what the measured width leaves. Paper has no carousel, so
 * a horizontal ScrollView snaps item by item: on iOS and Android by `snapToInterval`, which overrides `pagingEnabled`
 * there, and on the web by `pagingEnabled`, the one snapping prop react-native-web implements (CSS scroll snap). On
 * the web its scrollbar shows: a mouse has no swipe, and the scrollbar is its way to the next item. The item it rests
 * on is followed from the scroll position, so a new width (a rotation, a resized window) scrolls back to it.
 */
const CoverCarousel = ({ covers, renderCover, testID }) => {
    const { spacing } = useTheme();
    const [width, setWidth] = useState(0);
    const [coverHeight, setCoverHeight] = useState(0);
    const carouselRef = useRef(null);
    const restingItem = useRef(0);

    const gap = spacing.x2;
    // Until the carousel is measured its items are 0 wide; their height is the cover's, so nothing below moves.
    const itemWidth = Math.max(0, width - spacing.x14 - gap);
    const interval = itemWidth + gap;
    // An item rests where it starts, but the scroll view stops at its end, where the last item shows whole and the
    // one before it peeks.
    const lastOffset = Math.max(0, covers.length * interval - gap - width);
    const restOf = (index) => Math.min(index * interval, lastOffset);
    const itemAt = (offset) =>
        covers.reduce(
            (nearest, _cover, index) =>
                Math.abs(restOf(index) - offset) < Math.abs(restOf(nearest) - offset) ? index : nearest,
            0
        );

    const largeItemMax = 2 * coverHeight;
    const fitWhole = coverHeight > 0 && width >= covers.length * largeItemMax + (covers.length - 1) * gap;

    // `restOf` changes only with these two.
    useEffect(() => {
        carouselRef.current?.scrollTo({ x: restOf(restingItem.current), animated: false });
    }, [interval, lastOffset]);

    const measureCover = (event) => setCoverHeight(event.nativeEvent.layout.height);
    const coversAt = (coverWidth) =>
        covers.map((cover, index) =>
            renderCover(cover, index, {
                style: { width: coverWidth },
                onLayout: index === 0 ? measureCover : undefined,
            })
        );

    return (
        <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} testID={`${testID}-covers`}>
            {fitWhole ? (
                <View style={{ flexDirection: 'row', gap }}>{coversAt(largeItemMax)}</View>
            ) : (
                <ScrollView
                    ref={carouselRef}
                    horizontal
                    pagingEnabled
                    snapToInterval={interval}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    disableIntervalMomentum
                    showsHorizontalScrollIndicator={isWeb()}
                    onScroll={(event) => {
                        restingItem.current = itemAt(event.nativeEvent.contentOffset.x);
                    }}
                    // Every event (16 ms or less turns throttling off on the phone): the handler only notes an index.
                    // react-native-web, without it, reports only the first one.
                    scrollEventThrottle={16}
                    contentContainerStyle={{ gap }}
                    testID={`${testID}-carousel`}
                >
                    {coversAt(itemWidth)}
                </ScrollView>
            )}
        </View>
    );
};

/**
 * The photos of a document the partner has taken and not sent yet (DocumentRequirementCard `covers`), in order: one is
 * the card's cover; more are a carousel, or side by side where they fit (CoverCarousel). Each photo is an image button
 * a screen reader names by its `label`: it opens the library's DocumentViewer full screen, on that page, to check it
 * before sending (zoom, rotation, and the sides of a two-page document, named by their labels).
 *
 * @param {{covers: Array<{uri: string, label: string}>, testID: string}} props
 */
const DocumentCovers = ({ covers, testID }) => {
    const { colors } = useTheme();
    const window = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [viewing, setViewing] = useState(false);
    const [page, setPage] = useState(0);

    const open = (index) => {
        setPage(index);
        setViewing(true);
    };
    const close = () => setViewing(false);
    const shown = covers[page] ?? covers[0];
    const sides = covers.length > 1 ? covers.map(({ label }, index) => ({ value: String(index), label })) : undefined;

    // react-native-web gives `imagebutton` no web role; there an image that opens is a button named by its label.
    const renderCover = ({ uri, label }, index, props) => (
        <TouchableRipple
            key={String(index)}
            onPress={() => open(index)}
            {...accessibilityProps({ role: isWeb() ? 'button' : 'imagebutton', label })}
            {...props}
            testID={`${testID}-cover-${index}`}
        >
            <Card.Cover source={{ uri }} />
        </TouchableRipple>
    );

    return (
        <>
            {covers.length < 2 ? (
                covers.map((cover, index) => renderCover(cover, index))
            ) : (
                <CoverCarousel covers={covers} renderCover={renderCover} testID={testID} />
            )}
            <Portal>
                <Modal
                    visible={viewing}
                    onDismiss={close}
                    overlayAccessibilityLabel={localized('global.close')}
                    // Paper's Modal centres its content between the safe-area insets, on the phone inside a Pressable
                    // that cannot stretch: the viewer is given that whole height.
                    contentContainerStyle={{
                        height: window.height - insets.top - insets.bottom,
                        backgroundColor: colors.surface,
                    }}
                    testID={`${testID}-viewer`}
                >
                    <SheetHeader title={shown?.label} onClose={close} testID={`${testID}-viewer-header`} />
                    <DocumentViewer
                        source={shown ? { uri: shown.uri } : null}
                        sides={sides}
                        side={String(page)}
                        onSideChange={(value) => setPage(Number(value))}
                        testID={`${testID}-viewer-document`}
                    />
                </Modal>
            </Portal>
        </>
    );
};

export default DocumentCovers;
