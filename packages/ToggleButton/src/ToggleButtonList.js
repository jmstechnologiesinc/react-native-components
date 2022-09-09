import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';

import * as Tabs from '../../Tabs';

const ToggleButtonList = ({ 
    data,
    title, 
    onPress,
    selectedIndex
}) => ( 
    <List.Section title={title}>
        <Tabs.List>
            {data.map((item, index) => <Tabs.Item
                index={index}
                variant="toggle"
                title={item.title} 
                subTitle={item.subTitle}
                isSelected={selectedIndex === index}
                onPress={() => onPress(index)} />
            )}
        </Tabs.List>
    </List.Section>
)

export default ToggleButtonList;