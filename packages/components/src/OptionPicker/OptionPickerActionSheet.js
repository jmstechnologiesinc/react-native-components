import React, { useRef, useState } from 'react';
import { Dimensions, Platform, FlatList } from 'react-native';
import { Button, HelperText, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import JMSStyles from '../styles';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import NestedOptionPicker from './NestedOptionPicker';
import { localized } from '../Localization/Localization';
import { useHeaderHeight } from '@react-navigation/elements';
import { TNActivityIndicator } from '../../../../../src/Core/truly-native';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import ButtonWrapper from '@jmstechnologiesinc/react-native-components/lib/ButtonWrapper/ButtonWrapper';
import ChipList from '@jmstechnologiesinc/react-native-components/lib/ChipList/ChipList';

const WINDOW_HEIGHT = Dimensions.get('window').height;

function OptionPickerActionSheet({
    isDisabled,
    variant = "chipList",
    options = [],
    preSelectedOptions = [],
    multiple = true,
    helpText,
    addButtonTitle = localized('pick'),
    chipListTitle = localized('Categories'),
    titleStyle,
    helperTextStyle,
    buttonWrapperStyle,
    onShowActionSheetPress,
    onPress
}) {
    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();
    const HEADER_HEIGHT = useHeaderHeight();
    
    const [selectedOptions, setSelectedOptions] = useState(preSelectedOptions);

    const handleOptionPress = (option) => {
        let updatedOptions;

        if (multiple) {
            updatedOptions = selectedOptions.some((opt) => opt.id === option.id)
                ? selectedOptions.filter((opt) => opt.id !== option.id)
                : [...selectedOptions, option];
        } else {
            updatedOptions = [option];
        }

        setSelectedOptions(updatedOptions);
    };

    const handleRemoveChip = (index) => {
        const updatedOptions = preSelectedOptions.filter((_, i) => i !== index);
        onPress(updatedOptions);
    };

    const handlePickButtonPress = () => {
        onPress(selectedOptions);
        hideActionSheet();
    };

    const showActionSheet = () => {
        setSelectedOptions(preSelectedOptions)
        onShowActionSheetPress?.();
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => actionSheetRef.current.hide();
    const actionSheetHeight = Platform.OS === 'ios' ? WINDOW_HEIGHT - HEADER_HEIGHT : null;

    return (
        <>
            <ScreenWrapper.Section title={chipListTitle} titleStyle={titleStyle}>
                {variant === "chipList" ? (
                    <ChipList
                        isDisabled={isDisabled}
                        options={preSelectedOptions.map(option => option.title)}
                        onPress={showActionSheet}
                        onClose={handleRemoveChip}
                        chipStyle={{ marginBottom: MD3LightTheme.spacing.x2 }}
                    />
                ) : preSelectedOptions.map((option) => (
                    <List.Item
                        key={option.id}
                        title={option.description}
                        //description={option.description}
                        titleNumberOfLines={0}
                        descriptionNumberOfLines={0}
                        right={(props) => <List.Icon {...props} icon={MATERIAL_ICONS.chevron} />}
                        onPress={showActionSheet}
                        style={{ marginLeft: 0 }}
                    />
                ))}
                <ButtonWrapper
                    title={addButtonTitle}
                    isDisabled={isDisabled}
                    onPress={showActionSheet}
                    style={[{ marginLeft: 0 }, buttonWrapperStyle]}
                />
                {helpText ? <HelperText style={helperTextStyle} padding='none'>{helpText}</HelperText> : null}
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
                }}>
                {options?.length ? (
                    <FlatList
                        data={options}
                        renderItem={({ item }) => (
                            <NestedOptionPicker
                                isDisabled={isDisabled}
                                options={[item]}
                                selectedOptions={selectedOptions}
                                multiple={multiple}
                                onOptionPress={handleOptionPress}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <TNActivityIndicator />
                )}

                <Button
                    mode="outlined"
                    uppercase
                    style={[JMSStyles.button, JMSStyles.buttonWithInset]}
                    disabled={isDisabled}
                    onPress={handlePickButtonPress}
                >
                    {localized('pick')}
                </Button>
            </ActionSheet>
        </>
    );
}

export default OptionPickerActionSheet;
