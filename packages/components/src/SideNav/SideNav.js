import React from 'react';

import { View } from 'react-native';

import { Drawer, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const SideNav = ({
  isExpanded,
  title, 
  menuItems=[],
  selectedIndex,
  onPress,
}) => (
    <View style={{
        paddingTop: MD3LightTheme.spacing.x4, 
        flex: 1, 
        justifyContent: "center", 
    }}>
        {isExpanded ? (
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
        )}
    </View>
)

export default SideNav;