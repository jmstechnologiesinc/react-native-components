import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { Avatar as componentAvatar, MD3LightTheme, TouchableRipple, List } from '@jmsstudiosinc/react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import ImagePickerAPI from './ImagePickerAPI';
import { IMAGE_PICKER_ACTIONS } from './utils';

const Avatar = ({ photo, imagePickerOptions, options }) => {
    const actionSheetRef = useRef(null);
    const ImagePickerRef = useRef();

    useEffect(() => {
        ImagePickerRef.current = new ImagePickerAPI(
            'Camera permission denied',
            'To have access to the camera you must enable the camera permission in your application settings',
            'Cancel',
            'Go to Settings'
        );
    }, []);

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const onActionDone = (value) => {
        if (value === IMAGE_PICKER_ACTIONS.launchCamera) {
            ImagePickerRef.current.oneTakePhoto(imagePickerOptions);
        }
        if (value === IMAGE_PICKER_ACTIONS.launchImageLibrary) {
            ImagePickerRef.current.chooseFromLibrary(imagePickerOptions);
        }
        if (value === IMAGE_PICKER_ACTIONS.removeImage) {
            console.log('remove');
        }
        if (value === IMAGE_PICKER_ACTIONS.cancel) {
            actionSheetRef.current.hide();
        }
    };

    return (
        <>
            <View style={styles.containerAvatar}>
                <TouchableRipple rippleColor={MD3LightTheme.colors.background} onPress={showActionSheet}>
                    {photo ? (
                        <componentAvatar.Image source={{ uri: photo }} size={moderateScale(150)} />
                    ) : (
                        <componentAvatar.Icon icon="account" size={moderateScale(150)} />
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
