import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '@jmstechnologiesinc/react-native-components/lib/ScreenWrapper';

const OrDividerContainer = () => {
    return (
        <>
            <ScreenWrapper.Section>
                <View style={styles.orTextContainer}>
                    <Divider style={styles.dividerStyle} />
                    <Text style={styles.orTextStyle}> {'OR'}</Text>
                    <Divider style={styles.dividerStyle} />
                </View>
            </ScreenWrapper.Section>
        </>
    );
};

const styles = StyleSheet.create({
    orTextContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: MD3LightTheme.spacing.x3
    },
    orTextStyle: {
        width: '15%',
        alignItems: 'center',
        textAlign: 'center',
    },
    dividerStyle: {
        width: '41%',
        alignSelf: 'center',
    },
});

export default OrDividerContainer;