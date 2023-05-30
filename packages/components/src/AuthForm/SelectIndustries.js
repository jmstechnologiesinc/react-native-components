import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { TextInput,  List, Button, Checkbox } from '@jmsstudiosinc/react-native-paper';

import { interpunct } from '@jmsstudiosinc/commons';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles as JMSStyles, localized } from '@jmsstudiosinc/react-native-components';
import { OPTIONS, onUpdateValue, resetIndustry } from './utils';

export default function SelectIndustries({ placeholder, inputActionHandler }) {
    const actionSheetRef = useRef();
    const [options, setOptions] = useState(OPTIONS);
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => {
        actionSheetRef.current.hide();
    };
    useEffect(() => {
        resetIndustry(options, setOptions);
    }, []);

    const selectedItems = options.filter((item) => item.selected === true);
    const isSelect = selectedItems.map((item) => item.item);
    const itemSelected = interpunct(isSelect);

    return (
        <Pressable
            onPress={() => showActionSheet()}
        >
            <View pointerEvents="none">
                <TextInput
                    editable={false}
                    multiline={true}
                    value={itemSelected}
                    placeholder={placeholder}
                    mode="outlined"
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
                                onPress={() => onUpdateValue(options, index, selected, setOptions)}
                                left={() => (
                                    <Checkbox.Android
                                        status={selected ? 'checked' : 'unchecked'}
                                        onPress={() => onUpdateValue(options, index, selected, setOptions)}
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
                        inputActionHandler('industry', isSelect);
                        hideActionSheet();
                    }}
                >
                    {localized('SAVE')}
                </Button>
            </ActionSheet>
        </Pressable>
    );
}
