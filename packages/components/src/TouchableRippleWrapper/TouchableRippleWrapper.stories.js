import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';

import TouchableRippleWrapper from './TouchableRippleWrapper';

export default {
    title: 'packages/TouchableRippleWrapper',
};

export const IsSelected = () => (
    <TouchableRippleWrapper isSelected onPress={() => {}}>
        <List.Item title="Is Selected" />
    </TouchableRippleWrapper>
);

export const Default = () => (
    <TouchableRippleWrapper onPress={() => {}}>
        <List.Item title="Default" />
    </TouchableRippleWrapper>
);
