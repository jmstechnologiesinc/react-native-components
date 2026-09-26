import React from 'react';
import { StyleSheet, View } from 'react-native';

import ChipList from '../ChipList/ChipList';

/**
 * A single-choice filter over a few values (a status, a queue), as outlined MD3 filter chips on the
 * library's `ChipList`, with a value/label API. The row scrolls horizontally when the chips do not fit.
 * The selected chip stays selected: pressing it again reports nothing (a single choice always has a
 * value). Labels are shown as given (the host localizes them). A `group` named `accessibilityLabel`.
 *
 * @param {{options: Array<{value: string, label: string}>, value?: string, onChange: (value: string) => void,
 *     compact?: boolean, disabled?: boolean, accessibilityLabel?: string, testID?: string}} props testID
 *     default `filter-chips`
 */
const FilterChips = ({
    options,
    value,
    onChange,
    compact = true,
    disabled,
    accessibilityLabel,
    testID = 'filter-chips',
}) => {
    const currentIndex = options.findIndex((option) => option.value === value);
    return (
        <View role="group" aria-label={accessibilityLabel} testID={testID}>
            <ChipList
                options={options.map((option) => option.label)}
                currentIndex={currentIndex}
                mode="outlined"
                compact={compact}
                isDisabled={disabled}
                onPress={(index) => {
                    if (index !== currentIndex) onChange(options[index].value);
                }}
                style={styles.fullWidth}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    // ChipList's bar defaults to the window's width; a filter row is as wide as its container, and never
    // grows along a column (a horizontal ScrollView takes a column's height on react-native-web).
    fullWidth: {
        width: '100%',
        flexGrow: 0,
    },
});

export default FilterChips;
