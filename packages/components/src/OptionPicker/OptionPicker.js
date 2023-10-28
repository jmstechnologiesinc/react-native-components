import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { List, Button, Checkbox, RadioButton } from '@jmstechnologiesinc/react-native-paper';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChipList, styles as JMSStyles, localized, ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

function OptionPicker({ 
    isDisabled, 
    onPress, 
    options = [], 
    preSelectedOptions = [],
    multiple = true,
    chipListTitle = localized('Categories'),
    addButtonTitle = localized('add')
}) {
    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

    const [selectedOptions, setSelectedOptions] = useState(preSelectedOptions);

    const isOptionSelected = (value) => selectedOptions.some(option => option.value === value);

    const toggleOption = (option) => {
        if (isOptionSelected(option.value)) {
            return selectedOptions.filter(selectedOption => selectedOption.value !== option.value);
        } else {
            return [...selectedOptions, option];
        }
    };

    const onCheckboxPress = (selectedOption) => {
        setSelectedOptions(toggleOption(selectedOption));
    };

    const handleRemoveChip = (index) => {
        const optionToRemove = selectedOptions[index];
        setSelectedOptions(prev => prev.filter(option => option.value !== optionToRemove.value));
        onPress(selectedOptions.filter(option => option.value !== optionToRemove.value));
    };

    const selectedTitles = preSelectedOptions.map(option => option.title);

    const showActionSheet = () => {
        setSelectedOptions(preSelectedOptions);
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => actionSheetRef.current.hide();

    const renderOption = (option, margin = 0) => (
        <>
            <List.Item
                title={localized(option.title)}
                titleStyle={{ marginLeft: margin }}
                onPress={() => !isDisabled && onCheckboxPress(option)}
                left={() => multiple ? (
                    <Checkbox.Android
                        status={isOptionSelected(option.value) ? 'checked' : 'unchecked'}
                        disabled={isDisabled}
                        onPress={() => !isDisabled && onCheckboxPress(option)}
                    />
                ) : (
                    <RadioButton.Android
                        value={option.value}
                        status={isOptionSelected(option.value) ? 'checked' : 'unchecked'}
                        onPress={() => !isDisabled && onCheckboxPress(option)}
                    />
                )}
            />
            {option.children && option.children.map(child => renderOption(child, margin + 20))}
        </>
    );

    return (
        <>
            <ScreenWrapper.Section title={localized(chipListTitle)}>
                <ChipList
                    isDisabled={isDisabled}
                    options={selectedTitles}
                    onPress={showActionSheet}
                    onClose={handleRemoveChip}
                />
            </ScreenWrapper.Section>
           
            <Button
                disabled={isDisabled}
                icon={MATERIAL_ICONS.increment}
                onPress={showActionSheet}                    
                style={{ flexDirection: 'row' }}
            >
                {localized(addButtonTitle)}
            </Button>

            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={true}
                drawUnderStatusBar={true}
                springOffset={50}
                defaultOverlayOpacity={0.3}
                gestureEnabled
                containerStyle={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                <ScrollView {...scrollHandlers}>
                    <List.Section>
                        {options.map(option => renderOption(option))}
                    </List.Section>
                </ScrollView>
                <Button
                    mode="outlined"
                    style={JMSStyles.fba}
                    disabled={isDisabled}
                    onPress={() => {
                        onPress(selectedOptions);
                        hideActionSheet();
                    }}
                >
                    {localized('CLOSE')}
                </Button>
            </ActionSheet>
        </>
    );
}

export default OptionPicker;
