import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import SwipeToDelete from './SwipeToDelete';


export default {
    title: 'packages/SwipeToDelete',
};

export const ListTitle = () => (
    <SwipeToDelete>
        <List.Item title="title" />
    </SwipeToDelete>
)
