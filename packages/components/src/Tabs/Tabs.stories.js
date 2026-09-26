import React from 'react';

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
import TabsBar from './TabsBar';

export default {
    title: 'packages/Tabs',
};

export const NoSelectedItem = () => <TabsItem title="Default" />;
export const SelectedItem = () => <TabsItem title="Selected" isSelected />;
export const List = ({ onPress }) => (
    <TabList>
        {mockData.map((item, index) => (
            <TabsItem title={item.title} isSelected={item.isSelected} onPress={() => onPress(index)} />
        ))}
    </TabList>
);

export const Scrollable = () => <TabsScrollable data={mockData} onTabsItemLayout={() => {}} onPress={() => {}} />;

export const ScrollableTitle = () => (
    <TabsScrollable title="Main Menu" data={mockData} onTabsItemLayout={() => {}} onPress={() => {}} />
);

// MD3 primary tabs: 48dp, a 3dp indicator under the label. On the web: Left/Right/Home/End move the selection.
export const PrimaryList = () => {
    const [selected, setSelected] = React.useState(0);
    return (
        <TabList accessibilityLabel="Sections">
            {mockData.map((item, index) => (
                <TabsItem
                    key={item.title}
                    variant="primary"
                    title={item.title}
                    isSelected={selected === index}
                    onPress={() => setSelected(index)}
                />
            ))}
        </TabList>
    );
};

// `Tabs.Bar`: the same primary tabs with a value/label API, as wide as their container (a pane).
export const Bar = () => {
    const [value, setValue] = React.useState('documents');
    return (
        <TabsBar
            tabs={[
                { value: 'summary', label: 'Summary' },
                { value: 'documents', label: 'Documents' },
                { value: 'history', label: 'History', disabled: true },
            ]}
            value={value}
            onChange={setValue}
            accessibilityLabel="Sections"
        />
    );
};
