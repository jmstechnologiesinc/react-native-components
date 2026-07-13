import React from 'react';

import { Image, Pressable, StyleSheet } from 'react-native';

import { IconButton, MD3Colors, MD3LightTheme, Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Visor a pantalla completa al pulsar la imagen de un mensaje.
 *
 * El fondo es el `scrim` del tema (el mismo negro con el que Paper oscurece detrás de un
 * diálogo) y el icono va en neutral100 de la paleta de referencia: sobre el scrim hace falta
 * blanco en los dos temas, así que aquí no vale onSurface, que se invierte con el tema.
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
