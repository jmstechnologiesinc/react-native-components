import React, { useRef, useState } from 'react';

import { View, Animated, SectionList as NativeSectionList } from 'react-native';

import * as Tabs from '../Tabs/Tabs';

const AnimatedSectionList = Animated.createAnimatedComponent(NativeSectionList);

const StickyList = ({ title, sections, listHeaderComponent, onItemPress, ...props }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const blockUpdateIndexRef = useRef(false);
    const sectionListRef = useRef();

    const [currentIndex, setCurrentIdex] = useState(0);
    const [layoutHeight, setLayoutHeight] = useState(0);
    const Max_Height = layoutHeight + 1;

    const tabBarOpacity = scrollY.interpolate({
        inputRange: [layoutHeight, Max_Height],
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
                        <View onLayout={(ev) => setLayoutHeight(ev.nativeEvent.layout.y)}>{renderTab}</View>
                    </>
                }
            />
            <Animated.View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: tabBarOpacity}}>
                    {renderTab}
            </Animated.View>
        </>
    );
};

export default StickyList;
