import React from 'react';

import { View } from 'react-native';

import { Drawer, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * `menuItems`: `[{ key?, title, icon, badge? }]`. An item is active when its
 * `key` equals `selectedKey`, or — without `selectedKey` — when its index
 * equals `selectedIndex`. `renderHeader` draws above the items (a FAB, say).
 */
const SideNav = ({ isExpanded, menuItems = [], selectedIndex, selectedKey, onPress, renderHeader }) => {
    const isActive = (item, index) => (selectedKey !== undefined ? item.key === selectedKey : selectedIndex === index);

    return (
        <View style={{ paddingTop: MD3LightTheme.spacing.x8 }}>
            {renderHeader ? renderHeader() : null}
            {isExpanded
                ? menuItems.map((item, index) => (
                      <Drawer.Item
                          key={item.key ?? index}
                          label={item.title}
                          icon={item.icon}
                          active={isActive(item, index)}
                          onPress={() => onPress(item)}
                      />
                  ))
                : menuItems.map((item, index) => (
                      <View key={item.key ?? index} style={index === 0 ? styles.destinationItemHeight : null}>
                          <Drawer.CollapsedItem
                              label={item.title}
                              focusedIcon={item.icon}
                              badge={item.badge}
                              active={isActive(item, index)}
                              onPress={() => onPress(item)}
                          />
                      </View>
                  ))}
        </View>
    );
};

const styles = {
    destinationItemHeight: {
        marginBottom: MD3LightTheme.spacing.x14,
    },
    centerAligned: {
        paddingTop: MD3LightTheme.spacing.x4,
        flex: 1,
        justifyContent: 'center',
    },
};

export default SideNav;
