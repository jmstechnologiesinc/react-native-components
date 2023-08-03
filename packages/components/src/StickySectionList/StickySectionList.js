import React, { useRef, useState } from 'react';
import { View, Animated, SectionList as NativeSectionList } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { itemSeparator } from '../utils';
import * as Tabs from '../Tabs/Tabs';

import sectionListGetItemLayout from './getItemLayout';
import { moderateScale } from 'react-native-size-matters';


const AnimatedSectionList = Animated.createAnimatedComponent(NativeSectionList);

const StickyList = ({
    title,
    sections,
    listHeaderComponent,
    onItemPress,
    onContentOffsetYScroll,
    contentOffsetY,
    ...props
}) => {
    const animatedValue = new Animated.Value(0);
    const scrollY = useRef(animatedValue).current;
    const blockUpdateIndexRef = useRef(false);
    const sectionListRef = useRef();
    const contentOffsetYRangeRef = useRef(false);

    const [currentIndex, setCurrentIdex] = useState(0);
    const [layoutHeight, setLayoutHeight] = useState(0);
    const maxHeight = layoutHeight + 1;

    const tabBarOpacity = scrollY.interpolate({
        inputRange: [layoutHeight, maxHeight],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    const renderTab = (
        <Tabs.Scrollable title={title} currentIndex={currentIndex}>
            {sections.map((item, index) => (
                <Tabs.Item
                    key={`sticky-section-${item.id}`}
                    title={item.title}
                    isSelected={currentIndex === index}
                    style={{ backgroundColor: itemSeparator(index, sections.length) ? MD3LightTheme.spacing.x4 : null }}
                    onPress={() => {
                        setCurrentIdex(index);
                        blockUpdateIndexRef.current = true;
                        const sectionList = sectionListRef.current;
                        if (sectionList && sectionList.scrollToLocation) {
                            sectionList.scrollToLocation({
                                animated: true,
                                itemIndex: 0,
                                viewOffset: 0,
                                sectionIndex: index,
                            });
                        }
                    }}
                />
            ))}
        </Tabs.Scrollable>
    );

     const getItemLayout = sectionListGetItemLayout({
        getSectionHeaderHeight: () => moderateScale(50),
        getSectionFooterHeight: () => 0,
        listHeaderHeight: layoutHeight,
    });

    return (
        <>
            <AnimatedSectionList
                {...props}
                ref={(ref) => (sectionListRef.current = ref)}
                scrollEventThrottle={16}
                stickySectionHeadersEnabled={false}
                sections={sections}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                    listener: onContentOffsetYScroll
                        ? (event) => {
                              if (
                                  event.nativeEvent.contentOffset.y > contentOffsetY &&
                                  contentOffsetYRangeRef.current === false
                              ) {
                                  onContentOffsetYScroll(event.nativeEvent.contentOffset.y);
                                  contentOffsetYRangeRef.current = true;
                              } else if (
                                  event.nativeEvent.contentOffset.y < contentOffsetY &&
                                  contentOffsetYRangeRef.current === true
                              ) {
                                  onContentOffsetYScroll(event.nativeEvent.contentOffset.y);
                                  contentOffsetYRangeRef.current = false;
                              }
                          }
                        : null,
                })}
                onMomentumScrollEnd={() => (blockUpdateIndexRef.current = false)}
                showsVerticalScrollIndicator={true}
                onViewableItemsChanged={({ viewableItems }) => {
                    if (!blockUpdateIndexRef.current && viewableItems[0]) {
                        const { index } = viewableItems[0].section;
                        if (currentIndex !== index) {
                            setCurrentIdex(index);
                        }
                    }
                }}
                viewabilityConfig={{
                    minimumViewTime: 10,
                    itemVisiblePercentThreshold: 10,
                }}
                ListHeaderComponent={
                    <>
                        {listHeaderComponent}
                        <View onLayout={(ev) => setLayoutHeight(ev.nativeEvent.layout.y)}></View>
                    </>
                }
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: tabBarOpacity,
                }}
            >
                {renderTab}
            </Animated.View>
        </>
    );
};

export default StickyList;
