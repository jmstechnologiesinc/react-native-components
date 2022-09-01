import React from 'react';

import { View, ScrollView } from 'react-native';
import { FontAwesomeIndustryIcon } from './FontAwesomeIndustryIcon';
import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import TabsItem from './TabsItem';
import TabList from './TabsList';

const TabsScrollable = React.forwardRef(
    ({ data, selectedIndex, onPress, onTabsContainerLayout, onTabsItemLayout }, ref) => (
        <ScrollView ref={ref} showsHorizontalScrollIndicator={false} horizontal>
            <View onLayout={onTabsContainerLayout}>
                <TabList>
                    {data.map((item, index) => {
                        if (item.title) {
                            return (
                                <View onLayout={onTabsItemLayout(index)}>
                                    <TabsItem
                                        title={item.title}
                                        isSelected={selectedIndex === index}
                                        onPress={() => onPress(index)}
                                        icon="home"
                                    />
                                </View>
                            );
                        } else {
                            return (
                                <View onLayout={onTabsItemLayout(index)}>
                                    <TabsItem
                                        title={VENDOR_INDUSTRIES_MAPPING[item].title}
                                        isSelected={index === 1}
                                        onPress={() => onPress(index)}
                                        item={item}
                                    />
                                </View>
                            );
                        }
                    })}
                </TabList>
            </View>
        </ScrollView>
    )
);

export default TabsScrollable;
