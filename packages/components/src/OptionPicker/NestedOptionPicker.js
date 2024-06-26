import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { List, Checkbox, RadioButton } from '@jmstechnologiesinc/react-native-paper';
import { imageKitListImage } from '../utils';

function NestedOptionPicker({ isDisabled, onPress, options = [], preSelectedOptions = [], multiple = true }) {
    const [selectedOptions, setSelectedOptions] = useState(preSelectedOptions);

    useEffect(() => {
        setSelectedOptions(preSelectedOptions);
    }, [preSelectedOptions]);

    const isOptionSelected = (id) => selectedOptions.some((option) => option.id === id);

    const toggleOption = (option) => {
        if (isOptionSelected(option.id)) {
            return selectedOptions.filter((selectedOption) => selectedOption.id !== option.id);
        } else {
            return [...selectedOptions, option];
        }
    };

    const onCheckboxPress = (selectedOption) => {
        if (!isDisabled) {
            const filteredSectionOptions = toggleOption(selectedOption);
            setSelectedOptions(filteredSectionOptions);
            onPress(filteredSectionOptions);
        }
    };

    const renderOption = (option, margin = 0) => (
        <>
            <List.Item
                title={option.title}
                description={option.description}
                descriptionNumberOfLines={0}
                titleStyle={{ marginLeft: margin }}
                onPress={() => onCheckboxPress(option)}
                left={
                    option.photo
                        ? (props) => <List.Image style={props.style} source={{ uri: imageKitListImage(option.photo) }} />
                        : null
                }
                right={() =>
                    multiple ? (
                        <View style={styles.centered}>
                            <Checkbox.Android
                                status={isOptionSelected(option.id) ? 'checked' : 'unchecked'}
                                disabled={isDisabled}
                                onPress={() => onCheckboxPress(option)}
                            />
                        </View>
                    ) : (
                        <View style={styles.centered}>
                            <RadioButton.Android
                                id={option.id}
                                status={isOptionSelected(option.id) ? 'checked' : 'unchecked'}
                                onPress={() => onCheckboxPress(option)}
                            />
                        </View>
                    )
                }
            />
            {option.children && option.children.map((child) => renderOption(child, margin + 20))}
        </>
    );

    return options.map((option) => renderOption(option));
}

const styles = StyleSheet.create({
    centered: {
        alignSelf: 'center',
    },
});

export default NestedOptionPicker;
