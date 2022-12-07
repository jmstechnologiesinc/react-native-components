import React, { useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { IMLocalized, setI18nConfig } from '../IMLocalization';

const Localization = () => {
    useEffect(() => {
        setI18nConfig();
    }, [setI18nConfig()]);
    return (
        <SafeAreaView>
            <Text>{IMLocalized('Update Profile')}</Text>
            <Text>{IMLocalized('Settings')}</Text>
            <Text>Currency: {IMLocalized('Currency')}</Text>
        </SafeAreaView>
    );
};

export default Localization;
