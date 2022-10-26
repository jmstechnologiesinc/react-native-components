import React from 'react';

import { Drawer } from '@jmsstudiosinc/react-native-paper';

const ToggleableDrawer = ({
  isExpanded,
  title, 
  menuItems=[],
  selectedIndex,
  onPress,
}) => (
    isExpanded ? (
        <Drawer.Section title={title}>
            {menuItems.map((item, index) => (
                <Drawer.Item
                    label={item.title}
                    icon={item.icon}
                    active={selectedIndex === index}
                    onPress={() => onPress(item)}
                />
            ))}
        </Drawer.Section>
    ) : (
        menuItems.map((item, index) => (
            <Drawer.CollapsedItem
                label={item.title}
                icon={item.icon}
                active={selectedIndex === index}
                onPress={() => onPress(item)}
            />
        ))
    )
)

export default ToggleableDrawer;
