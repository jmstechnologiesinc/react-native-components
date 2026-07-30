import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';

import { MD3LightTheme, Divider } from '@jmstechnologiesinc/react-native-paper';

import { itemSeparator } from '../utils';
import * as Tabs from '../Tabs/Tabs';

// This used to be a SectionList driven by getItemLayout, but rows wrap to a
// variable number of lines so every height was an estimate: tapping a tab landed
// in the wrong section and the wrong render window left blank areas on screen.
// Here each section reports its real position through onLayout, so a tab press
// scrolls to a measured offset instead of a guessed one. The trade-off is that
// the whole catalog renders at once, which is fine for a menu-sized list.

// While a tab press is travelling to its target we ignore the offsets it passes
// through, otherwise the sections crossed on the way would each move the
// selected tab and the tab strip would animate several times per press. The
// release is driven by the position itself; the timeout is only a safety net for
// a target the list cannot reach, such as the last section.
const SCROLL_SETTLED_THRESHOLD = 2;
const TAB_SCROLL_TIMEOUT = 1500;

// How close to the top edge a section header has to be to count as the current
// one. It has to stay above SCROLL_SETTLED_THRESHOLD: Android rounds the target
// of a programmatic scroll to whole pixels and lands a little short, so a
// tolerance below the one that accepts the arrival would read that landing as
// "the section has not reached the top yet" and select the previous tab.
const SECTION_SELECTION_TOLERANCE = SCROLL_SETTLED_THRESHOLD + 2;

