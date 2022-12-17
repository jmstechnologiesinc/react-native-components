import * as React from 'react';

import { View, StyleSheet } from 'react-native';

const ActionGroupGroup = ({children, style}) => (
    <View style={[styles.container, style]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: "space-between",
    },
    row: {
        flexDirection: "row",
        flex: 1,
    }
  });

export default ActionGroupGroup;
