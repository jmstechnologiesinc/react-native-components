import React from 'react';

import { View, ScrollView } from 'react-native';

import { List } from '@jmsstudiosinc/react-native-paper';

import TabsItem from './TabsItem';
import TabList from './TabsList';

const TabsScrollable = React.forwardRef(
    ({ title, data, selectedIndex, onPress, onTabsContainerLayout, onTabsItemLayout }, ref) => (
        <List.Section title={title}>
            <ScrollView ref={ref} showsHorizontalScrollIndicator={false} horizontal>
                <View onLayout={onTabsContainerLayout}>
                    <TabList>
                        {data.map((item, index) => (
                            <View onLayout={onTabsItemLayout(index)}>
                                <TabsItem
                                    title={item.title}
                                    variant={item.variant}
                                    isSelected={selectedIndex === index || item.isSelected}
                                    onPress={onPress}
                                    fontAwesomeIcon={item.fontAwesomeIcon}
                                />
                            </View>
                        ))}
                    </TabList>
                </View>
            </ScrollView>
        </List.Section>
    )
);

export default TabsScrollable;
