import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip, List } from '@jmsstudiosinc/react-native-paper';

const ChipList = ({ options, value, onSelect, title }) => {
    const chipListItem = (option) => {
        const onPress = () => onSelect?.(option.value);
        const isSelected = option.value === value;

        return (
            <Chip 
                selected={isSelected}  
                showSelectedOverlay 
                onPress={onPress}
                style={styles.chip}>
                {option.title}
            </Chip>
        );
    };

    return (
        <List.Section title={title}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <View style={styles.row}>{options.map(chipListItem)}</View>
            </ScrollView>
        </List.Section>
    );
};

const styles = StyleSheet.create({
    chip: {
        marginHorizontal: 4,
    },
    row: {
        flexDirection: 'row',
    },
});


export default ChipList;
