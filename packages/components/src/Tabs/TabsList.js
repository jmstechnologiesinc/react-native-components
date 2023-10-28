import React from 'react';

import { StyleSheet, View } from 'react-native';

const TabList = ({ children, style }) => (
    <View style={[styles.container, style]}>
        <View style={styles.row}>{children}</View>
    </View>
);

export default TabList;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
});
