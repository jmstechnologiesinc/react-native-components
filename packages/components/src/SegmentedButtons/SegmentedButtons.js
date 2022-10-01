import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from '@jmsstudiosinc/react-native-paper';

export const SegmentedButtonDefault = ({ data, setValue, value, title }) => {
    return (
        <List.Section title={title}>
            <SegmentedButtons value={value} onValueChange={setValue} buttons={data} style={styles.group} />
        </List.Section>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
    },
    group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonDefault;
