import { View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { moderateScale } from 'react-native-size-matters';
import { Avatar, MD3LightTheme, Text, TouchableRipple } from '@jmsstudiosinc/react-native-paper';
import ActionSheet from 'react-native-actionsheet';
import { onPressFromGallery } from '../ImagePicker/ImagePicker';

const AvatarPicker = ({
    photo,
    firstName,
    lastName,
    setProfilePictureFile,
    removeProfilePicture,
    takePhoto,
    chooseLabrary,
    removePhoto,
    carcel,
    titleAction,
}) => {
    const actionSheet = useRef(null);

    const showActionSheet = () => {
        actionSheet.current.show();
    };

    const onActionDone = (index) => {
        if (index == 1) {
            onPressFromGallery(setProfilePictureFile);
        }
        if (index == 2) {
            removeProfilePicture();
        }

        return;
    };

    return (
        <>
            <View style={styles.containerAvatar}>
                <ScreenWrapper.Section>
                    <TouchableRipple rippleColor={MD3LightTheme.colors.background} onPress={showActionSheet}>
                        {photo ? (
                            <Avatar.Image source={{ uri: photo }} size={moderateScale(150)} />
                        ) : (
                            <Avatar.Icon icon="account" size={moderateScale(150)} />
                        )}
                    </TouchableRipple>
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <Text variant="bodyLarge">{`${firstName} ${lastName}`}</Text>
                </ScreenWrapper.Section>
            </View>

            <ActionSheet
                ref={actionSheet}
                title={titleAction}
                options={[takePhoto, chooseLabrary, removePhoto, carcel]}
                cancelButtonIndex={3}
                onPress={(index) => {
                    onActionDone(index);
                }}
            />
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

export default AvatarPicker;
