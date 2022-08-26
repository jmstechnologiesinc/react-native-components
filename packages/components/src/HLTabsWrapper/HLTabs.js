import React from 'react';
import { View } from 'react-native';

import { Chip, List } from '@jmsstudiosinc/react-native-paper';
import styles from './styles';

const HLTabs = ({ options, value, onSelect, title }) => {
    const renderTabItem = (option) => {
        const onPress = () => onSelect?.(option.value);
        const isSelected = option.value === value;

        return (
            <View style={styles.spacePadding}>
                <Chip mode={isSelected ? 'flat' : 'outlined'} style={styles.chip} onPress={onPress}>
                    {option.title}
                </Chip>
            </View>
        );
    };

    return (
        <List.Section title={title}>
            <View style={styles.row}>{options.map(renderTabItem)}</View>
        </List.Section>
    );
};

export default HLTabs;
