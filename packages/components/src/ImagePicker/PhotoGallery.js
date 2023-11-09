
import React, { useRef } from 'react'
import ImagePicker from './ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import ImageGallery from '../PhotoGallery/PhotoGallery'
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { imagekitUrl } from '../utils'

import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List } from '@jmstechnologiesinc/react-native-paper';


const PhotoGallery = ({ onChange, onRemove, photos  }) => {

    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();

    const onLongPress = () => {
        actionSheetRef.current.show();
    };


    const OPTIONS = [
        {
            title: localized('Remove photo'),
            value: 'remove',
            icon: 'image-remove',
        },
        { title: localized('cancel'), value: 'cancel', icon: 'cancel' },
    ];

    const onActionDone = async (value, index) => {
        if (value === 'remove') {
            onRemove(index);
            actionSheetRef.current.hide();
        } else if (value === 'cancel') {
            actionSheetRef.current.hide();
        }
    };
    return (
        <>
            <ScreenWrapper.Section title={localized('Photos')}>
                <ImageGallery
                    onLongPress={onLongPress}
                    photos={photos?.map((photo) => {
                        if (photo.uri) {
                            return photo.uri;
                        } else {
                            return imagekitUrl(photo);
                        }
                    })}
                />
            </ScreenWrapper.Section>
            <ImagePicker
                variant="button"
                title={localized('Add Photo')}
                withPaddingHorizontal={false}
                onChange={onChange}

            />

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
                                    onActionDone(value, index);
                                }}
                                left={(props) => <List.Icon {...props} icon={icon} />}
                            />
                        );
                    })}
                </List.Section>
            </ActionSheet>
        </>
    )
}

export default PhotoGallery

