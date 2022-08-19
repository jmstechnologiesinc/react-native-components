import React from "react";

import {View, ScrollView } from "react-native";

import TabsItem from "./TabsItem";
import TabList from "./TabsList";

const TabsScrollable = ({
    data, 
    onPress, 
    selectedIndex
}) => {

    const renderTabsList = (
        <TabList>
            {data.map((item, index) => <TabsItem
                title={item.title} 
                isSelected={selectedIndex === index}
                onPress={() => onPress(index)} />
            )}
        </TabList>
    );

    return <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal>
        <View onLayout={() => {}}>
            {renderTabsList}
        </View>
    </ScrollView>
}

export default TabsScrollable
  