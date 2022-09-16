import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';

import * as Tabs from '../Tabs/Tabs';

const ToggleButtonList = ({ data, title, onPress, value }) => (
    <List.Section title={title}>
        <Tabs.List>
            {data.map((item, index) => (
                <Tabs.Item
                    index={index}
                    variant="toggle"
                    title={item.title}
                    subTitle={item.subTitle}
                    isSelected={item.value === value}
                    onPress={() => onPress(item.value)}
                />
            ))}
        </Tabs.List>
    </List.Section>
)


export default ToggleButtonList;
