import React from 'react';

import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

const TNActivityIndicator = ({ isLoading = true }) =>
    isLoading ? (
        <View style={styles} collapsable={false} pointerEvents="box-none">
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
