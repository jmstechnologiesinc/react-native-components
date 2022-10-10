import React from 'react';

import { StyleSheet } from 'react-native';

import { List, MD3LightTheme, SegmentedButtons } from '@jmsstudiosinc/react-native-paper';

const SegmentedButtonGroup = ({ data, title, onPress, value, ...rest }) => (
    <List.Section title={title}>
        <SegmentedButtons
            value={value}
            onValueChange={onPress}
            buttons={data?.map(item => ({
                ...item,
                style: styles.button
            }))} 
            style={styles.group} 
            {...rest} />
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
    group: { justifyContent: 'center', marginHorizontal: MD3LightTheme.margin },
});
  


export default SegmentedButtonGroup;
