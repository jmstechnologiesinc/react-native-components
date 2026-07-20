import React from 'react';

import { StyleSheet } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import ScreenWrapper from '../ScreenWrapper';

/**
 * Pantalla del chat: el mismo montaje que FormInputsScreenWrapper sin botón de guardar ni
 * ScrollView nativo, que es la única combinación que no crashea con la lista invertida en
 * RN 0.85 (ver los INVARIANTES en MessageList.js).
 *
 * Vive dentro de <Chat/> a propósito: si el consumidor añadiera su propio KeyboardAvoidingView
 * por encima, la lista se re-mide y vuelve el crash de Yoga.
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
