import React, { useRef, useState, useCallback } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { TextInput, List, Button, Checkbox } from '@jmstechnologiesinc/react-native-paper';

import { interpunct } from '@jmstechnologiesinc/commons';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles as JMSStyles, localized } from '@jmstechnologiesinc/react-native-components';
import { OPTIONS } from './utils';
import { useFocusEffect } from '@react-navigation/native';

export default function IndustryPicker({ isDisabled, placeholder, inputActionHandler, industry }) {
    const actionSheetRef = useRef();
    const [options, setOptions] = useState(OPTIONS);
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

    useFocusEffect(
        useCallback(() => {
            onResetSelected();
        }, [])
    );

    const onResetSelected = () => {
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                options[i].selected = false;
            }
        }
    };

    const showActionSheet = () => {
        options.filter((option) => {
            if (industry?.includes(option.item)) {
                option.selected = true;
                return setOptions([...options]);
            }
        });
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => {
        actionSheetRef.current.hide();
    };

    const selectedItems = options.filter((item) => item.selected === true);
    const isSelect = selectedItems.map((item) => item.item);
    const itemSelected = interpunct(industry ? industry : isSelect);

    return (
        <Pressable onPress={() => showActionSheet()}>
            <View pointerEvents="none">
                <TextInput
                    editable={false}
                    multiline={true}
                    value={itemSelected}
                    placeholder={placeholder}
                    mode="outlined"
                    disabled={isDisabled}
                    right={<TextInput.Icon icon={'chevron-down-circle-outline'} onPress={() => showActionSheet()} />}
                />
            </View>

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
                        {options.map(({ item, selected }, index) => (
                            <List.Item
                                key={index}
                                title={item}
                                onPress={
                                    !isDisabled
                                        ? () => {
                                              options[index].selected = !selected;
                                              setOptions([...options]);
                                          }
                                        : null
                                }
                                left={() => (
                                    <Checkbox.Android
                                        status={selected ? 'checked' : 'unchecked'}
                                        disabled={isDisabled}
                                        onPress={
                                            !isDisabled
                                                ? () => {
                                                      options[index].selected = !selected;
                                                      setOptions([...options]);
                                                  }
                                                : null
                                        }
                                    />
                                )}
                            />
                        ))}
                    </List.Section>
                </ScrollView>
                <Button
                    mode="contained"
                    style={JMSStyles.fba}
                    onPress={() => {
                        !isDisabled ? inputActionHandler('industry', isSelect) : null;
                        hideActionSheet();
                    }}
                >
                    {localized(isDisabled ? 'CLOSE' : 'SAVE')}
                </Button>
            </ActionSheet>
        </Pressable>
    );
}
