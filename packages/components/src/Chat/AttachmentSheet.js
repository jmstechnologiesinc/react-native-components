import React, { useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { Divider, List, MD3LightTheme, Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

import * as ImagePicker from '../ImagePicker/ImagePicker';
import { localized } from '../Localization/Localization';

/**
 * Hoja de adjuntos: cámara o galería. Equivale al `Actions` + ActionSheet de la librería.
 *
 * Usa el ImagePickerAPI del paquete de componentes (el mismo que ProfileForm o
 * ProductItemFormScreen): ya resuelve permisos y devuelve el asset de react-native-image-picker.
 */
const AttachmentSheet = ({ isVisible, onDismiss, onPick, labels }) => {
    const theme = useTheme();

    const imagePicker = useMemo(
        () =>
            new ImagePicker.ImagePickerAPI({
                titlePermissionCamera: localized('titlePermissionCamera'),
                titlePermissionPhotos: localized('titlePermissionPhotos'),
                descriptionPermissionCamera: localized('descriptionPermissionCamera'),
                descriptionPermissionPhotos: localized('descriptionPermissionPhotos'),
                cancelPermission: localized('cancel'),
                settingPermission: localized('settings'),
            }),
        []
    );

    const options = [
        {
            title: labels.takePhoto,
            icon: 'camera',
            pick: () => imagePicker.takePhoto(),
        },
        {
            title: labels.chooseFromLibrary,
            icon: 'image-multiple',
            pick: () => imagePicker.chooseFromLibrary(),
        },
    ];

    return (
        <Portal>
            <Modal
                visible={isVisible}
                onDismiss={onDismiss}
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.elevation.level3 },
                ]}
            >
                {options.map((option, index) => (
                    <React.Fragment key={option.title}>
                        {index > 0 ? <Divider /> : null}
                        <List.Item
                            title={option.title}
                            left={(props) => <List.Icon {...props} icon={option.icon} />}
                            onPress={() => {
                                onDismiss();
                                // El picker es una pantalla nativa: solo se abre cuando el modal
                                // ya se está cerrando, si no compiten por la presentación en iOS.
                                setTimeout(() => {
                                    option.pick().then((asset) => {
                                        if (asset?.uri) {
                                            onPick(asset);
                                        }
                                    });
                                }, 300);
                            }}
                        />
                    </React.Fragment>
                ))}
            </Modal>
        </Portal>
    );
};

const { spacing, roundness } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacing.x6,
        // Forma "extra large" de MD3, la de los diálogos.
        borderRadius: roundness * 7,
        overflow: 'hidden',
    },
});

export default AttachmentSheet;
