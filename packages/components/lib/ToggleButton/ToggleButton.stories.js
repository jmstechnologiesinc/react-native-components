import React from 'react';

import ToggleButtonList from './ToggleButtonList';

import mockData from "./mockData.json";

export default {
  title: 'packages/ToggleButton',
};

export const OneLine = ({onPress}) => (
  <ToggleButtonList 
    title="Available Shipping Mode"
    data={mockData.map(item => ({title: item.title}))} 
    onPress={() => {}}
    selectedIndex={1} />
);

export const TwoLines = ({onPress}) => (
  <ToggleButtonList 
    title="Available Shipping Mode"
    data={mockData} 
    onPress={() => {}}
    selectedIndex={1} />
);