import React, { useEffect, useRef, useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { Avatar as PaperAvatar, List, Button } from '@jmsstudiosinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import ImagePickerAPI from './ImagePickerAPI';
import { IMAGE_PICKER_ACTIONS } from './utils';
import { OPTIONS } from './utils';
import { localized } from '../Localization/Localization';
import { MATERIAL_ICONS } from '@jmsstudiosinc/commons';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import styles from '../styles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ImagePickerButton = ({ title, onChange, size = moderateScale(150), isLoading }) => {
    const imagePickerRef = useRef();
    const actionSheetRef = useRef();
    const [isSelectedPhoto, setIsSelectedPhoto] = useState(null);

    const insets = useSafeAreaInsets();
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
                setIsSelectedPhoto(rep);
            });
        }
        if (value === IMAGE_PICKER_ACTIONS.launchImageLibrary) {
            imagePickerRef.current.chooseFromLibrary().then((rep) => {
                setIsSelectedPhoto(rep);
            });
        }
        if (value === IMAGE_PICKER_ACTIONS.cancel) {
            actionSheetRef.current.hide();
            setIsSelectedPhoto(null);
        }
        return;
    };

    return (
        <>
            <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row' }}>
                <Button icon={MATERIAL_ICONS.addDocument} onPress={showActionSheet} mode="outlined">
                    {localized(`Add New ${title}`)}
                </Button>
            </ScreenWrapper.Section>

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
                    <ScreenWrapper.Section
                        withPaddingHorizontal
                        style={{ flexDirection: 'row', justifyContent: 'center' }}
                    >
                        {isSelectedPhoto ? (
                            <PaperAvatar.Image source={{ uri: isSelectedPhoto?.uri }} size={size} />
                        ) : (
                            <PaperAvatar.Icon icon={MATERIAL_ICONS.addDocument} size={size} />
                        )}
                    </ScreenWrapper.Section>

                    {OPTIONS.map(({ title, icon, value }, index) => (
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

                <Button
                    mode="contained"
                    style={styles.fba}
                    loading={isLoading}
                    disabled={isSelectedPhoto === null || isLoading}
                    onPress={() => {
                        onChange(isSelectedPhoto);
                    }}
                >
                    {localized('SAVE')}
                </Button>
            </ActionSheet>
        </>
    );
};

export default ImagePickerButton;
