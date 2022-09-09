import React from 'react';

import { StyleSheet, View } from 'react-native';

const TabList = ({children}) => (
    <View style={styles.container}>
        <View style={styles.row}>{children}</View>
    </View>
);

export default TabList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: "row",
    }
})