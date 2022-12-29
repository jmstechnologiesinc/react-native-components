import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { Avatar as PaperAvatar, MD3LightTheme, TouchableRipple, List } from '@jmsstudiosinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import ImagePickerAPI from './ImagePickerAPI';
import { IMAGE_PICKER_ACTIONS } from './utils';
import { options } from './utils';
import { localized } from '../Localization/Localization';

const Avatar = ({ photo, onChange, onRemove, icon = 'account', size = moderateScale(150), isDisabled }) => {
    const imagePickerRef = useRef();
    const actionSheetRef = useRef();

    useEffect(() => {
        imagePickerRef.current = new ImagePickerAPI(
            (titlePermissionCamera = localized('Camera permission denied')),
            (titlePermissionPhotos = localized('Please allow access to your photos')),
            (descriptionPermissionCamera = localized(
                'To have access to the camera you must enable the camera permission in your application settings'
            )),
            (descriptionPermissionPhotos = localized(
                'To have access to the photos you must enable the photos permission in your application settings'
            )),
            (cancelPermission = localized('Cancel')),
            (settingPermission = localized('Go to Settings'))
        );
    }, []);

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const onActionDone = async (value) => {
        if (value === IMAGE_PICKER_ACTIONS.launchCamera) {
            imagePickerRef.current.takePhoto().then((rep) => {
                onChange(rep);
                actionSheetRef.current.hide();
            });
        }
        if (value === IMAGE_PICKER_ACTIONS.launchImageLibrary) {
            imagePickerRef.current.chooseFromLibrary().then((rep) => {
                onChange(rep);
                actionSheetRef.current.hide();
            });
        }
        if (value === IMAGE_PICKER_ACTIONS.removeImage) {
            onRemove();
            actionSheetRef.current.hide();
        }
        if (value === IMAGE_PICKER_ACTIONS.cancel) {
            actionSheetRef.current.hide();
        }
        return;
    };

    return (
        <>
            <View style={styles.containerAvatar}>
                <TouchableRipple
                    rippleColor={MD3LightTheme.colors.background}
                    onPress={isDisabled ? null : showActionSheet}
                >
                    {photo ? (
                        <PaperAvatar.Image source={{ uri: photo }} size={size} />
                    ) : (
                        <PaperAvatar.Icon icon={icon} size={size} />
                    )}
                </TouchableRipple>
            </View>
            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={false}
                drawUnderStatusBar={false}
                gestureEnabled
                springOffset={50}
                defaultOverlayOpacity={0.3}
            >
                <List.Section>
                    {options.map(({ title, icon, value }, index) => (
                        <List.Item
                            key={index}
                            title={title}
                            onPress={() => {
                                onActionDone(value);
                            }}
                            left={(props) => <List.Icon {...props} icon={icon} />}
                        />
                    ))}
                </List.Section>
            </ActionSheet>
        </>
    );
};

const styles = StyleSheet.create({
    containerAvatar: {
        flex: 1,
        alignItems: 'center',
        marginTop: MD3LightTheme.spacing.x4,
    },
});

export default Avatar;
