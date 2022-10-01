import React from 'react';

import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from '@jmsstudiosinc/react-native-paper';

const SegmentedButtonGroup = ({ data, title, onPress, value }) => (
    <List.Section title={title}>
        <SegmentedButtons
            value={value}
            onValueChange={onPress}
            buttons={data?.map(item => ({
                ...item,
                style: styles.button
            }))} 
            style={styles.group} />
    
    </List.Section>
)

const styles = StyleSheet.create({
    button: {
      flex: 1,
    },
    rounded: {
        borderRadius: 20,
        borderWidth: 1
    },
    group: { paddingHorizontal: 20, justifyContent: 'center' },
});
  


export default SegmentedButtonGroup;
