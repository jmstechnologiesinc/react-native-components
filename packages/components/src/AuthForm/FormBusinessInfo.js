import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const FormBusinessInfo = ({
title,
labelStoreName,
labelAddress,
labelIndustry,
storeTitle,
storeAddress,
industry,
placeholder,
inputActionHandler,

 
}) => {
    return (
        <>
            <ScreenWrapper.Section title={title}>
                <TextInput
                    mode="outlined"
                    label={labelStoreName}
                    value={storeTitle}
                    onChangeText={(text) => inputActionHandler('storeTitle', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelAddress}
                    value={storeAddress}
                    placeholder={placeholder}
                    onChangeText={(text) => inputActionHandler('storeAddress', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelIndustry}
                    value={industry}
                    onChangeText={(text) => inputActionHandler('industry', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default FormBusinessInfo;
