import React from 'react';

import { StyleSheet } from 'react-native';

import { SegmentedButtons } from '@jmstechnologiesinc/react-native-paper';

const SegmentedButtonGroup = ({ data, title, onPress, value, ...rest }) => (
    <SegmentedButtons
        value={value}
        onValueChange={onPress}
        buttons={data?.map(item => ({
            ...item,
            style: styles.button
        }))} 
        style={styles.group} 
        {...rest} />
)

const styles = StyleSheet.create({
    button: {
        flex: 1,
    },
    group: { justifyContent: 'center' },
});

export default SegmentedButtonGroup;
