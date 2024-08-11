import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Checkbox, RadioButton } from '@jmstechnologiesinc/react-native-paper';
import { imageKitListImage } from '../utils';

function NestedOptionPicker({
    isDisabled,
    options = [],
    selectedOptions = [],
    multiple = true,
    onOptionPress,
}) {
    const isOptionSelected = (id) => selectedOptions.some((opt) => opt.id === id);

    const renderNestedOption = (option, margin = 0) => (
        <>
            <List.Item
                title={option.title}
                description={option.description}
                titleNumberOfLines={0}
                descriptionNumberOfLines={0}
                titleStyle={{ marginLeft: margin }}
                onPress={() => onOptionPress(option)}
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
                                onPress={() => onOptionPress(option)}
                            />
                        </View>
                    ) : (
                        <View style={styles.centered}>
                            <RadioButton.Android
                                status={isOptionSelected(option.id) ? 'checked' : 'unchecked'}
                                disabled={isDisabled}
                                onPress={() => onOptionPress(option)}
                            />
                        </View>
                    )
                }
            />
            {option.children && option.children.map((child) => renderNestedOption(child, margin + 20))}
        </>
    );

    return options.map((option) => renderNestedOption(option));
}

const styles = StyleSheet.create({
    centered: {
        alignSelf: 'center',
    },
});

export default NestedOptionPicker;
