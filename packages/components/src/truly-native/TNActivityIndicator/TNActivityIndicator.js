import React from 'react';

import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

const TNActivityIndicator = ({ isLoading = true }) =>
    isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: MD3LightTheme.colors.background, }} collapsable={false} pointerEvents="box-none">
            <ActivityIndicator size="large" />
        </View>
    ) : null;

const styles = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: MD3LightTheme.colors.background,
    justifyContent: 'center',
    zIndex: 1,
    
};

export default TNActivityIndicator;
