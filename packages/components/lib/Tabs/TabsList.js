import React from 'react';

import { StyleSheet, View } from 'react-native';

import { List } from '@jmsstudiosinc/react-native-paper';

const TabList = ({ children }) => (
    <View style={styles.container}>
        <List.Section>
            <View style={styles.row}>
                {children}
            </View>
        </List.Section>
    </View>
);

export default TabList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    }
})