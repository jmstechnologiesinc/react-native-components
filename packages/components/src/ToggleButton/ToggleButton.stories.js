import React from 'react';

import ToggleButtonList from './ToggleButtonList';

import mockData from "./mockData.json";

export default {
  title: 'packages/ToggleButton',
};

const dataLine = [ {"title": "Pickup", "value": "pickup"}]

export const OneLine = ({onPress}) => (
  <ToggleButtonList 
    title="Available Shipping Mode"
    data={dataLine} 
    onPress={() => {}}
    value={'pickup'}
    />
);

export const TwoLines = ({onPress}) => (
  <ToggleButtonList 
    title="Available Shipping Mode"
    data={mockData} 
    onPress={() => {}}
    value={'delivery'} />
);