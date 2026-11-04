import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { Avatar as PaperAvatar, MD3LightTheme, TouchableRipple, List } from '@jmstechnologiesinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ImagePickerAPI from './ImagePickerAPI';
import { localized } from '../Localization/Localization';

import ScreenWrapper from '../ScreenWrapper';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';
import { Platform } from 'react-native';

export const IMAGE_PICKER_ACTIONS = {
    launchCamera: 'launchCamera',
    launchImageLibrary: 'launchImageLibrary',
    removeImage: 'removeImage',
    cancel: 'cancel',
};

/**
 * The photo picker: a camera / library / cancel sheet, opened by an avatar (`variant="avatar"`), by a text button
 * (`variant="button"`), or, with `variant="sheet"`, by the caller's own control through the ref's `show()` — so a
 * caller can put a Paper `Button` straight inside its own container (a `Card.Actions` styles only its direct children).
 * Where the sheet would offer a single choice (the web, which has no camera option, without extra `options`), opening
 * it takes that choice instead. `onChange(asset)` gets each photo picked; a pick cancelled or refused calls nothing.
 * `captureOptions` (react-native-image-picker's options, e.g. a maximum size) are laid over the picker's defaults.
 */
const Avatar = forwardRef(function Avatar(
    {
        photo,
        onChange,
        onRemove,
        title,
        variant = 'avatar',
        icon = 'account',
        size = moderateScale(150),
        options = [],
        isDisabled,
        captureOptions,
    },
    ref
) {
    const imagePickerRef = useRef();
    const actionSheetRef = useRef();
    const launching = useRef(false);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        imagePickerRef.current = new ImagePickerAPI({
            titlePermissionCamera: localized('cameraPermissionDenied'),
            titlePermissionPhotos: localized('allowAccessToPhotos'),
            descriptionPermissionCamera: localized('enableCameraPermission'),
            descriptionPermissionPhotos: localized('enablePhotosPermission'),
            cancelPermission: localized('global.cancel'),
            settingPermission: localized('goToSettings'),
            titleFailure: localized('global.somethingWentWrong'),
            descriptionFailure: localized('global.tryAgainLater'),
            closeFailure: localized('global.close'),
        });
    }, []);

    // The sheet stays open after a pick cancelled or refused, so another source can be chosen. The pick ends after the
    // picker's own screen closes, by when the caller may have taken this sheet away.
    const launch = async (pick) => {
        launching.current = true;
        try {
            const asset = await pick();
            if (asset) {
                onChange(asset);
                actionSheetRef.current?.hide();
            }
        } finally {
            launching.current = false;
        }
    };

    const onActionDone = (value) => {
        // A tap while the picker is still opening would launch it a second time.
        if (launching.current) return;
        if (value === IMAGE_PICKER_ACTIONS.launchCamera) {
            launch(() => imagePickerRef.current.takePhoto(captureOptions));
        } else if (value === IMAGE_PICKER_ACTIONS.launchImageLibrary) {
            launch(() => imagePickerRef.current.chooseFromLibrary(captureOptions));
        } else if (value === IMAGE_PICKER_ACTIONS.removeImage) {
            onRemove();
            actionSheetRef.current.hide();
        } else if (value === IMAGE_PICKER_ACTIONS.cancel) {
            actionSheetRef.current.hide();
        }
    };

    const OPTIONS = [
        ...(Platform.OS !== 'web'
            ? [
                  {
                      title: localized('takePhoto'),
                      value: IMAGE_PICKER_ACTIONS.launchCamera,
                      icon: 'camera',
                  },
              ]
            : []),
        {
            title: localized('chooseFromLibrary'),
            value: IMAGE_PICKER_ACTIONS.launchImageLibrary,
            icon: 'folder-image',
        },
        ...options,
        { title: localized('cancel'), value: IMAGE_PICKER_ACTIONS.cancel, icon: 'cancel' },
    ];
    const choices = OPTIONS.filter(({ value }) => value !== IMAGE_PICKER_ACTIONS.cancel);

    const showActionSheet = () => {
        if (choices.length === 1) onActionDone(choices[0].value);
        else actionSheetRef.current.show();
    };

    // Recreated on every render: `show()` may launch the picker itself, and must hand the photo to the current
    // `onChange`, not the first render's.
    useImperativeHandle(ref, () => ({ show: showActionSheet }));

    // What opens the sheet: the avatar, the text button, or nothing of its own (`sheet`: the caller's control, `show()`).
    let trigger = null;
    if (variant === 'avatar') {
        trigger = (
            <ScreenWrapper.Section style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
        );
    } else if (variant !== 'sheet') {
        trigger = (
            <ButtonWrapper
                title={title}
                isDisabled={isDisabled}
                onPress={isDisabled ? null : showActionSheet}
                style={{ marginLeft: 0 }}
            />
        );
    }

    return (
        <>
            {trigger}

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
});

export default Avatar;
