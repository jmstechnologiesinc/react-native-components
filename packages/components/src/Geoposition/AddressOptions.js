import React from 'react';

import { StyleSheet } from 'react-native';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import { localized, ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const AddressOptions = ({ state, onChange }) => (
    <ScreenWrapper.Container>
        <ScreenWrapper.Section title={localized('addressInfo')}>
            <TextInput
                mode="outlined"
                label={localized('floor#')}
                value={state.floorNumber}
                onChangeText={(text) => onChange('floorNumber', text)}
            />
        </ScreenWrapper.Section>
        <ScreenWrapper.Section>
            <TextInput
                mode="outlined"
                label={localized('buildingBusinessName')}
                value={state.buildingName}
                onChangeText={(text) => onChange('buildingName', text)}
            />
        </ScreenWrapper.Section>
        <ScreenWrapper.Section>
            <TextInput
                mode="outlined"
                style={[styles.textArea]}
                label={localized('note')}
                multiline
                placeholder={localized('instructionsDelivery')}
                value={state.note}
                onChangeText={(text) => onChange('note', text)}
            />
        </ScreenWrapper.Section>
    </ScreenWrapper.Container>
);

const styles = StyleSheet.create({
    textArea: {
        height: moderateScale(80),
    },
});

export default AddressOptions;
