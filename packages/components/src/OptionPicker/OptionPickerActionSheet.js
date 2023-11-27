import React, { useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';
import { Button, HelperText } from '@jmstechnologiesinc/react-native-paper';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChipList, styles as JMSStyles,  ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import NestedOptionPicker from './NestedOptionPicker';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper/src/styles/themes';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';
import { localized } from '../Localization/Localization';


const windowHight = Dimensions.get('window').height;

function OptionPickerActionSheet({
    isDisabled,
    onPress,
    options = [],
    preSelectedOptions = [],
    multiple = true,
    chipListTitle = localized('Categories'),
    helpText,
    addButtonTitle = localized('pick'),
}) {
    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

    const [selectedOptions, setSelectedOptions] = useState(preSelectedOptions);

    const handleRemoveChip = (index) => {
        const optionToRemove = preSelectedOptions[index];
        setSelectedOptions((prev) => prev.filter((option) => option.id !== optionToRemove.id));
        onPress(preSelectedOptions.filter((option) => option.id !== optionToRemove.id));
    };

    const selectedTitles = preSelectedOptions.map((option) => localized(option.title));

    const showActionSheet = () => {
        setSelectedOptions(preSelectedOptions);
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => actionSheetRef.current.hide();
    const actionSheetHight = Platform.OS === 'ios' ? windowHight - 120 : null;

    return (
        <>
            <ScreenWrapper.Section title={chipListTitle}>
                <ChipList
                    isDisabled={isDisabled}
                    options={selectedTitles}
                    onPress={showActionSheet}
                    onClose={handleRemoveChip}
                    chipStyle={{ marginBottom: MD3LightTheme.spacing.x2 }}
                />
                <ButtonWrapper
                    title={addButtonTitle}
                    isDisabled={isDisabled}
                    onPress={showActionSheet}
                    style={{ marginLeft: 0 }}
                />
                {helpText ? <HelperText padding="none">{helpText}</HelperText> : null}
            </ScreenWrapper.Section>

            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={true}
                drawUnderStatusBar={false}
                springOffset={50}
                defaultOverlayOpacity={0.3}
                gestureEnabled
                containerStyle={{
                    paddingBottom: insets.bottom,
                    height: actionSheetHight,
                }}
            >
                <ScrollView {...scrollHandlers}>
                    <NestedOptionPicker
                        isDisabled={isDisabled}
                        options={options}
                        preSelectedOptions={preSelectedOptions}
                        multiple={multiple}
                        onPress={setSelectedOptions}
                    />
                </ScrollView>
                <Button
                    mode="outlined"
                    uppercase
                    style={JMSStyles.fba}
                    disabled={isDisabled}
                    onPress={() => {
                        onPress(selectedOptions);
                        hideActionSheet();
                    }}
                >
                    {localized('pick')}
                </Button>
            </ActionSheet>
        </>
    );
}

export default OptionPickerActionSheet;
