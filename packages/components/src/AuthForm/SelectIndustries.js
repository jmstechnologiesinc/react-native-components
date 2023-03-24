
import React, { useRef } from 'react'

import {
    TextInput,
    RadioButton,
    List,
    Button,

} from "@jmsstudiosinc/react-native-paper";

import { interpunct } from '@jmsstudiosinc/commons';
import ActionSheet from 'react-native-actions-sheet';

import {
    styles as JMSStyles,
} from '@jmsstudiosinc/react-native-components';


export default function SelectIndustries({ placeholder, OPTIONS, onUpdateValue, inputActionHandler }) {
   
    const actionSheetRef = useRef();

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const hideActionSheet = () => {
        actionSheetRef.current.hide();
    };

    const selectedItems = OPTIONS.filter(item => item.selected === true);
    const isSelect = selectedItems.map((item) => item.item)
    const itemSelected = interpunct(isSelect)

    

    return (
        <>

            <TextInput
                editable={false}
                multiline={true}
                value={itemSelected}
                placeholder={placeholder}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon={"chevron-down-circle-outline"}
                        onPress={() => showActionSheet()}
                    />

                }
            />

            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={true}
                drawUnderStatusBar={true}
                springOffset={50}
                defaultOverlayOpacity={0.3}
            >

                <List.Section>
                    {OPTIONS.map(({ item, selected }, index) => (
                        <List.Item
                            key={index}
                            title={item}
                            onPress={() => onUpdateValue(index, selected)}
                            left={(props) => <RadioButton.Android
                                {...props}
                                status={selected ? "checked" : "unchecked"}
                                onPress={() => onUpdateValue(index, selected)}
                            />}
                        />
                    ))}

                    <Button
                        mode="contained"
                        style={JMSStyles.fba}
                        onPress={() => {
                            inputActionHandler('industry', isSelect)
                            hideActionSheet()
                        }}

                    >SAVE</Button>
                </List.Section>

            </ActionSheet>
        </>

    )
}