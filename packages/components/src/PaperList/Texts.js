import React from 'react';
import { Text } from '@jmsstudiosinc/react-native-paper';
import { ScrollView, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const TextComponent = () => {
    return (
        <ScrollView>
            <Text style={styles.text} variant="displayLarge">
                Display Large
            </Text>
            <Text style={styles.text} variant="displayMedium">
                Display Medium
            </Text>
            <Text style={styles.text} variant="displaySmall">
                Display small
            </Text>

            <Text style={styles.text} variant="headlineLarge">
                Headline Large
            </Text>
            <Text style={styles.text} variant="headlineMedium">
                Headline Medium
            </Text>
            <Text style={styles.text} variant="headlineSmall">
                Headline Small
            </Text>

            <Text style={styles.text} variant="titleLarge">
                Title Large
            </Text>
            <Text style={styles.text} variant="titleMedium">
                Title Medium
            </Text>
            <Text style={styles.text} variant="titleSmall">
                Title Small
            </Text>

            <Text style={styles.text} variant="labelLarge">
                Label Large
            </Text>
            <Text style={styles.text} variant="labelMedium">
                Label Medium
            </Text>
            <Text style={styles.text} variant="labelSmall">
                Label Small
            </Text>

            <Text style={styles.text} variant="bodyLarge">
                Body Large
            </Text>
            <Text style={styles.text} variant="bodyMedium">
                Body Medium
            </Text>
            <Text style={styles.text} variant="bodySmall">
                Body Small
            </Text>
        </ScrollView>
    );
};

export default TextComponent;
const styles = StyleSheet.create({
    container: {
        padding: moderateScale(16),
    },
    text: {
        marginVertical: moderateScale(4),
    },
});
