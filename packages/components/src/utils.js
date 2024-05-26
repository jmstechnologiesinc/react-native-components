import { Linking, Platform } from 'react-native';
import Config from 'react-native-config';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';


export const makeLinkingCall = (phoneNumber) => {
    if (Platform.OS === 'android') {
        Linking.openURL(`tel: +${phoneNumber}`);
    } else {
        console.log('Call');
        Linking.openURL(`telprompt:: +${phoneNumber}`);
    }
};

function itemSeparator(index, length) {
    return (index === 0 && length > 1) || index < length - 1;
}

const showActionSheet = (actionSheetRef) => {
    actionSheetRef.current.show();
};

const hideActionSheet = (actionSheetRef) => {
    actionSheetRef.current.hide();
};


const imagekitUrl = (photos) => {
    const IMAGE_HEIGHT = moderateScale(195)
    const urlImageKit = `https://ik.imagekit.io/${Config.IMAGEKIT_URL}`;

    if (photos === null || photos === undefined) {
        return null;
    } else if (Array.isArray(photos)) {
        return photos.map(photo => {
            if (photo?.includes('https://')) {
                return photo;
            } else {
                return `${urlImageKit}/tr:h-${IMAGE_HEIGHT},q-100,f-jpg,pr-true/${photo}`;
            }
        });
    } else if (photos.includes?.('https://')) {
        return photos;
    } else {
        return `${urlImageKit}/${photos}`
    }
};

export { itemSeparator, showActionSheet, hideActionSheet, imagekitUrl };
