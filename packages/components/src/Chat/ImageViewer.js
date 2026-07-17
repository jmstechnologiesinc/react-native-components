import React from 'react';

import { Image, Pressable, StyleSheet } from 'react-native';

import { IconButton, MD3Colors, MD3LightTheme, Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Full-screen viewer for a message image.
 *
 * The backdrop is the theme `scrim` (the same black Paper dims behind a dialog) and the
 * close icon uses neutral100 from the reference palette: over the scrim it must be white in
 * both themes, so onSurface — which flips with the theme — is not an option.
 */
const ImageViewer = ({ uri, onDismiss }) => {
    const theme = useTheme();

    return (
        <Portal>
            <Modal
                visible={!!uri}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.container, { backgroundColor: theme.colors.scrim }]}
            >
                <Pressable style={styles.backdrop} onPress={onDismiss}>
                    <Image source={{ uri }} style={styles.image} resizeMode="contain" />
                </Pressable>
                <IconButton
                    icon="close"
                    iconColor={MD3Colors.neutral100}
                    style={styles.close}
                    onPress={onDismiss}
                    accessibilityLabel="Cerrar"
                />
            </Modal>
        </Portal>
    );
};

const { spacing } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    close: {
        position: 'absolute',
        top: spacing.x2,
        right: spacing.x2,
    },
});

export default ImageViewer;
