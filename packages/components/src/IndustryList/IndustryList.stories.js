import React from 'react';

import IndustryList from './IndustryList';

export default {
    title: 'packages/IndustryList',
};
const data = ['Restaurant', 'Clothing', 'GroceryGourmet', 'Liquor', 'Books', 'CellPhones', 'Computers', 'VideoGames'];

export const Industries = ({ onPress }) => <IndustryList data={data} onPress={() => {}} value="GroceryGourmet" />;
