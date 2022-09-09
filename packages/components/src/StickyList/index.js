import React, { useRef, useState } from 'react';

import {View, Animated, SectionList as NativeSectionList, SafeAreaView } from 'react-native';
const AnimatedSectionList = Animated.createAnimatedComponent(NativeSectionList);

import TabsList from './StickySectionTabsList';

import styles from './styles';

const StickyList = ({
    title,
    sections,
    ListHeaderComponent,
    onItemPress,
    ...props
}) => {
    const [currentIndex, setCurrentIdex] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;
    const blockUpdateIndexRef = useRef(false);
    const sectionListRef = useRef();

    const [layoutHeight, setLayoutHeight] = useState(0);
    const Max_Height = layoutHeight + 1;

    const coverTranslateY = scrollY.interpolate({
        inputRange: [-4, 0, 10],
        outputRange: [-2, 0, 3],
    });

    const coverScale = scrollY.interpolate({
        inputRange: [-200, 0],
        outputRange: [2, 1],
        extrapolateRight: 'clamp',
    });

    const tabBarOpacity = scrollY.interpolate({
        inputRange: [layoutHeight, Max_Height],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    const renderTab = () => (
        <TabsList
            title={title}
            sections={sections}
            currentIndex={currentIndex}
            onPress={(index) => {
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
    );

    return (
        <SafeAreaView style={styles.container}>
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
                        {typeof ListHeaderComponent === "function" ? 
                            ListHeaderComponent(coverTranslateY, coverScale, tabBarOpacity) : 
                            null
                        }
                        <View onLayout={(ev) => setLayoutHeight(ev.nativeEvent.layout.y)}>{renderTab()}</View>
                    </>
                } 
            />
            <View style={styles.containerAnaimeted}>
                <Animated.View
                    style={[
                        styles.animatedTab,
                        {
                            opacity: tabBarOpacity,
                        },
                    ]}
                >
                    {renderTab()}
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default StickyList;
