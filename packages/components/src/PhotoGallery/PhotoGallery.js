import React, { useEffect, useRef, useState } from 'react';

import { View, FlatList, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { MD3LightTheme, TouchableRipple, List  } from '@jmstechnologiesinc/react-native-paper';
import { USER_ROLES } from '@jmstechnologiesinc/user';


import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';

import FastImage from 'react-native-fast-image';
import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { localized }from '../Localization/Localization'

 
const renderSeparator = () => (
    <View
        style={{
            width: MD3LightTheme.spacing.x2,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos, onRemove, role }) => {

    const [selectedPhoto, setSelectedPhoto] = useState();
    const [selectedIndex, setSelectedIndex] = useState();
    const actionSheetRef = useRef();

    const insets = useSafeAreaInsets();

    useEffect(() => {
        setSelectedPhoto(photos?.[0])
    }, [photos])


    const showActionSheet = (index) => {
        actionSheetRef.current.show();
        setSelectedIndex(index)
    };

    const renderItem = ({ item, index }) => (
        <TouchableRipple onPress={() => role  === USER_ROLES.vendor ? showActionSheet(index) : setSelectedPhoto(item) }>
            <FastImage source={{ uri: item }} style={styles.photo} resizeMode={FastImage.resizeMode.stretch} />
        </TouchableRipple>
    );

    const OPTIONS = [
        {
            title: localized('Remove photo'),
            value: 'remove',
            icon: 'image-remove',
        },
        { title: localized('cancel'), value: 'cancel', icon: 'cancel' },
    ];

    const onActionDone = async (value) => {
        if (value === 'remove') {
            onRemove(selectedIndex);
            actionSheetRef.current.hide();
        } else if (value === 'cancel') {
            actionSheetRef.current.hide();
        }
    };


    return (
        <>
            {
                role === USER_ROLES.vendor ? <ScreenWrapperSection>
                    <FlatList
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => `photo-gallery-${index}`}
                    />
                </ScreenWrapperSection> : 
                <>
                    {selectedPhoto && <FastImage source={{ uri: Array.isArray(photos) ? selectedPhoto : photos }} style={styles.mainImage} resizeMode={FastImage.resizeMode.stretch} />}
                    {photos?.length > 1 && (
                        <ScreenWrapperSection>
                            <FlatList
                                data={photos}
                                horizontal
                                ItemSeparatorComponent={renderSeparator}
                                renderItem={renderItem}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, index) => `photo-gallery-${index}`}
                            />
                        </ScreenWrapperSection>
                    )}
                </>
            }

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

const styles = StyleSheet.create({
    mainImage: {
        height: moderateScale(195),
    },
    photo: {
        height: moderateScale(65),
        width: moderateScale(65),
    },
});

export default PhotoGallery;
