import React, { useEffect, useRef } from 'react';
import { moderateScale } from 'react-native-size-matters';
import {
    Avatar as PaperAvatar,
    MD3LightTheme,
    TouchableRipple,
    List,
    Button,
} from '@jmstechnologiesinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ImagePickerAPI from './ImagePickerAPI';
import { localized } from '../Localization/Localization';

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

export const IMAGE_PICKER_ACTIONS = {
    launchCamera: 'launchCamera',
    launchImageLibrary: 'launchImageLibrary',
    removeImage: 'removeImage',
    cancel: 'cancel',
};

const Avatar = ({
    photo,
    onChange,
    onRemove,
    title,
    variant = 'avatar',
    icon = 'account',
    defaultIcon = MATERIAL_ICONS.addDocument,
    size = moderateScale(150),
    options = [],
    isDisabled,
}) => {
    const imagePickerRef = useRef();
    const actionSheetRef = useRef();

    const insets = useSafeAreaInsets();

    useEffect(() => {
        imagePickerRef.current = new ImagePickerAPI({
            titlePermissionCamera: localized('cameraPermissionDenied'),
            titlePermissionPhotos: localized('allowAccessToPhotos'),
            descriptionPermissionCamera: localized('enableCameraPermission'),
            descriptionPermissionPhotos: localized('enablePhotosPermission'),
            cancelPermission: localized('global.cancel'),
            settingPermission: localized('goToSettings'),
        });
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
        } else if (value === IMAGE_PICKER_ACTIONS.launchImageLibrary) {
            imagePickerRef.current.chooseFromLibrary().then((rep) => {
                onChange(rep);
                actionSheetRef.current.hide();
            });
        } else if (value === IMAGE_PICKER_ACTIONS.removeImage) {
            onRemove();
            actionSheetRef.current.hide();
        } else if (value === IMAGE_PICKER_ACTIONS.cancel) {
            actionSheetRef.current.hide();
        }
    };

    const OPTIONS = [
        { title: localized('takePhoto'), value: IMAGE_PICKER_ACTIONS.launchCamera, icon: 'camera' },
        {
            title: localized('chooseFromLibrary'),
            value: IMAGE_PICKER_ACTIONS.launchImageLibrary,
            icon: 'folder-image',
        },
        ...options,
        { title: localized('cancel'), value: IMAGE_PICKER_ACTIONS.cancel, icon: 'cancel' },
    ];

    return (
        <>
            {variant === 'avatar' ? (
                <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                </ScreenWrapper.Section>
            ) : (
                <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row' }}>
                    <Button
                        icon={defaultIcon}
                        onPress={isDisabled ? null : showActionSheet}
                        mode="outlined"
                    >
                        {localized(title)}
                    </Button>
                </ScreenWrapper.Section>
            )}

            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={false}
                drawUnderStatusBar={false}
                gestureEnabled
                springOffset={50}
                defaultOverlayOpacity={0.3}
                containerStyle={{
                    paddingBottom: insets.bottom,
                }}
            >
                <List.Section>
                    {OPTIONS.map(({ title, icon, value }, index) => {
                        return (
                            <List.Item
                                key={index}
                                title={title}
                                onPress={() => {
                                    onActionDone(value);
                                }}
                                left={(props) => <List.Icon {...props} icon={icon} />}
                            />
                        );
                    })}
                </List.Section>
            </ActionSheet>
        </>
    );
};

export default Avatar;
