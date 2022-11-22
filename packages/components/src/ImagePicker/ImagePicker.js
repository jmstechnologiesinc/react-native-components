import { View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { Avatar, MD3LightTheme, TouchableRipple, List } from '@jmsstudiosinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import ImagePickerAPI from './ImagePickerAPI';

const ImagePicker = ({
    photo,
    setProfilePictureFile,
    removeProfilePicture,
    options,
    titlePermission,
    descriptionPermission,
    carcelPermission,
    settingPermission,
}) => {
    const actionSheet = useRef(null);

    const ImagePickerRef = new ImagePickerAPI(
        'Camera permission denied',
        'To have access to the camera you must enable the camera permission in your application settings',
        'Cancel',
        'Go to Settings'
    );

    const showActionSheet = () => {
        actionSheet.current.show();
    };

    const onActionDone = (value) => {
        if (value === 'launchCamera') {
            ImagePickerRef.oneTakePhoto(setProfilePictureFile);
        }
    };

    return (
        <>
            <View style={styles.containerAvatar}>
                <TouchableRipple rippleColor={MD3LightTheme.colors.background} onPress={showActionSheet}>
                    {photo ? (
                        <Avatar.Image source={{ uri: photo }} size={moderateScale(150)} />
                    ) : (
                        <Avatar.Icon icon="account" size={moderateScale(150)} />
                    )}
                </TouchableRipple>
            </View>

            <ActionSheet
                ref={actionSheet}
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

export default ImagePicker;
