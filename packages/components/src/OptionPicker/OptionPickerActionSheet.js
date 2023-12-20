import React, { useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';
import { Button, HelperText } from '@jmstechnologiesinc/react-native-paper';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChipList, styles as JMSStyles, ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import NestedOptionPicker from './NestedOptionPicker';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper/src/styles/themes';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';
import { localized } from '../Localization/Localization';

import { useHeaderHeight } from '@react-navigation/elements';

const WINDOW_HEIGHT = Dimensions.get('window').height;

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

    const HEADER_HEIGHT = useHeaderHeight();

    const handleRemoveChip = (index) => {
        const optionToRemove = preSelectedOptions[index];
        setSelectedOptions((prev) => prev.filter((option) => option.id !== optionToRemove.id));
        onPress(preSelectedOptions.filter((option) => option.id !== optionToRemove.id));
    };

    const selectedTitles = preSelectedOptions.map((option) => option.title);

    const showActionSheet = () => {
        setSelectedOptions(preSelectedOptions);
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => actionSheetRef.current.hide();
    const actionSheetHeight = Platform.OS === 'ios' ? WINDOW_HEIGHT - HEADER_HEIGHT : null;

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
                    height: actionSheetHeight,
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
                    style={[JMSStyles.button, JMSStyles.buttonWithInset]}
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
