import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { Button } from '@jmsstudiosinc/react-native-paper';
import theme from '../../ReactNativePaper/styles/themes/v2/LightTheme';

import { faCamera } from '@fortawesome/pro-light-svg-icons';

const { colors } = theme;

export default {
    title: 'packages/Button',
    component: Button,
};

export const TextButton = () => (
    <ScrollView style={[styles.container]}>
        <View style={styles.row}>
            <Button onPress={() => {}} style={styles.button}>
                Default
            </Button>
            <Button buttonColor={colors.accent} onPress={() => {}} style={styles.button}>
                Custom
            </Button>
            <Button disabled onPress={() => {}} style={styles.button}>
                Disabled
            </Button>
            <Button icon={faCamera} onPress={() => {}} style={styles.button}>
                Icon
            </Button>
            <Button loading onPress={() => {}} style={styles.button}>
                Loading
            </Button>
        </View>
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    button: {
        margin: 4,
    },
});
