import React from 'react';

import { StyleSheet, View, Platform } from 'react-native';

const TabList = ({ children }) => (
    <View style={styles.container}>
        <View style={styles.row}>{children}</View>
    </View>
);

export default TabList;

const styles = StyleSheet.create({
    container: {
        flex: Platform.OS === 'web' ? 1 : null,
    },
    row: {
        flexDirection: 'row',
    },
});
