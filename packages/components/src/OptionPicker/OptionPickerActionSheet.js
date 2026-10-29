import React, { useContext, useRef, useState } from 'react';
import { Dimensions, Platform, FlatList, StatusBar, View } from 'react-native';
import { Button, HelperText, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import JMSStyles from '../styles';
import ScreenWrapper from '../ScreenWrapper';
import NestedOptionPicker from './NestedOptionPicker';
import OptionSheet from './OptionSheet';
import { localized } from '../Localization/Localization';
import { HeaderHeightContext } from '@react-navigation/elements';
import { TNActivityIndicator } from '../truly-native';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';
import ChipList from '../ChipList/ChipList';
import CheckedRow from '../ListRow/CheckedRow';
import MutedText from '../MutedText/MutedText';
import { EMPTY_VALUE } from '../valueText';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const APPROX_STATUSBAR_HEIGHT = Platform.select({
    android: StatusBar.currentHeight + MD3LightTheme.spacing.x5 ?? 0,
    ios: 0,
});

/**
 * `readOnly` (additive; the partner console) shows the picked options as content, not controls: one
 * `CheckedRow` each in a `list` named `chipListTitle` (Paper chips without `onPress` are announced disabled,
 * on native and on the web), or the library's empty value (`EMPTY_VALUE`) when none is picked. Nothing to
 * pick, remove or open — no «pick» button, no option sheet, and no help text, which tells whoever picks how
 * to pick — and nothing greyed out. With `isDisabled` as well it is the disabled picker, exactly.
 */
function OptionPickerActionSheet({
    isDisabled,
    readOnly: readOnlyProp = false,
    isChipRemoveable = true,
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
    chipListOptionTitle,
    onPress,
    onNavigation = false,
}) {
    // Disabled and read-only is disabled: exactly the disabled picker.
    const readOnly = readOnlyProp && !isDisabled;
    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();
    // `useHeaderHeight()` throws outside a navigator with a header, which took
    // down every form embedding this picker in a plain view (C-25).
    const HEADER_HEIGHT = useContext(HeaderHeightContext) ?? 0;

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
        if (options?.length === 0 && onNavigation) {
            onNavigation();
        } else {
            setSelectedOptions(preSelectedOptions);
            onShowActionSheetPress?.();
            actionSheetRef.current.show();
        }
    };

    const hideActionSheet = () => actionSheetRef.current.hide();
    const actionSheetHeight =
        Platform.OS === 'ios' ? WINDOW_HEIGHT - HEADER_HEIGHT : WINDOW_HEIGHT - insets.top - APPROX_STATUSBAR_HEIGHT;

    return (
        <>
            <ScreenWrapper.Section title={chipListTitle} titleStyle={titleStyle}>
                {readOnly ? (
                    preSelectedOptions.length ? (
                        // Every row is a picked option, so none carries a check: the list's name says what they are.
                        <View role="list" aria-label={chipListTitle}>
                            {preSelectedOptions.map((option, index) => (
                                <CheckedRow
                                    // The id, with the position for a pick listed twice (picks never reorder while shown).
                                    key={`${option.id}.${index}`}
                                    title={chipListOptionTitle ? chipListOptionTitle(option) : option.title}
                                    titleNumberOfLines={0}
                                />
                            ))}
                        </View>
                    ) : (
                        <MutedText>{EMPTY_VALUE}</MutedText>
                    )
                ) : (
                    <ChipList
                        isDisabled={isDisabled}
                        options={preSelectedOptions.map((option) =>
                            chipListOptionTitle ? chipListOptionTitle(option) : option.title
                        )}
                        onPress={showActionSheet}
                        onClose={isChipRemoveable ? handleRemoveChip : null}
                        chipStyle={{ marginBottom: MD3LightTheme.spacing.x2 }}
                    />
                )}
                {readOnly ? null : (
                    <ButtonWrapper
                        title={addButtonTitle}
                        isDisabled={isDisabled}
                        onPress={showActionSheet}
                        style={[{ marginLeft: 0 }, buttonWrapperStyle]}
                    />
                )}
                {helpText && !readOnly ? (
                    <HelperText style={helperTextStyle} padding="none">
                        {helpText}
                    </HelperText>
                ) : null}
            </ScreenWrapper.Section>

            {readOnly ? null : (
                <OptionSheet
                    ref={actionSheetRef}
                    statusBarTranslucent={false}
                    drawUnderStatusBar={false}
                    springOffset={50}
                    defaultOverlayOpacity={0.3}
                    gestureEnabled
                    containerStyle={{
                        paddingBottom: insets.bottom,
                        height: actionSheetHeight,
                    }}
                >
                    {options?.length ? (
                        <FlatList
                            data={options}
                            renderItem={({ item }) => (
                                <NestedOptionPicker
                                    isDisabled={isDisabled}
                                    option={item}
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
                        style={[
                            JMSStyles.button,
                            JMSStyles.buttonWithInset,
                            { marginBottom: moderateScale(APPROX_STATUSBAR_HEIGHT) },
                        ]}
                        disabled={isDisabled}
                        onPress={handlePickButtonPress}
                    >
                        {localized('pick')}
                    </Button>
                </OptionSheet>
            )}
        </>
    );
}

export default OptionPickerActionSheet;
