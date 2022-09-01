import React from 'react';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

//import mockData from "../../ProductList/src/mockData.json";

const mockData = [
    { title: 'Picked for you' },
    { title: 'Appetizers' },
    { title: 'Traditional Sushi' },
    { title: 'Aplatanao Rolls', isSelected: true },
    { title: 'Main Course' },
];

import TabsItem from './TabsItem';
import TabList from './TabsList';
import TabsScrollable from './TabsScrollable';

export default {
    title: 'packages/Tabs',
};

export const Item = () => <TabsItem title="Default" />;
export const Selected = () => <TabsItem title="Selected" isSelected />;
export const List = ({ onPress }) => (
    <TabList>
        {mockData.map((item, index) => (
            <TabsItem title={item.title} isSelected={item.isSelected} onPress={() => onPress(index)} />
        ))}
    </TabList>
);

export const ListTitle = ({ onPress }) => (
    <TabList title="Dinner Menu">
        {mockData.map((item, index) => (
            <TabsItem title={item.title} isSelected={item.isSelected} onPress={() => onPress(index)} />
        ))}
    </TabList>
);

export const Scrollable = () => (
    <TabsScrollable data={mockData} onTabsItemLayout={() => {}} onTabsItemLayout={() => {}} onPress={() => {}} />
);

export const ScrollableTitle = () => (
    <TabsScrollable
        title="Main Menu"
        data={mockData}
        onTabsItemLayout={() => {}}
        onTabsItemLayout={() => {}}
        onPress={() => {}}
    />
);

let data = ['Restaurant', 'Clothing', 'GroceryGourmet', 'Liquor'];

export const Industries = () => (
    <TabsScrollable
        title="Main Menu"
        data={data}
        onTabsItemLayout={() => {}}
        onTabsItemLayout={() => {}}
        onPress={() => {}}
    />
);