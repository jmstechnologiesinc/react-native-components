import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { TextInput, RadioButton, List, Button } from '@jmsstudiosinc/react-native-paper';

import { interpunct } from '@jmsstudiosinc/commons';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles as JMSStyles, localized } from '@jmsstudiosinc/react-native-components';

export default function SelectIndustries({ placeholder, OPTIONS, onUpdateValue, inputActionHandler }) {
    const actionSheetRef = useRef();

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => {
        actionSheetRef.current.hide();
    };

    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

    const selectedItems = OPTIONS.filter((item) => item.selected === true);
    const isSelect = selectedItems.map((item) => item.item);
    const itemSelected = interpunct(isSelect);

    const insets = useSafeAreaInsets();

    return (
        <>
            <TextInput
                editable={false}
                multiline={true}
                value={itemSelected}
                placeholder={placeholder}
                mode="outlined"
                right={<TextInput.Icon icon={'chevron-down-circle-outline'} onPress={() => showActionSheet()} />}
            />

            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={true}
                drawUnderStatusBar={true}
                springOffset={50}
                defaultOverlayOpacity={0.3}
                containerStyle={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                <ScrollView {...scrollHandlers}>
                    <List.Section>
                        {OPTIONS.map(({ item, selected }, index) => (
                            <List.Item
                                key={index}
                                title={item}
                                onPress={() => onUpdateValue(index, selected)}
                                left={(props) => (
                                    <RadioButton.Android
                                        {...props}
                                        status={selected ? 'checked' : 'unchecked'}
                                        onPress={() => onUpdateValue(index, selected)}
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
        </>
    );
}
