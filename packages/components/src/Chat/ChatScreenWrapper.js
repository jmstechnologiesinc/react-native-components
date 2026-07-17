import React from 'react';

import { StyleSheet } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import ScreenWrapper from '../ScreenWrapper';

/**
 * The chat screen shell: the same mount as FormInputsScreenWrapper without a save button or
 * native ScrollView — the only combination that does not crash with the inverted list on
 * RN 0.85 (see the INVARIANTS in MessageList.js).
 *
 * It lives inside <Chat/> on purpose: if the consumer added its own KeyboardAvoidingView on
 * top, the list would re-measure and the Yoga crash would return.
 */
const ChatScreenWrapper = ({ withBottomInset = true, children }) => {
    const headerHeight = useHeaderHeight();

    return (
        <ScreenWrapper withScrollView={false} withBottomInset={withBottomInset}>
            <KeyboardAvoidingView
                style={styles.wrapper}
                behavior="padding"
                keyboardVerticalOffset={headerHeight}
            >
                {children}
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: MD3LightTheme.colors.background,
    },
});

export default ChatScreenWrapper;
