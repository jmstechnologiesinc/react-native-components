import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { Avatar as PaperAvatar, MD3LightTheme, TouchableRipple, List } from '@jmsstudiosinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import ImagePickerAPI from './ImagePickerAPI';
import { IMAGE_PICKER_ACTIONS } from './utils';
import { options } from './utils';

const Avatar = ({
    photo,
    onChange,
    onRemove,
    titlePermissionCamera,
    titlePermissionPhotos,
    descriptionPermissionCamera,
    descriptionPermissionPhotos,
    cancelPermission,
    settingPermission,
}) => {
    const imagePickerRef = useRef();
    const actionSheetRef = useRef();

    useEffect(() => {
        imagePickerRef.current = new ImagePickerAPI(
            titlePermissionCamera,
            titlePermissionPhotos,
            descriptionPermissionCamera,
            descriptionPermissionPhotos,
            cancelPermission,
            settingPermission
        );
    }, []);

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const onActionDone = (value) => {
        if (value === IMAGE_PICKER_ACTIONS.launchCamera) {
            imagePickerRef.current.takePhoto(onChange, actionSheetRef);
        }
        if (value === IMAGE_PICKER_ACTIONS.launchImageLibrary) {
            imagePickerRef.current.chooseFromLibrary(onChange, actionSheetRef);
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
                <TouchableRipple rippleColor={MD3LightTheme.colors.background} onPress={showActionSheet}>
                    {photo ? (
                        <PaperAvatar.Image source={{ uri: photo }} size={moderateScale(150)} />
                    ) : (
                        <PaperAvatar.Icon icon="account" size={moderateScale(150)} />
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
