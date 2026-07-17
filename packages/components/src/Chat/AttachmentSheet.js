import React, { useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { Divider, List, MD3LightTheme, Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

import * as ImagePicker from '../ImagePicker/ImagePicker';
import { localized } from '../Localization/Localization';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

/**
 * Attachment sheet: camera or gallery. Equivalent of the library's `Actions` + ActionSheet.
 *
 * Uses the package's ImagePickerAPI (same as ProfileForm or ProductItemFormScreen): it
 * already handles permissions and returns the react-native-image-picker asset. The picker is
 * a native screen, so it only opens once the modal is already dismissing — otherwise they
 * compete for the presentation on iOS. The container uses MD3's "extra large" shape, the
 * dialogs' one.
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
        borderRadius: roundness * moderateScale(7),
        overflow: 'hidden',
    },
});

export default AttachmentSheet;
