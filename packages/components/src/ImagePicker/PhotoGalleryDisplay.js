import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { HelperText, MD3LightTheme, useTheme } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { ChangedHelperText } from '../Form/FormField';

/**
 * The photos of a gallery, display only (C-35): the web-safe counterpart of
 * `ImagePicker.PhotoGallery`, which reorders and adds photos through native
 * modules. `photoUrls` are RESOLVED URIs — the host builds them (ImageKit,
 * signed URLs, …); this component never rewrites one. A horizontal strip,
 * each photo labelled «Photo i of n» for a screen reader, and an empty line
 * when there are none.
 */
const PhotoGalleryDisplay = ({
    photoUrls,
    title = localized('photos'),
    emptyLabel = localized('global.noPhotos'),
    highlighted = false,
    size = MD3LightTheme.spacing.x20,
    testID = 'photo-gallery',
}) => {
    const theme = useTheme();
    const photos = Array.isArray(photoUrls) ? photoUrls.filter(Boolean) : [];

    return (
        <ScreenWrapper.Section title={title}>
            {photos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} testID={testID}>
                    {photos.map((uri, index) => (
                        <Image
                            key={`${uri}.${index}`}
                            source={{ uri }}
                            accessible
                            accessibilityRole="image"
                            accessibilityLabel={localized('global.photoOf', { index: index + 1, count: photos.length })}
                            testID={`${testID}.photo.${index}`}
                            style={[
                                styles.photo,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: theme.roundness,
                                    backgroundColor: theme.colors.surfaceVariant,
                                },
                                index === photos.length - 1 && styles.last,
                            ]}
                        />
                    ))}
                </ScrollView>
            ) : (
                <View testID={`${testID}.empty`}>
                    <HelperText type="info" padding="none">
                        {emptyLabel}
                    </HelperText>
                </View>
            )}
            <ChangedHelperText visible={highlighted} />
        </ScreenWrapper.Section>
    );
};

const styles = StyleSheet.create({
    photo: {
        marginRight: MD3LightTheme.spacing.x2,
    },
    last: {
        marginRight: 0,
    },
});

export default PhotoGalleryDisplay;
