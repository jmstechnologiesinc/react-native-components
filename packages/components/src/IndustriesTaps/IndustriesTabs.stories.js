import React from 'react';

import IndustriesTaps from './IndustryTabs';


export default {
    title: 'packages/IndustriesTap',
};
const data = ['Restaurant', 'Clothing','GroceryGourmet', 'Liquor', 'Books', 'CellPhones', 'Computers', 'VideoGames']

export const Industries = ({ onPress }) => (
    <IndustriesTaps title="Industries" data={data} onPress={() => {}} selectedIndex={2} />
);
