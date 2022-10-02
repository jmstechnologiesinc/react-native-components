import React from 'react';
import { StyleSheet } from 'react-native';

import { Chip } from '@jmsstudiosinc/react-native-paper';
import * as Tabs from '../Tabs/Tabs';

const ChipList = ({ 
    title, 
    options, 
    currentIndex, 
    onPress 
}) =>  <Tabs.Scrollable title={title} currentIndex={currentIndex}>
    {options.map((item, index) => (
        <Chip
            mode={"outlined"}
            selected={currentIndex === index}  
            showSelectedOverlay 
            onPress={() => onPress(index)}
            style={index !== 0 && styles.chip}>
            {item}
        </Chip>
)   )}
</Tabs.Scrollable>

const styles = StyleSheet.create({
    chip: {
        marginLeft: 4,
    }
});


export default ChipList;
