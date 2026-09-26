import React from 'react';
import { StyleSheet } from 'react-native';

import { Avatar } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import { accessibilityProps } from '../accessibility';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { ChangedHelperText } from '../Form/FormField';

/**
 * A profile photo, display only (C-35): the web-safe counterpart of `ImagePicker.Avatar`, which picks
 * and removes the photo through native modules — as `PhotoGalleryDisplay` is `PhotoGallery`'s. Same
 * look: a Paper `Avatar.Image` of `photo` (a RESOLVED URI, never rewritten) centred in a section, or
 * `Avatar.Icon` without one, at the picker's default size. It is an `image` named `accessibilityLabel`
 * (default `global.profilePhoto`, or `global.noProfilePhoto` without a photo); `highlighted` adds the
 * «Changed» line.
 *
 * @param {{photo?: string, icon?: string, size?: number, accessibilityLabel?: string, highlighted?: boolean,
 *     testID?: string}} props testID default `avatar`
 */
const AvatarDisplay = ({
    photo,
    icon = 'account',
    size = moderateScale(150),
    accessibilityLabel,
    highlighted = false,
    testID = 'avatar',
}) => {
    const semantics = {
        accessible: true,
        ...accessibilityProps({
            role: 'image',
            label: accessibilityLabel ?? localized(photo ? 'global.profilePhoto' : 'global.noProfilePhoto'),
        }),
        testID,
    };
    return (
        <ScreenWrapper.Section style={styles.centered}>
            {photo ? (
                <Avatar.Image source={{ uri: photo }} size={size} {...semantics} />
            ) : (
                <Avatar.Icon icon={icon} size={size} {...semantics} />
            )}
            <ChangedHelperText visible={highlighted} />
        </ScreenWrapper.Section>
    );
};

const styles = StyleSheet.create({
    centered: {
        alignItems: 'center',
    },
});

export default AvatarDisplay;
