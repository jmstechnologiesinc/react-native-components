import { View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { moderateScale } from 'react-native-size-matters';
import { Avatar, MD3LightTheme, Text, TouchableRipple, List } from '@jmsstudiosinc/react-native-paper';
import { onPressFromGallery } from '../ImagePicker/ImagePicker';
import ActionSheet from 'react-native-actions-sheet';

const AvatarPicker = ({ photo, firstName, lastName, setProfilePictureFile, removeProfilePicture, options }) => {
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
        if (index == 3) {
            actionSheet.current.hide();
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
            <ScreenWrapper.Section>
                <ActionSheet
                    ref={actionSheet}
                    statusBarTranslucent={false}
                    drawUnderStatusBar={false}
                    gestureEnabled
                    containerStyle={{
                        paddingHorizontal: moderateScale(12),
                    }}
                    springOffset={50}
                    defaultOverlayOpacity={0.3}
                >
                    <List.Section>
                        {options.map(({ title, icon }, index) => (
                            <List.Item
                                key={index}
                                title={title}
                                onPress={() => onActionDone(index)}
                                left={(props) => <List.Icon {...props} icon={icon} />}
                            />
                        ))}
                    </List.Section>
                </ActionSheet>
            </ScreenWrapper.Section>
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
