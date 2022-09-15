import React from 'react';

//import mockData from "../../ProductList/src/mockData.json";

const mockData = [
  {title: "Picked for you"},
  {title: "Appetizers"},
  {title: "Traditional Sushi"},
  {title: "Aplatanao Rolls", isSelected: true},
  {title: "Main Course"}
];

import TabsItem from './TabsItem';
import TabList from './TabsList';

export default {
  title: 'packages/Tabs',
};

export const Item = () => <TabsItem title="Default" />
export const Selected = () => <TabsItem title="Selected" isSelected />
export const List = ({onPress}) => (
  <TabList>
    {mockData.map((item, index) => <TabsItem 
      title={item.title} 
      isSelected={item.isSelected}
      onPress={() => onPress(index)} />)
    }
  </TabList>
);