const StickyList = ({
    title,
    sections,
    listHeaderComponent,
    renderItem,
    renderSectionHeader,
    renderSectionFooter,
    ItemSeparatorComponent,
    keyExtractor,
    onItemPress,
    onContentOffsetYScroll,
    contentOffsetY,
    ...props
}) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef();
    const sectionOffsetsRef = useRef([]);
    const tabBarHeightRef = useRef(0);
    const blockUpdateIndexRef = useRef(false);
    const blockTimeoutRef = useRef(null);
    const pendingScrollRef = useRef(null);
    const contentOffsetYRangeRef = useRef(false);

    const [currentIndex, setCurrentIdex] = useState(0);
    const [layoutHeight, setLayoutHeight] = useState(0);
    const maxHeight = layoutHeight + 1;

    const tabBarOpacity = scrollY.interpolate({
        inputRange: [layoutHeight, maxHeight],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // onLayout only fires again for nodes whose layout actually changed, so
    // wiping the offsets here would leave a section that happened to keep its
    // position with no measurement at all. Positions that did not move are still
    // valid, so we only drop the tail when the catalog got shorter.
    useEffect(() => {
        sectionOffsetsRef.current.length = sections.length;
        setCurrentIdex(0);
    }, [sections]);

    useEffect(
        () => () => {
            if (blockTimeoutRef.current) {
                clearTimeout(blockTimeoutRef.current);
            }
        },
        []
    );

    // The tab bar floats over the top of the list, so a section scrolled to its
    // own offset would sit underneath it
    const getScrollTargetY = (sectionIndex) => {
        const offset = sectionOffsetsRef.current[sectionIndex];

        return offset === undefined ? undefined : Math.max(0, offset - tabBarHeightRef.current);
    };

    const updateCurrentIndex = (offsetY) => {
        if (blockUpdateIndexRef.current) {
            return;
        }

        const offsets = sectionOffsetsRef.current;
        const probe = offsetY + tabBarHeightRef.current + SECTION_SELECTION_TOLERANCE;

        let index = 0;

        for (let i = 0; i < offsets.length; i += 1) {
            if (offsets[i] !== undefined && offsets[i] <= probe) {
                index = i;
            }
        }

        setCurrentIdex((previousIndex) => (previousIndex === index ? previousIndex : index));
    };

    const releaseIndexUpdates = () => {
        if (blockTimeoutRef.current) {
            clearTimeout(blockTimeoutRef.current);
            blockTimeoutRef.current = null;
        }

        pendingScrollRef.current = null;
        blockUpdateIndexRef.current = false;
    };

    const onPressTab = (index) => {
        const targetY = getScrollTargetY(index);

        setCurrentIdex(index);

        if (targetY === undefined || !scrollViewRef.current) {
            return;
        }

        releaseIndexUpdates();

        pendingScrollRef.current = targetY;
        blockUpdateIndexRef.current = true;
        blockTimeoutRef.current = setTimeout(releaseIndexUpdates, TAB_SCROLL_TIMEOUT);

        scrollViewRef.current.scrollTo({ y: targetY, animated: true });
    };

    const renderTab = (
        <>
            <Tabs.Scrollable title={title} currentIndex={currentIndex}>
                {sections.map((item, index) => (
                    <Tabs.Item
                        key={`sticky-section-${item.id}`}
                        title={item.title}
                        isSelected={currentIndex === index}
                        style={{
                            backgroundColor: itemSeparator(index, sections.length) ? MD3LightTheme.spacing.x4 : null,
                        }}
                        onPress={() => onPressTab(index)}
                    />
                ))}
            </Tabs.Scrollable>
            <Divider />
        </>
    );

    return (
        <>
            <Animated.ScrollView
                {...props}
                ref={scrollViewRef}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                    listener: (event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        const pendingY = pendingScrollRef.current;

                        // The tab press arrived where it was going, hand tracking
                        // back. The pressed tab is already the selected one, so
                        // this position does not need to be read again.
                        if (pendingY !== null && Math.abs(offsetY - pendingY) <= SCROLL_SETTLED_THRESHOLD) {
                            releaseIndexUpdates();
                        } else {
                            updateCurrentIndex(offsetY);
                        }

                        if (!onContentOffsetYScroll) {
                            return;
                        }

                        if (offsetY > contentOffsetY && contentOffsetYRangeRef.current === false) {
                            onContentOffsetYScroll(offsetY);
                            contentOffsetYRangeRef.current = true;
                        } else if (offsetY < contentOffsetY && contentOffsetYRangeRef.current === true) {
                            onContentOffsetYScroll(offsetY);
                            contentOffsetYRangeRef.current = false;
                        }
                    },
                })}
                onScrollBeginDrag={releaseIndexUpdates}
                onMomentumScrollEnd={() => {
                    // A tab press releases on arrival, not here: Android reports
                    // momentum for programmatic scrolls before they finish
                    if (pendingScrollRef.current === null) {
                        releaseIndexUpdates();
                    }
                }}
            >
                {listHeaderComponent}
                <View onLayout={(ev) => setLayoutHeight(ev.nativeEvent.layout.y)}></View>

                {sections.map((section, sectionIndex) => (
                    <View
                        key={`sticky-section-content-${section.id ?? sectionIndex}`}
                        onLayout={(ev) => {
                            sectionOffsetsRef.current[sectionIndex] = ev.nativeEvent.layout.y;
                        }}
                    >
                        {renderSectionHeader ? renderSectionHeader({ section }) : null}

                        {(section.data || []).map((item, index) => (
                            <React.Fragment
                                key={keyExtractor ? keyExtractor(item, index) : `${sectionIndex}-${index}`}
                            >
                                {index > 0 && ItemSeparatorComponent ? <ItemSeparatorComponent /> : null}
                                {renderItem({ item, index, section })}
                            </React.Fragment>
                        ))}

                        {renderSectionFooter ? renderSectionFooter({ section }) : null}
                    </View>
                ))}
            </Animated.ScrollView>

            <Animated.View
                collapsable={false}
                onLayout={(ev) => (tabBarHeightRef.current = ev.nativeEvent.layout.height)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    // Android needs the overlay to form its own stacking context or
                    // it can end up behind the list for hit testing
                    zIndex: 1,
                    opacity: tabBarOpacity,
                }}
            >
                {renderTab}
            </Animated.View>
        </>
    );
};

export default StickyList;
